from agents.common import (
    retrieve_clauses,
    generate_grounded_answer,
)

from claim_extractor import extract_claims
from nli_verifier import verify_claims


def run(state: dict) -> dict:
    """
    Standard Finder Agent.

    Flow:
        Query
          ↓
        Qdrant retrieval
          ↓
        Grounded answer
          ↓
        Claim extraction
          ↓
        NLI evidence verification
    """

    query = state["query"]

    # ---------------------------------------------------------------
    # 1. RETRIEVE RELEVANT BIS CLAUSES
    # ---------------------------------------------------------------

    chunks = retrieve_clauses(
        query,
        top_k=3,
    )

    # ---------------------------------------------------------------
    # 2. GENERATE GROUNDED ANSWER
    # ---------------------------------------------------------------

    answer, mode = generate_grounded_answer(
        query,
        chunks,
    )

    # ---------------------------------------------------------------
    # 3. EXTRACT CLAIMS
    # ---------------------------------------------------------------

    claims = extract_claims(
        answer
    )

    print(
        f"[nli] Extracted {len(claims)} claims"
    )

    # ---------------------------------------------------------------
    # 4. VERIFY CLAIMS AGAINST BIS EVIDENCE
    # ---------------------------------------------------------------

    verification = verify_claims(
        claims,
        chunks,
    )

    # ---------------------------------------------------------------
    # 5. CALCULATE VERIFICATION CONFIDENCE
    # ---------------------------------------------------------------

    if verification:

        verification_confidence = sum(
            item.get(
                "confidence",
                0.0,
            )
            for item in verification
        ) / len(verification)

    else:

        verification_confidence = 0.0

    # ---------------------------------------------------------------
    # 6. RETRIEVAL CONFIDENCE
    # ---------------------------------------------------------------

    confidence = (
        chunks[0]["score"]
        if chunks
        else 0.0
    )

    # ---------------------------------------------------------------
    # 7. LOW CONFIDENCE
    # ---------------------------------------------------------------

    low_confidence = (
        confidence < 0.15
        or verification_confidence < 0.70
    )

    # ---------------------------------------------------------------
    # 8. RETURN COMPLETE STATE
    # ---------------------------------------------------------------

    return {
        **state,

        "sources": chunks,

        "answer": answer,

        "confidence": round(
            confidence,
            4,
        ),

        "agent_used": "standard_finder",

        "low_confidence_flag": low_confidence,

        "generation_mode": mode,

        "claims": claims,

        "verification": verification,

        "verification_confidence": round(
            verification_confidence,
            4,
        ),
    }