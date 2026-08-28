from agents.common import (
    retrieve_clauses,
    generate_grounded_answer,
)

from data.schemes_labs import (
    CERTIFICATION_SCHEMES,
)


_HALLMARK_SCHEME = next(
    (
        scheme
        for scheme in CERTIFICATION_SCHEMES
        if scheme.get("scheme_name")
        == "Hallmarking Scheme"
    ),
    None,
)


def run(state: dict) -> dict:

    query = state["query"]

    retrieval_query = (
        query
        + " gold hallmarking purity"
    )

    chunks = retrieve_clauses(
        retrieval_query,
        top_k=10,
    )

    answer, mode = generate_grounded_answer(
        query,
        chunks,
    )

    if _HALLMARK_SCHEME:

        steps = " -> ".join(
            _HALLMARK_SCHEME.get(
                "process_steps",
                [],
            )
        )

        if steps:

            answer += (
                f"\n\nHallmarking process: "
                f"{steps}"
            )

    confidence = (
        float(
            chunks[0].get(
                "rerank_score",
                chunks[0].get(
                    "score",
                    0.0,
                ),
            )
        )
        if chunks
        else 0.0
    )

    return {
        **state,

        "sources": chunks,

        "answer": answer,

        "confidence": round(
            confidence,
            4,
        ),

        "agent_used": "hallmarking",

        "low_confidence_flag":
            confidence < 0.15,

        "generation_mode": mode,
    }