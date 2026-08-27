from agents.common import (
    retrieve_clauses,
    generate_grounded_answer,
)

from data.schemes_labs import (
    CERTIFICATION_SCHEMES,
)


_HALLMARK_SCHEME = next(
    scheme
    for scheme in CERTIFICATION_SCHEMES
    if scheme["scheme_name"] == "Hallmarking Scheme"
)


def run(state: dict) -> dict:

    query = state["query"]

    retrieval_query = (
        query
        + " gold hallmarking purity"
    )

    chunks = retrieve_clauses(
        retrieval_query,
        top_k=3,
        retrieval_k=10,
    )

    answer, mode = generate_grounded_answer(
        query,
        chunks,
    )

    steps = " -> ".join(
        _HALLMARK_SCHEME["process_steps"]
    )

    answer += (
        f"\n\nHallmarking process: {steps}"
    )

    confidence = (
        chunks[0].get("rerank_score", 0.0)
        if chunks
        else 0.0
    )

    return {
        **state,

        "sources": chunks,

        "answer": answer,

        "confidence": confidence,

        "agent_used": "hallmarking",

        "low_confidence_flag": confidence < 0.15,

        "generation_mode": mode,
    }