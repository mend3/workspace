/**
 * Cliente do ollama: analise de artigo e enriquecimento de fonte.
 * Usa /api/chat com `format: json` e e robusto a JSON malformado.
 */

const PROMPT_VERSION = 'media-lens-v1';

/**
 * Chama o ollama em modo chat pedindo JSON. Retorna objeto parseado ou null.
 * @param {object} opts
 * @param {string} opts.baseUrl
 * @param {string} opts.model
 * @param {string} opts.system
 * @param {string} opts.user
 * @returns {Promise<object|null>}
 */
async function chatJson({ baseUrl, model, system, user }) {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      options: { temperature: 0.2 },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`ollama HTTP ${res.status}: ${await res.text().catch(() => '')}`);
  }
  const data = await res.json();
  const raw = data?.message?.content ?? '';
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function clamp(n, min, max, fallback) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(min, Math.min(max, v));
}

function rating(n) {
  return clamp(n, 0, 5, 0);
}

/**
 * Analisa um artigo. Retorna ArticleAnalysisInput (sem model/promptVersion ja preenchidos)
 * ou null se a resposta for inutilizavel.
 * @param {object} opts
 * @param {string} opts.baseUrl
 * @param {string} opts.model
 * @param {{title:string, url:string, text:string, preview:string}} opts.article
 * @returns {Promise<object|null>}
 */
export async function analyzeArticle({ baseUrl, model, article }) {
  const system = [
    'Voce e um analista de midia. Responda SOMENTE com um objeto JSON valido,',
    'sem texto fora do JSON. Use o schema exato pedido pelo usuario.',
    'Numeros devem respeitar os intervalos. countryCode em ISO alpha-2 maiusculo.',
  ].join(' ');

  const text = (article.text || article.preview || '').slice(0, 6000);
  const user = [
    'Analise o artigo abaixo e produza este JSON:',
    JSON.stringify({
      summary: 'string (1-3 frases, PT-BR)',
      sentiment: 'number -1..1',
      sentimentLabel: 'string (ex.: negativo|neutro|positivo)',
      clickbaitScore: 'number 0..1',
      topics: ['string'],
      geo: {
        country: 'string|null',
        countryCode: 'string ISO alpha-2|null',
        region: 'string|null',
        latitude: 'number|null',
        longitude: 'number|null',
      },
      aiReview: {
        ratings: {
          factualAccuracy: 'number 0..5',
          biasAndPerspective: 'number 0..5',
          transparency: 'number 0..5',
          depthAndContext: 'number 0..5',
          editorialStandards: 'number 0..5',
          userExperience: 'number 0..5',
        },
        strengths: 'string',
        weaknesses: 'string',
        examples: 'string',
        tags: ['string'],
      },
    }),
    '',
    `Titulo: ${article.title}`,
    `URL: ${article.url}`,
    '',
    'Texto:',
    text,
  ].join('\n');

  const parsed = await chatJson({ baseUrl, model, system, user });
  if (!parsed || typeof parsed !== 'object') return null;
  if (!parsed.summary && !parsed.topics) return null;

  const geo = parsed.geo && typeof parsed.geo === 'object' ? parsed.geo : {};
  const ai = parsed.aiReview && typeof parsed.aiReview === 'object' ? parsed.aiReview : null;
  const r = ai && typeof ai.ratings === 'object' ? ai.ratings : {};

  return {
    summary: String(parsed.summary || ''),
    sentiment: clamp(parsed.sentiment, -1, 1, 0),
    sentimentLabel: parsed.sentimentLabel ? String(parsed.sentimentLabel) : undefined,
    clickbaitScore: clamp(parsed.clickbaitScore, 0, 1, 0),
    topics: Array.isArray(parsed.topics) ? parsed.topics.map(String).slice(0, 12) : [],
    model,
    promptVersion: PROMPT_VERSION,
    geo: {
      country: geo.country || undefined,
      countryCode: geo.countryCode ? String(geo.countryCode).toUpperCase().slice(0, 2) : undefined,
      region: geo.region || undefined,
      latitude: Number.isFinite(Number(geo.latitude)) ? Number(geo.latitude) : undefined,
      longitude: Number.isFinite(Number(geo.longitude)) ? Number(geo.longitude) : undefined,
    },
    aiReview: ai
      ? {
          ratings: {
            factualAccuracy: rating(r.factualAccuracy),
            biasAndPerspective: rating(r.biasAndPerspective),
            transparency: rating(r.transparency),
            depthAndContext: rating(r.depthAndContext),
            editorialStandards: rating(r.editorialStandards),
            userExperience: rating(r.userExperience),
          },
          strengths: String(ai.strengths || ''),
          weaknesses: String(ai.weaknesses || ''),
          examples: ai.examples ? String(ai.examples) : undefined,
          tags: Array.isArray(ai.tags) ? ai.tags.map(String).slice(0, 12) : undefined,
        }
      : undefined,
  };
}

