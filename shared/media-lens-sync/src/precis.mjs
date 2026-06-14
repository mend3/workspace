import { readFile } from 'node:fs/promises';

/**
 * Le e parseia o TinyDB do precis (read-only).
 *
 * Tabelas relevantes:
 * - feeds: { id, feed:{ name, category, type, url, refresh_enabled, retrieve_content } }
 * - entries: { id, feed_id, entry:{ title, url, published_at(epoch s), authors, preview, content } }
 * - entry_contents: { id, entry_contents:{ url, content(HTML) } }
 * - poll: { id, last_polled_at(epoch s) }
 *
 * @param {string} dbPath caminho do db.json
 * @returns {Promise<{feeds:object, entries:object, entry_contents:object, poll:object}>}
 */
export async function loadPrecisDb(dbPath) {
  const raw = await readFile(dbPath, 'utf8');
  const db = JSON.parse(raw);
  return {
    feeds: db.feeds || {},
    entries: db.entries || {},
    entry_contents: db.entry_contents || {},
    poll: db.poll || {},
  };
}

/**
 * Converte epoch (segundos) para ISO-8601. Retorna undefined se invalido.
 * @param {number|undefined|null} epochSeconds
 * @returns {string|undefined}
 */
function epochToIso(epochSeconds) {
  if (epochSeconds === undefined || epochSeconds === null) return undefined;
  const ms = Number(epochSeconds) * 1000;
  if (!Number.isFinite(ms)) return undefined;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

/**
 * Remove tags HTML e normaliza espacos, devolvendo texto puro.
 * @param {string|undefined|null} html
 * @returns {string}
 */
export function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Monta o SyncPayload (sources/articles/contents) a partir do db do precis.
 * @param {{feeds:object, entries:object, entry_contents:object, poll:object}} db
 * @returns {{sources:Array, articles:Array, contents:Array}}
 */
export function buildSyncPayload(db) {
  const sources = Object.values(db.feeds).map((row) => {
    const f = row.feed || {};
    const poll = db.poll[row.id];
    return {
      precisFeedId: row.id,
      name: f.name || row.id,
      category: f.category ?? undefined,
      type: f.type ?? undefined,
      feedUrl: f.url || '',
      enabled: f.refresh_enabled ?? undefined,
      retrieveContent: f.retrieve_content ?? undefined,
      lastPolledAt: poll ? epochToIso(poll.last_polled_at) : undefined,
    };
  });

  const contentByEntry = db.entry_contents;

  const articles = Object.values(db.entries).map((row) => {
    const e = row.entry || {};
    const hasContent = Boolean(contentByEntry[row.id]?.entry_contents?.content);
    return {
      precisEntryId: row.id,
      precisFeedId: row.feed_id,
      title: e.title || '',
      url: e.url || '',
      authors: Array.isArray(e.authors) ? e.authors : undefined,
      preview: e.preview ?? undefined,
      publishedAt: epochToIso(e.published_at),
      hasContent,
    };
  });

  const contents = Object.values(contentByEntry)
    .map((row) => {
      const c = row.entry_contents || {};
      const contentHtml = c.content || '';
      if (!contentHtml) return null;
      return {
        precisEntryId: row.id,
        contentHtml,
        contentText: stripHtml(contentHtml),
      };
    })
    .filter(Boolean);

  return { sources, articles, contents };
}

/**
 * Monta lista de fontes (feeds) com dados crus uteis ao enriquecimento LLM.
 * @param {{feeds:object}} db
 * @returns {Array<{precisFeedId:string, name:string, url:string, category?:string}>}
 */
export function buildSourceSeeds(db) {
  return Object.values(db.feeds).map((row) => {
    const f = row.feed || {};
    return {
      precisFeedId: row.id,
      name: f.name || row.id,
      url: f.url || '',
      category: f.category ?? undefined,
    };
  });
}

/**
 * Monta a lista de "candidatos a analise" (artigo + texto extraido do conteudo).
 * Ordena por publishedAt desc (mais recentes primeiro).
 * @param {{entries:object, entry_contents:object}} db
 * @returns {Array<{precisEntryId:string, title:string, url:string, preview:string, text:string, publishedAtEpoch:number}>}
 */
export function buildAnalysisCandidates(db) {
  const out = Object.values(db.entries).map((row) => {
    const e = row.entry || {};
    const content = db.entry_contents[row.id]?.entry_contents?.content;
    const text = stripHtml(content) || stripHtml(e.content) || e.preview || '';
    return {
      precisEntryId: row.id,
      title: e.title || '',
      url: e.url || '',
      preview: e.preview || '',
      text,
      publishedAtEpoch: Number(e.published_at) || 0,
    };
  });
  out.sort((a, b) => b.publishedAtEpoch - a.publishedAtEpoch);
  return out;
}
