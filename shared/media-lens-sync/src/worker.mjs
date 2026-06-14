import { Worker } from 'bullmq';
import { connection, QUEUE_NAME } from './queue.mjs';
import { analyzeArticle, enrichSource } from './ollama.mjs';
import { createHubClient } from './hub.mjs';

/**
 * Worker: consome a fila `media-lens` de forma assincrona e concorrente.
 *  - analyze: roda a analise LLM (ollama) do artigo e faz POST /internal/analysis.
 *  - enrich:  enriquece a fonte (ollama) e faz POST /internal/enrich-source.
 *  - recompute-kpi: dispara POST /internal/recompute-kpi.
 * Falhas lancam excecao -> BullMQ aplica retry/backoff conforme JOB_OPTS.
 */
export function startWorker(env, log) {
  const hub = createHubClient({ baseUrl: env.hubUrl, token: env.token });

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      if (job.name === 'analyze') {
        const a = await analyzeArticle({
          baseUrl: env.ollamaUrl,
          model: env.ollamaModel,
          article: job.data,
        });
        if (!a) throw new Error('analise inutilizavel (LLM)');
        return hub.postAnalysis([{ precisEntryId: job.data.precisEntryId, ...a }]);
      }
      if (job.name === 'enrich') {
        const e = await enrichSource({
          baseUrl: env.ollamaUrl,
          model: env.ollamaModel,
          source: job.data,
        });
        if (!e) throw new Error('enriquecimento inutilizavel (LLM)');
        return hub.postEnrich([{ precisFeedId: job.data.precisFeedId, ...e }]);
      }
      if (job.name === 'recompute-kpi') {
        return hub.postRecomputeKpi();
      }
      throw new Error(`job desconhecido: ${job.name}`);
    },
    { connection, concurrency: env.concurrency }
  );

  worker.on('completed', (job) =>
    log(`✓ ${job.name} ${job.id ?? ''}`.trim())
  );
  worker.on('failed', (job, err) =>
    log(`✗ ${job?.name ?? '?'} ${job?.id ?? ''}: ${err?.message ?? err}`)
  );
  worker.on('error', (err) => log(`worker error: ${err?.message ?? err}`));

  log(`worker ativo (concurrency=${env.concurrency})`);
  return worker;
}
