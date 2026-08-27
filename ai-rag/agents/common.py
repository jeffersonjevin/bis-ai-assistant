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
# RETRIEVE BIS CLAUSES
# -------------------------------------------------------------------

def retrieve_clauses(
    query: str,
    top_k: int = 3,
):
    """
    Retrieve relevant BIS clauses from Qdrant.

    Qdrant performs the vector similarity search.
    Weak results are removed using a score threshold.
    """

    if not query or not query.strip():
        return []

    # ---------------------------------------------------------------
    # 1. LOAD EMBEDDINGS
    # ---------------------------------------------------------------

    embeddings = _load_embeddings()

    # ---------------------------------------------------------------
    # 2. CREATE QUERY VECTOR
    # ---------------------------------------------------------------

    query_vector = embeddings.embed_query(
        query.strip()
    )

    # ---------------------------------------------------------------
    # 3. CONNECT TO QDRANT
    # ---------------------------------------------------------------

    client = get_client()

    # ---------------------------------------------------------------
    # 4. VECTOR SEARCH
    # ---------------------------------------------------------------

    results = qdrant_search(
        client,
        query_vector,
        top_k=top_k,
    )

    # ---------------------------------------------------------------
    # 5. REMOVE WEAK RESULTS
    # ---------------------------------------------------------------

    # Current pressure-cooker example:
    #
    # IS 4250 Clause 6.4 → 0.8155 ✅
    # IS 4250 Clause 5.2 → 0.7732 ✅
    # IS 302 Clause 9.1   → 0.6411 ❌
    #
    # So unrelated low-score clauses are removed.

    results = [
        chunk
        for chunk in results
        if float(
            chunk.get(
                "score",
                0.0,
            )
        ) >= 0.70
    ]

    return results


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