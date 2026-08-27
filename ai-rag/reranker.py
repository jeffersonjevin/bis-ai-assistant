"""
Cross-Encoder reranker for BharatMaanak AI.

Pipeline:

    User Query
        ↓
    Qdrant Top 10
        ↓
    Cross-Encoder
        ↓
    Relevance filtering
        ↓
    Best evidence chunks
"""


from typing import List, Dict, Any

from sentence_transformers import CrossEncoder


# -------------------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------------------

MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"

# Scores below this are treated as weak evidence.
MIN_RERANK_SCORE = 0.0

_model = None


# -------------------------------------------------------------------
# MODEL
# -------------------------------------------------------------------

def get_reranker() -> CrossEncoder:
    """
    Load the Cross-Encoder only once.
    """

    global _model

    if _model is None:

        print(
            f"[reranker] Loading model: {MODEL_NAME}"
        )

        _model = CrossEncoder(
            MODEL_NAME
        )

        print(
            "[reranker] Model loaded"
        )

    return _model


# -------------------------------------------------------------------
# RERANK
# -------------------------------------------------------------------

def rerank(
    query: str,
    chunks: List[Dict[str, Any]],
    top_k: int = 3,
) -> List[Dict[str, Any]]:
    """
    Rerank Qdrant candidates and remove
    clearly irrelevant evidence.

    We use a conservative threshold:

        score >= 0
            → usable evidence

        score < 0
            → weak / irrelevant evidence

    If filtering removes everything, the
    highest-scoring result is retained so
    the system never silently loses all evidence.
    """

    if not query or not query.strip():
        return []

    if not chunks:
        return []

    model = get_reranker()

    valid_chunks = [
        chunk
        for chunk in chunks
        if isinstance(chunk, dict)
        and chunk.get("text")
    ]

    if not valid_chunks:
        return []

    # ---------------------------------------------------------------
    # SCORE QUERY + CHUNK PAIRS
    # ---------------------------------------------------------------

    pairs = [
        (
            query,
            chunk["text"],
        )
        for chunk in valid_chunks
    ]

    scores = model.predict(
        pairs
    )

    scored_chunks = []

    for chunk, score in zip(
        valid_chunks,
        scores,
    ):

        scored_chunks.append(
            {
                **chunk,
                "rerank_score": round(
                    float(score),
                    4,
                ),
            }
        )

    # ---------------------------------------------------------------
    # SORT BY CROSS-ENCODER SCORE
    # ---------------------------------------------------------------

    scored_chunks.sort(
        key=lambda item: item["rerank_score"],
        reverse=True,
    )

    # ---------------------------------------------------------------
    # FILTER WEAK RESULTS
    # ---------------------------------------------------------------

    relevant_chunks = [
        chunk
        for chunk in scored_chunks
        if chunk["rerank_score"]
        >= MIN_RERANK_SCORE
    ]

    # ---------------------------------------------------------------
    # SAFETY FALLBACK
    # ---------------------------------------------------------------

    if not relevant_chunks:

        print(
            "[reranker] No chunks passed "
            "the relevance threshold."
        )

        # Keep the strongest candidate.
        relevant_chunks = [
            scored_chunks[0]
        ]

    # ---------------------------------------------------------------
    # FINAL TOP-K
    # ---------------------------------------------------------------

    final_chunks = relevant_chunks[:top_k]

    print(
        f"[reranker] {len(final_chunks)} "
        f"relevant chunks retained"
    )

    return final_chunks