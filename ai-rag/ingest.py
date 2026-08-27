"""
Ingestion pipeline: embeds the BIS clause corpus and loads it into Qdrant.

Run this whenever the corpus changes:
    python ingest.py

Pair 2's real parsed/chunked BIS PDFs eventually replace `data/corpus.py` —
as long as each record keeps the same shape (text, is_number, clause_number,
page), nothing else here needs to change.
"""

import os
import pickle
from dotenv import load_dotenv

from embeddings import get_embeddings, TfidfEmbeddings
from vectorstore import get_client, build_collection
from data.corpus import load_documents

load_dotenv()

VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "vectorizer_state.pkl")


def run_ingestion():
    raw_docs = load_documents()
    texts = [d["text"] for d in raw_docs]
    payloads = [
        {
            "is_number": d["is_number"],
            "title": d["title"],
            "clause_number": d["clause_number"],
            "page": d["page"],
            "text": d["text"],
        }
        for d in raw_docs
    ]

    embeddings = get_embeddings()
    print(f"[ingest] Embedding {len(texts)} clause chunks...")
    vectors = embeddings.embed_documents(texts)

    client = get_client()
    build_collection(client, vectors, payloads)
    print(f"[ingest] Qdrant collection 'bis_clauses' built with {len(vectors)} points.")

    # Persist fitted TF-IDF vocabulary if running in offline fallback mode,
    # so a fresh process can embed queries into the exact same vector space.
    if isinstance(embeddings, TfidfEmbeddings):
        with open(VECTORIZER_PATH, "wb") as f:
            pickle.dump(embeddings.vectorizer, f)
        print(f"[ingest] TF-IDF vectorizer state saved to {VECTORIZER_PATH}")


if __name__ == "__main__":
    run_ingestion()
