import { runProducerCycle } from './producer.mjs';
import { startWorker } from './worker.mjs';

/**
 * Entrypoint generico do processamento assincrono por filas (BullMQ + Redis).
 * Papel definido por ROLE:
 *   - worker   (default): consome a fila (analise LLM, enriquecimento, KPI).
 *   - producer: a cada PRODUCER_INTERVAL_MS sincroniza o catalogo e enfileira.
 *   - both:     roda os dois no mesmo container (dev/single-node).
 * A mesma imagem serve a todos os papeis -> basta escalar replicas de worker.
 */
const env = {
  role: process.env.ROLE || 'worker',
  hubUrl: process.env.HUB_INTERNAL_URL || 'http://hub:3200',
  token: process.env.MEDIA_LENS_SYNC_TOKEN || '',
  dbPath: process.env.PRECIS_DB_PATH || '/data/db.json',
  ollamaUrl: process.env.OLLAMA_BASE_URL || 'http://ollama:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:14b',
  concurrency: Number(process.env.WORKER_CONCURRENCY || 2),
  producerIntervalMs: Number(process.env.PRODUCER_INTERVAL_MS || 300000),
};

function log(...args) {
  console.log(new Date().toISOString(), `[media-lens:${env.role}]`, ...args);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runProducerLoop() {
  for (;;) {
    try {
      await runProducerCycle(env, log);
    } catch (err) {
      log('ERRO no ciclo do producer:', err.message);
    }
    await sleep(env.producerIntervalMs);
  }
}

async function main() {
  if (!env.token) log('AVISO: MEDIA_LENS_SYNC_TOKEN vazio — o hub respondera 401.');

  if (env.role === 'worker' || env.role === 'both') {
    startWorker(env, log);
  }
  if (env.role === 'producer' || env.role === 'both') {
    await runProducerLoop();
  }
}

main().catch((err) => {
  log('FATAL:', err.stack || err.message);
  process.exit(1);
});
