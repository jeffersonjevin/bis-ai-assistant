# BharatMaanak AI — Pair 1 Deliverable: AI / RAG Service

The **AI brain** of the project — matches the team's architecture slide:

```
User Query -> Intent Detection -> Master AI Agent -> Specialized Agent
Routing -> RAG Retrieval -> LLM Response Generation -> Answer with
Source, Clause & Page
```

Built with **Qdrant** (vector DB) + **LangGraph** (multi-agent orchestration)
+ **Gemini/OpenAI** (pluggable LLM), exactly matching the Tech Stack slide.

## What's inside

```
ai-rag/
├── data/
│   ├── corpus.py          # Sample BIS clauses (SWAP for Pair 2's real parsed PDFs)
│   └── schemes_labs.py    # Certification schemes + testing lab directory
├── embeddings.py          # Pluggable: Gemini / OpenAI / offline TF-IDF fallback
├── llm.py                 # Pluggable: Gemini / OpenAI / offline grounded-template fallback
├── vectorstore.py         # Qdrant wrapper (embedded/local by default, or point at a real server)
├── state.py                # Shared LangGraph state shape
├── intent.py               # Master Agent's routing decision (keyword-based MVP)
├── agents/
│   ├── common.py           # Shared retrieve + generate helper
│   ├── standard_finder.py  # General Indian Standards Q&A
│   ├── certification.py    # ISI / CRS / FMCS scheme guidance
│   ├── hallmarking.py      # Gold/silver hallmarking guidance
│   ├── lab.py               # Testing lab recommendations
│   └── consumer.py          # Consumer grievance guidance
├── graph.py                # LangGraph StateGraph wiring it all together
├── ingest.py                # Builds the Qdrant collection from the corpus
├── api.py                   # FastAPI wrapper — the actual "AI/RAG API" deliverable
├── requirements.txt
└── .env.example
```

## Setup

```bash
cd ai-rag
pip install -r requirements.txt
cp .env.example .env
# Optionally add GOOGLE_API_KEY or OPENAI_API_KEY for real LLM answers.
# Leave QDRANT_URL blank to run Qdrant embedded/local — zero setup.

python ingest.py                                   # builds ./qdrant_data/ from data/corpus.py
python graph.py "How do I get ISI certification?"  # smoke test — prints routing + answer
uvicorn api:app --reload --port 8001
```

## API

**POST** `/api/v1/rag/query`
```json
{ "query": "What is the gold purity for hallmarking?" }
```
Returns:
```json
{
  "query": "...",
  "intent": "hallmarking",
  "agent_used": "hallmarking",
  "answer": "Based on IS 1417, Clause 4.1: ...",
  "sources": [ { "is_number": "IS 1417", "clause_number": "4.1", "score": 0.42, "text": "..." } ],
  "confidence": 0.42,
  "low_confidence_flag": false
}
```

**GET** `/api/v1/rag/search?q=...&top_k=3` — raw Qdrant retrieval only, no LLM call.

## How routing works (the "Master AI Agent")

`intent.py` classifies the query into one of 5 specialized agents
(`standard_finder`, `certification`, `hallmarking`, `lab`, `consumer`) using
keyword matching for the MVP. `graph.py` wires this as a LangGraph
`StateGraph`: `classify_intent` is the entry node, and conditional edges route
to whichever specialized agent node should handle it. Each agent independently
retrieves from Qdrant and generates its own grounded, cited answer.

**Upgrade path:** swap the keyword classifier in `intent.py` for an LLM
function-calling call (Gemini/OpenAI with structured output) for more nuanced
routing — nothing else in the graph changes.

## Important note on the offline fallback

With no API key set, `embeddings.py` uses TF-IDF (keyword overlap) instead of
real semantic embeddings, and `llm.py` composes answers from a template
instead of calling an LLM. This means the whole pipeline runs with **zero
setup and zero cost** — useful for development, and a safety net if venue wifi
fails during the demo. It can occasionally retrieve the wrong clause when a
query shares a literal word with an unrelated clause (e.g. "certification"
matching a solar panel clause instead of the correct toy-safety clause) —
this is expected, and disappears once `GOOGLE_API_KEY` or `OPENAI_API_KEY` is
set, because real embeddings understand meaning, not just word overlap.

## Swapping in Pair 2's real data

Once Pair 2 delivers real parsed/chunked BIS PDFs, point `ingest.py` at their
output instead of `data/corpus.py` — as long as each record has `text`,
`is_number`, `clause_number`, and `page`, nothing else needs to change.
Re-run `python ingest.py` to rebuild the Qdrant collection.

## Moving from embedded Qdrant to a real Qdrant server

Right now Qdrant runs in embedded/local mode (`QdrantClient(path=...)`) — no
Docker needed, data persists to `./qdrant_data/`. For the team's real
deployment (matching the AWS/Docker deployment box on the slide), spin up a
Qdrant container and set `QDRANT_URL` (and `QDRANT_API_KEY` if using Qdrant
Cloud) in `.env` — `vectorstore.py` automatically switches to that server,
no other code changes required.
