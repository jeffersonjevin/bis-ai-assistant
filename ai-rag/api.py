"""
BharatMaanak AI - AI/RAG Backend API

Frontend
    ↓
FastAPI
    ↓
rag_service.process_query()
    ↓
LangGraph
    ↓
Intent Detection
    ↓
Specialized Agent
    ↓
Qdrant + Reranker
    ↓
Gemini / Offline Fallback
    ↓
NLI Verification
    ↓
Response
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from rag_service import process_query
from agents.common import retrieve_clauses


# -------------------------------------------------------------------
# FASTAPI APP
# -------------------------------------------------------------------

app = FastAPI(
    title="BharatMaanak AI - RAG Service",
    description="BIS AI Assistant powered by LangGraph, Qdrant and RAG",
    version="1.0.0",
)


# -------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------
# REQUEST MODEL
# -------------------------------------------------------------------

class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        description="Question about BIS standards or services",
    )


# -------------------------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------------------------

@app.get("/health")
def health():
    """
    Check whether the backend is running.
    """

    return {
        "status": "ok",
        "service": "bharatmaanak-ai-rag",
        "vector_store": "qdrant",
        "orchestration": "langgraph",
        "retrieval": "rag",
        "verification": "nli",
    }


# -------------------------------------------------------------------
# ROOT
# -------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "BharatMaanak AI RAG API is running",
        "docs": "/docs",
        "health": "/health",
    }


# -------------------------------------------------------------------
# MAIN RAG QUERY
# -------------------------------------------------------------------

@app.post("/api/v1/rag/query")
def rag_query(req: QueryRequest):
    """
    Send a user question through the complete AI/RAG pipeline.

    Frontend → FastAPI → rag_service → LangGraph → Agent → RAG
    """

    query = req.query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty.",
        )

    try:

        result = process_query(
            query
        )

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        print(
            f"[api] Query processing failed: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to process the query.",
        )


# -------------------------------------------------------------------
# DIRECT SEARCH ENDPOINT
# -------------------------------------------------------------------

@app.get("/api/v1/rag/search")
def rag_search(
    q: str,
    top_k: int = 3,
):
    """
    Search the BIS knowledge base directly.

    This is useful for testing Qdrant retrieval
    independently of the complete RAG pipeline.
    """

    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="q cannot be empty.",
        )

    # Prevent unreasonable values.
    top_k = max(
        1,
        min(top_k, 10),
    )

    try:

        results = retrieve_clauses(
            query,
            top_k=top_k,
        )

        return {
            "query": query,
            "count": len(results),
            "results": results,
        }

    except Exception as exc:

        print(
            f"[api] Search failed: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to search the BIS knowledge base.",
        )