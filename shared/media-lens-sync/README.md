# media-lens-sync

Container Node leve (cron) que sincroniza o motor de ingestao **precis** (TinyDB) com o
**hub** (modulo Media Lens), enriquecendo os dados com analise LLM via **ollama**.

Sem dependencias externas — usa apenas o runtime do Node 20+ (`fetch` nativo, `node:fs`).

## O que faz (por ciclo)

1. **SYNC** — le o `db.json` do precis (read-only, montado em `/data`), mapeia
   `feeds → sources`, `entries → articles`, `entry_contents → contents` e faz
   `POST {HUB_INTERNAL_URL}/api/media-lens/internal/sync`. Idempotente (o hub faz upsert
   por `precisFeedId`/`precisEntryId`).
2. **ANALYSIS (LLM)** — para os artigos novos (controle local em `/state/state.json`),
   extrai o texto do HTML (strip de tags), pede ao ollama (`/api/chat`, `format: json`)
   um JSON estruturado (resumo, sentimento, clickbait, topicos, geo, review IA de 6
   dimensoes) e faz `POST .../internal/analysis`. Robusto a JSON malformado (pula o item).
3. **ENRICH SOURCES** — a cada `ENRICH_EVERY_CYCLES` ciclos, pede ao ollama o perfil/geo
   das fontes ainda nao enriquecidas (a partir de nome/URL) e faz
   `POST .../internal/enrich-source`.
4. **KPI** — ao fim, `POST .../internal/recompute-kpi` com `{}` (recalcula todas).

Autenticacao das rotas internas via header `x-internal-token` = `MEDIA_LENS_SYNC_TOKEN`.

## Variaveis de ambiente

| Var | Default | Descricao |
|---|---|---|
| `HUB_INTERNAL_URL` | `http://hub:3200` | Base URL do hub na rede `workspace`. |
| `MEDIA_LENS_SYNC_TOKEN` | `` | Segredo compartilhado sync↔hub (sem ele, o hub responde 401). |
| `PRECIS_DB_PATH` | `/data/db.json` | Caminho do TinyDB do precis (montado read-only). |
| `OLLAMA_BASE_URL` | `http://ollama:11434` | Base URL do ollama. |
| `OLLAMA_MODEL` | `qwen2.5:14b` | Modelo usado na analise/enriquecimento. |
| `SYNC_INTERVAL_MS` | `900000` | Intervalo (ms) entre ciclos (15 min). |
| `STATE_PATH` | `/state/state.json` | Estado local (artigos analisados, contador de ciclos). |
| `ANALYSIS_BATCH` | `8` | Maximo de artigos analisados por ciclo. |
| `ENRICH_EVERY_CYCLES` | `4` | Enriquece fontes a cada N ciclos. |
| `RUN_ONCE` | `` | `1` roda um unico ciclo e encerra (util p/ teste/cron externo). |

## Como roda

O agendamento e **interno**: o processo roda um ciclo, dorme `SYNC_INTERVAL_MS` e repete,
num loop infinito. O container usa `restart: unless-stopped`. Para um cron externo,
defina `RUN_ONCE=1`.

Sobe junto da infra do mend3 (rede `workspace`, mesma do precis/ollama/hub):

```bash
cd mend3
docker compose up -d --build media-lens-sync
```

Dependencias: o `db.json` do precis precisa existir (`./config/precis/data/db.json`),
o `ollama` precisa do modelo `qwen2.5:14b` puxado, e o `hub` precisa estar no ar com o
mesmo `MEDIA_LENS_SYNC_TOKEN`.
