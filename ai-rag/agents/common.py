"""
Shared helper functions for BharatMaanak AI.

Pipeline:

User Query
    ↓
Embeddings
    ↓
Qdrant Retrieval
    ↓
Reranking / Filtering
    ↓
Grounded LLM Answer
    ↓
Offline fallback if LLM fails
"""

import os
import pickle
import re

from embeddings import (
    get_embeddings,
    TfidfEmbeddings,
)

from vectorstore import (
    get_client,
    search as qdrant_search,
)

from llm import (
    get_llm,
    build_prompt,
    fallback_generate,
)


# -------------------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------------------

VECTORIZER_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "vectorizer_state.pkl",
)

# Lower threshold than the previous 0.70.
#
# This is important because TF-IDF / cosine similarity scores can
# vary depending on the query.
MIN_SCORE = 0.30

# Retrieve more candidates from Qdrant before filtering.
RETRIEVAL_K = 10

_embeddings = None
_llm = None


# -------------------------------------------------------------------
# LOAD EMBEDDINGS
# -------------------------------------------------------------------

def _load_embeddings():
    """
    Load the embedding model once and reuse it.
    """

    global _embeddings

    if _embeddings is not None:
        return _embeddings

    _embeddings = get_embeddings()

    # If TF-IDF embeddings are being used,
    # load the previously fitted vectorizer.
    if (
        isinstance(
            _embeddings,
            TfidfEmbeddings,
        )
        and os.path.exists(
            VECTORIZER_PATH
        )
    ):

        with open(
            VECTORIZER_PATH,
            "rb",
        ) as file:

            _embeddings.vectorizer = pickle.load(
                file
            )

        _embeddings._fitted = True

    return _embeddings


# -------------------------------------------------------------------
# LOAD LLM
# -------------------------------------------------------------------

def _load_llm():
    """
    Load the LLM once and reuse it.
    """

    global _llm

    if _llm is None:
        _llm = get_llm()

    return _llm


# -------------------------------------------------------------------
# STANDARD NUMBER EXTRACTION
# -------------------------------------------------------------------

def _extract_is_number(query: str):
    """
    Detect an Indian Standard number from the query.

    Examples:

        "What is IS 1417?"
        "Tell me about IS-1417"
        "IS 302 requirements"

    Returns:

        "IS 1417"

    or:

        None
    """

    if not query:
        return None

    match = re.search(
        r"\bIS[\s\-]*([0-9]{3,6})\b",
        query,
        re.IGNORECASE,
    )

    if not match:
        return None

    return f"IS {match.group(1)}"


# -------------------------------------------------------------------
# RETRIEVE BIS CLAUSES
# -------------------------------------------------------------------

def retrieve_clauses(
    query: str,
    top_k: int = 3,
    retrieval_k: int | None = None,
):
    """
    Retrieve BIS records from Qdrant.

    Supports both top_k and retrieval_k so
    older agent calls do not crash.
    """

    if retrieval_k is not None:
        top_k = retrieval_k

    try:
        top_k = int(top_k)
    except (
        TypeError,
        ValueError,
    ):
        top_k = 3

    top_k = max(
        1,
        min(top_k, 10),
    )

    # Keep the rest of your existing
    # retrieve_clauses() function below.
    """
    Retrieve relevant BIS clauses from Qdrant.

    Strategy:

    1. Create query embedding.
    2. Retrieve a broader set of candidates.
    3. Keep relevant results using a reasonable score threshold.
    4. If the query contains an IS number, prefer matching
       standard-number results.
    5. Return the best results.

    Example:

        "What is IS 1417?"

    will detect:

        IS 1417

    and prefer chunks whose payload contains:

        is_number = "IS 1417"
    """

    if not query or not query.strip():
        return []

    query = query.strip()

    # ---------------------------------------------------------------
    # 1. LOAD EMBEDDINGS
    # ---------------------------------------------------------------

    embeddings = _load_embeddings()

    # ---------------------------------------------------------------
    # 2. CREATE QUERY VECTOR
    # ---------------------------------------------------------------

    query_vector = embeddings.embed_query(
        query
    )

    # ---------------------------------------------------------------
    # 3. CONNECT TO QDRANT
    # ---------------------------------------------------------------

    client = get_client()

    # ---------------------------------------------------------------
    # 4. VECTOR SEARCH
    # ---------------------------------------------------------------

    # Retrieve more candidates than the final top_k.
    #
    # This prevents relevant chunks from being lost too early.
    results = qdrant_search(
        client,
        query_vector,
        top_k=max(
            RETRIEVAL_K,
            top_k,
        ),
    )

    if not results:
        return []

    # ---------------------------------------------------------------
    # 5. DETECT STANDARD NUMBER
    # ---------------------------------------------------------------

    requested_standard = _extract_is_number(
        query
    )

    # ---------------------------------------------------------------
    # 6. REMOVE ONLY VERY WEAK RESULTS
    # ---------------------------------------------------------------

    filtered_results = [
        chunk
        for chunk in results
        if float(
            chunk.get(
                "score",
                0.0,
            )
        ) >= MIN_SCORE
    ]

    # ---------------------------------------------------------------
    # 7. STANDARD-AWARE RANKING
    # ---------------------------------------------------------------

    if requested_standard:

        standard_results = [
            chunk
            for chunk in filtered_results
            if str(
                chunk.get(
                    "is_number",
                    "",
                )
            ).strip().upper()
            == requested_standard.upper()
        ]

        # If exact standard matches exist, prioritize them.
        if standard_results:

            standard_results.sort(
                key=lambda item: float(
                    item.get(
                        "score",
                        0.0,
                    )
                ),
                reverse=True,
            )

            return standard_results[:top_k]

    # ---------------------------------------------------------------
    # 8. NORMAL SCORE SORTING
    # ---------------------------------------------------------------

    filtered_results.sort(
        key=lambda item: float(
            item.get(
                "score",
                0.0,
            )
        ),
        reverse=True,
    )

    # ---------------------------------------------------------------
    # 9. RETURN BEST RESULTS
    # ---------------------------------------------------------------

    return filtered_results[:top_k]


