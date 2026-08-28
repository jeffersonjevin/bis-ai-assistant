"""
Public service layer for BharatMaanak AI.

FastAPI calls process_query().
"""

from graph import answer_query


def process_query(
    query: str
) -> dict:

    if not query or not query.strip():

        raise ValueError(
            "Query cannot be empty."
        )

    cleaned_query = query.strip()

    result = answer_query(
        cleaned_query
    )

    return {

        "query":
            result.get(
                "query",
                cleaned_query,
            ),

        "agent_used":
            result.get(
                "agent_used"
            ),

        "confidence":
            result.get(
                "confidence"
            ),

        "answer":
            result.get(
                "answer"
            ),

        "sources":
            result.get(
                "sources",
                [],
            ),

        "low_confidence_flag":
            result.get(
                "low_confidence_flag",
                False,
            ),

        "generation_mode":
            result.get(
                "generation_mode"
            ),

        "claims":
            result.get(
                "claims",
                [],
            ),

        "verification":
            result.get(
                "verification",
                [],
            ),

        "verification_confidence":
            result.get(
                "verification_confidence",
                0.0,
            ),
    }