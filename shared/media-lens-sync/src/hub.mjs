/**
 * Cliente HTTP das rotas internas do hub Media Lens.
 * Todas exigem o header `x-internal-token` = MEDIA_LENS_SYNC_TOKEN.
 */

/**
 * @typedef {object} HubClient
 * @property {(payload:object)=>Promise<object>} postSync
 * @property {(items:Array)=>Promise<object>} postAnalysis
 * @property {(items:Array)=>Promise<object>} postEnrich
 * @property {(sourceIds?:string[])=>Promise<object>} postRecomputeKpi
 */

/**
 * @param {object} opts
 * @param {string} opts.baseUrl ex.: http://hub:3200
 * @param {string} opts.token MEDIA_LENS_SYNC_TOKEN
 * @returns {HubClient}
 */
export function createHubClient({ baseUrl, token }) {
  const root = baseUrl.replace(/\/+$/, '');

  async function post(path, body) {
    const res = await fetch(`${root}/api/media-lens/internal/${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-internal-token': token,
      },
      body: JSON.stringify(body ?? {}),
    });
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      throw new Error(`hub ${path} HTTP ${res.status}: ${text.slice(0, 300)}`);
    }
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  }

  async function get(path) {
    const res = await fetch(`${root}/api/media-lens/internal/${path}`, {
      headers: { 'x-internal-token': token },
    });
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      throw new Error(`hub ${path} HTTP ${res.status}: ${text.slice(0, 300)}`);
    }
    return text ? JSON.parse(text) : {};
  }

  return {
    postSync: (payload) => post('sync', payload),
    postAnalysis: (items) => post('analysis', { items }),
    postEnrich: (items) => post('enrich-source', { items }),
    postRecomputeKpi: (sourceIds) => post('recompute-kpi', sourceIds ? { sourceIds } : {}),
    getPending: () => get('pending'),
  };
}
