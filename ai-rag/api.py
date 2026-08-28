"""
BharatMaanak AI - FastAPI backend.

Frontend
    ↓
FastAPI
    ↓
RAG Service
    ↓
LangGraph
    ↓
Specialized Agent
    ↓
Qdrant
    ↓
Grounded Answer
"""

from fastapi import (
    FastAPI,
    HTTPException,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from pydantic import (
    BaseModel,
    Field,
)

from rag_service import process_query

from agents.common import (
    retrieve_clauses,
)


app = FastAPI(
    title="BharatMaanak AI - RAG Service",
    description=(
        "BIS AI Assistant powered by "
        "LangGraph, Qdrant and RAG"
    ),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):

    query: str = Field(
        ...,
        min_length=1,
        description=(
            "Question about BIS standards "
            "or services"
        ),
    )


@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "bharatmaanak-ai-rag",
        "vector_store": "qdrant",
        "orchestration": "langgraph",
        "retrieval": "rag",
        "verification": "nli",
    }


@app.get("/")
def root():

    return {
        "message":
            "BharatMaanak AI RAG API is running",
        "docs": "/docs",
        "health": "/health",
    }


@app.post("/api/v1/rag/query")
def rag_query(
    req: QueryRequest
):

    query = req.query.strip()

    if not query:

        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty.",
        )

    try:

        return process_query(
            query
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        print(
            f"[api] Query processing failed: "
            f"{exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


@app.get("/api/v1/rag/search")
def rag_search(
    q: str,
    top_k: int = 3,
):

    query = q.strip()

    if not query:

        raise HTTPException(
            status_code=400,
            detail="q cannot be empty.",
        )

    top_k = max(
        1,
        min(
            int(top_k),
            10,
        ),
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
            detail=str(exc),
        )