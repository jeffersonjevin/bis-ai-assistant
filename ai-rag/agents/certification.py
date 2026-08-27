from agents.common import retrieve_clauses

from data.schemes_labs import (
    CERTIFICATION_SCHEMES,
)


def _match_scheme(query: str):
    """
    Find the most appropriate certification scheme
    using the local scheme dataset.
    """

    q = query.lower()

    for scheme in CERTIFICATION_SCHEMES:

        products = scheme.get(
            "applicable_products",
            [],
        )

        if any(
            product.lower() in q
            for product in products
        ):
            return scheme

    return CERTIFICATION_SCHEMES[0]


def run(state: dict) -> dict:

    query = state["query"]

    scheme = _match_scheme(query)

    # Retrieve BIS evidence as supporting context.
    chunks = retrieve_clauses(
        query,
        top_k=3,
        retrieval_k=10,
    )

    steps = "\n".join(
        f"{index + 1}. {step}"
        for index, step in enumerate(
            scheme["process_steps"]
        )
    )

    answer = (
        f"**{scheme['scheme_name']}**\n\n"
        f"{scheme['description']}\n\n"
        f"**Process:**\n"
        f"{steps}\n\n"
        f"**Typical timeline:** "
        f"~{scheme['avg_timeline_days']} days\n\n"
        f"**Typical cost:** "
        f"{scheme['avg_fee_range']}"
    )

    sources = chunks + [
        {
            "scheme_name": scheme["scheme_name"]
        }
    ]

    return {
        **state,

        "sources": sources,

        "answer": answer,

        "confidence": 0.85,

        "agent_used": "certification_navigator",

        "low_confidence_flag": False,

        "generation_mode": "template",
    }