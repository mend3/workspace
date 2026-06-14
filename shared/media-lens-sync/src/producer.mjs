import {
  loadPrecisDb,
  buildSyncPayload,
  buildSourceSeeds,
  buildAnalysisCandidates,
} from './precis.mjs';
import { createHubClient } from './hub.mjs';
import { queue, JOB_OPTS } from './queue.mjs';

/**
 * Producer: a cada ciclo le o TinyDB do precis, sincroniza o catalogo no hub
 * (upsert idempotente) e enfileira jobs assincronos para o que ainda falta —
 * uma analise LLM por artigo pendente, um enriquecimento por fonte pendente, e
 * um recompute de KPI. O hub e a fonte da verdade do que esta pendente
 * (`GET /internal/pending`), entao reenfileirar e idempotente (jobId estavel).
 */
export async function runProducerCycle(env, log) {
  const hub = createHubClient({ baseUrl: env.hubUrl, token: env.token });
  const db = await loadPrecisDb(env.dbPath);

  const sync = buildSyncPayload(db);
  const syncRes = await hub.postSync(sync);
  log(
    `SYNC sources=${sync.sources.length} articles=${sync.articles.length} contents=${sync.contents.length} -> ${JSON.stringify(syncRes)}`
  );

  const pending = await hub.getPending();

  const candidates = new Map(
    buildAnalysisCandidates(db).map((c) => [c.precisEntryId, c])
  );
  let enqAnalyze = 0;
  for (const entryId of pending.analysis ?? []) {
    const c = candidates.get(entryId);
    if (!c) continue;
    await queue.add('analyze', c, { ...JOB_OPTS, jobId: `analyze-${entryId}` });
    enqAnalyze += 1;
  }

  const seeds = new Map(
    buildSourceSeeds(db).map((s) => [s.precisFeedId, s])
  );
  let enqEnrich = 0;
  for (const feedId of pending.enrich ?? []) {
    const s = seeds.get(feedId);
    if (!s) continue;
    await queue.add('enrich', s, { ...JOB_OPTS, jobId: `enrich-${feedId}` });
    enqEnrich += 1;
  }

  await queue.add(
    'recompute-kpi',
    {},
    { ...JOB_OPTS, jobId: 'recompute-kpi', delay: 30000 }
  );

  log(
    `enfileirados: analyze=${enqAnalyze} enrich=${enqEnrich} (+recompute-kpi). pendentes no hub: analysis=${(pending.analysis ?? []).length} enrich=${(pending.enrich ?? []).length}`
  );
}
