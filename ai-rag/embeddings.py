"""
Pluggable embeddings backend for Pair 1's RAG pipeline.

Priority order:
  1. Google Gemini embeddings   (if GOOGLE_API_KEY is set)
  2. OpenAI embeddings          (if OPENAI_API_KEY is set)
  3. Local TF-IDF fallback      (zero-setup, runs fully offline — for dev/demo
                                 without burning API credits, or when the venue
                                 wifi can't be trusted)

Whichever backend is active, it satisfies LangChain's `Embeddings` interface
(`embed_documents`, `embed_query`), so `ingest.py` and `rag_chain.py` never
need to know which one is in use.
"""

import os
from dotenv import load_dotenv
load_dotenv()
from typing import List
from langchain_core.embeddings import Embeddings
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


class TfidfEmbeddings(Embeddings):
    """
    Offline fallback embedding model. Fits a TF-IDF vectorizer over whatever
    corpus is passed to `embed_documents` first, then projects queries into
    the same space. Not as semantically rich as a neural embedding model,
    but requires no API key, no GPU, and no internet — good enough to prove
    out the retrieval pipeline end-to-end during development.
    """

    def __init__(self, max_features: int = 4096):
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=max_features)
        self._fitted = False

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        matrix = self.vectorizer.fit_transform(texts)
        self._fitted = True
        return matrix.toarray().tolist()

    def embed_query(self, text: str) -> List[float]:
        if not self._fitted:
            raise RuntimeError("TfidfEmbeddings must embed the document set before embedding queries.")
        vec = self.vectorizer.transform([text])
        # Pad/truncate isn't needed since transform uses the fitted vocabulary
        return vec.toarray()[0].tolist()


def get_embeddings() -> Embeddings:
    if os.getenv("GOOGLE_API_KEY"):
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        return GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")

    if os.getenv("OPENAI_API_KEY"):
        from langchain_openai import OpenAIEmbeddings
        return OpenAIEmbeddings(model="text-embedding-3-small")

    print("[embeddings] No GOOGLE_API_KEY or OPENAI_API_KEY found — using offline TF-IDF fallback. "
          "Set one of those env vars for production-quality semantic embeddings.")
    return TfidfEmbeddings()