# -------------------------------------------------------------------
# GENERATE GROUNDED ANSWER
# -------------------------------------------------------------------

def generate_grounded_answer(
    query: str,
    context_chunks: list,
) -> tuple[str, str]:
    """
    Generate an answer using only retrieved BIS evidence.

    Returns:

        answer
        generation_mode

    generation_mode can be:

        "llm"
        "offline_fallback"
    """

    # ---------------------------------------------------------------
    # NO CONTEXT
    # ---------------------------------------------------------------

    if not context_chunks:

        return (
            fallback_generate(
                query,
                [],
            ),
            "offline_fallback",
        )

    # ---------------------------------------------------------------
    # LOAD LLM
    # ---------------------------------------------------------------

    llm = _load_llm()

    # ---------------------------------------------------------------
    # LLM NOT AVAILABLE
    # ---------------------------------------------------------------

    if llm is None:

        print(
            "[llm] Using offline grounded fallback."
        )

        return (
            fallback_generate(
                query,
                context_chunks,
            ),
            "offline_fallback",
        )

    # ---------------------------------------------------------------
    # BUILD GROUNDED PROMPT
    # ---------------------------------------------------------------

    prompt = build_prompt(
        query,
        context_chunks,
    )

    # ---------------------------------------------------------------
    # CALL LLM
    # ---------------------------------------------------------------

    try:

        response = llm.invoke(
            prompt
        )

        # -----------------------------------------------------------
        # HANDLE NORMAL STRING RESPONSE
        # -----------------------------------------------------------

        if isinstance(
            response.content,
            str,
        ):

            text = response.content

        # -----------------------------------------------------------
        # HANDLE STRUCTURED RESPONSE
        # -----------------------------------------------------------

        elif isinstance(
            response.content,
            list,
        ):

            text_parts = []

            for block in response.content:

                if isinstance(
                    block,
                    dict,
                ):

                    text_parts.append(
                        block.get(
                            "text",
                            "",
                        )
                    )

                else:

                    text_parts.append(
                        str(block)
                    )

            text = "".join(
                text_parts
            )

        else:

            text = str(
                response.content
            )

        text = text.strip()

        # -----------------------------------------------------------
        # EMPTY RESPONSE
        # -----------------------------------------------------------

        if not text:

            raise ValueError(
                "LLM returned an empty response."
            )

        return (
            text,
            "llm",
        )

    # ---------------------------------------------------------------
    # API ERROR / QUOTA ERROR
    # ---------------------------------------------------------------

    except Exception as exc:

        print(
            f"[llm] Generation failed: {exc}"
        )

        print(
            "[llm] Falling back to offline "
            "grounded answer."
        )

        return (
            fallback_generate(
                query,
                context_chunks,
            ),
            "offline_fallback",
        )