/**
 * Enriquece o perfil/geo de uma fonte a partir de nome/url. Retorna SourceEnrichInput
 * (sem precisFeedId) ou null.
 * @param {object} opts
 * @param {string} opts.baseUrl
 * @param {string} opts.model
 * @param {{name:string, url:string, category?:string}} opts.source
 * @returns {Promise<object|null>}
 */
export async function enrichSource({ baseUrl, model, source }) {
  const system = [
    'Voce e um pesquisador de veiculos de midia. Responda SOMENTE com JSON valido.',
    'O pais de origem, a sede e o idioma de um veiculo sao FATOS PUBLICOS: infira com CONFIANCA pelo dominio/TLD/reputacao conhecida',
    '(ex.: machinelearningmastery.com -> United States/US/lat 39.8/lng -98.6; antoinevastel.com -> France/FR/lat 46.6/lng 2.2; bbc.co.uk -> United Kingdom/GB).',
    'SEMPRE preencha country, countryCode (ISO alpha-2 maiusculo), latitude e longitude (do pais ou da sede). Use null em geo APENAS se o veiculo for totalmente desconhecido.',
    'Para ownership use null se nao souber (nao invente).',
  ].join(' ');

  const user = [
    'Com base no nome e URL do feed, descreva o veiculo neste JSON:',
    JSON.stringify({
      description: 'string|null',
      officialUrl: 'string|null',
      country: 'string|null',
      countryCode: 'string ISO alpha-2|null',
      region: 'string|null',
      latitude: 'number|null',
      longitude: 'number|null',
      languages: ['string'],
      ownership: 'string|null',
      headquarters: 'string|null',
      editorialFocus: ['string'],
    }),
    '',
    `Nome: ${source.name}`,
    `URL: ${source.url}`,
    source.category ? `Categoria: ${source.category}` : '',
  ].join('\n');

  const parsed = await chatJson({ baseUrl, model, system, user });
  if (!parsed || typeof parsed !== 'object') return null;

  return {
    description: parsed.description || undefined,
    officialUrl: parsed.officialUrl || undefined,
    country: parsed.country || undefined,
    countryCode: parsed.countryCode ? String(parsed.countryCode).toUpperCase().slice(0, 2) : undefined,
    region: parsed.region || undefined,
    latitude: Number.isFinite(Number(parsed.latitude)) ? Number(parsed.latitude) : undefined,
    longitude: Number.isFinite(Number(parsed.longitude)) ? Number(parsed.longitude) : undefined,
    languages: Array.isArray(parsed.languages) ? parsed.languages.map(String).slice(0, 8) : undefined,
    ownership: parsed.ownership || undefined,
    headquarters: parsed.headquarters || undefined,
    editorialFocus: Array.isArray(parsed.editorialFocus)
      ? parsed.editorialFocus.map(String).slice(0, 8)
      : undefined,
  };
}
