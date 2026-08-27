"""
Shared state used by the BharatMaanak AI LangGraph workflow.

Every field that must travel between:
    Intent → Agent → RAG → NLI → API

must be declared here.
"""

from typing import TypedDict, List, Dict, Any, Optional


class RAGState(TypedDict, total=False):
    # ---------------------------------------------------------------
    # USER QUERY
    # ---------------------------------------------------------------

    query: str

    # ---------------------------------------------------------------
    # INTENT / ROUTING
    # ---------------------------------------------------------------

    intent: str

    agent_used: Optional[str]

    # ---------------------------------------------------------------
    # RETRIEVAL
    # ---------------------------------------------------------------

    sources: List[Dict[str, Any]]

    confidence: float

    low_confidence_flag: bool

    # ---------------------------------------------------------------
    # ANSWER GENERATION
    # ---------------------------------------------------------------

    answer: str

    generation_mode: Optional[str]

    # ---------------------------------------------------------------
    # NLI / EVIDENCE VERIFICATION
    # ---------------------------------------------------------------

    claims: List[str]

    verification: List[Dict[str, Any]]

    verification_confidence: float