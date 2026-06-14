import { Queue } from 'bullmq';
import IORedis from 'ioredis';

/**
 * Conexao Redis + fila BullMQ compartilhada pelo producer e pelos workers.
 * `maxRetriesPerRequest: null` e exigido pelo BullMQ para workers (blocking).
 */
export const QUEUE_NAME = process.env.QUEUE_NAME || 'media-lens';

export const connection = new IORedis(
  process.env.REDIS_URL || 'redis://redis:6379',
  { maxRetriesPerRequest: null }
);

export const queue = new Queue(QUEUE_NAME, { connection });

/** Opcoes padrao dos jobs: retry com backoff exponencial, limpeza ao concluir. */
export const JOB_OPTS = {
  removeOnComplete: true,
  removeOnFail: 200,
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
};
