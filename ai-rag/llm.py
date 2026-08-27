"""
LLM backend for BharatMaanak AI.

Priority:

1. Google Gemini
2. OpenAI
3. Offline grounded fallback

The LLM receives ONLY retrieved BIS context.
"""

import os
from typing import Optional


# -------------------------------------------------------------------
# LLM
# -------------------------------------------------------------------

def get_llm() -> Optional[object]:

    # ---------------------------------------------------------------
    # GEMINI
    # ---------------------------------------------------------------

    google_api_key = os.getenv(
        "GOOGLE_API_KEY"
    )

    if google_api_key:

        try:

            from langchain_google_genai import (
                ChatGoogleGenerativeAI
            )

            llm = ChatGoogleGenerativeAI(
                model="gemini-3.6-flash",
                temperature=0.2,
            )

            print(
                "[llm] Using Google Gemini: "
                "gemini-3.6-flash"
            )

            return llm

        except Exception as exc:

            print(
                f"[llm] Gemini unavailable: {exc}"
            )

    # ---------------------------------------------------------------
    # OPENAI
    # ---------------------------------------------------------------

    openai_api_key = os.getenv(
        "OPENAI_API_KEY"
    )

    if openai_api_key:

        try:

            from langchain_openai import (
                ChatOpenAI
            )

            llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0.2,
            )

            print(
                "[llm] Using OpenAI"
            )

            return llm

        except Exception as exc:

            print(
                f"[llm] OpenAI unavailable: {exc}"
            )

    # ---------------------------------------------------------------
    # FALLBACK
    # ---------------------------------------------------------------

    print(
        "[llm] No working LLM found - "
        "using offline grounded fallback."
    )

    return None


# -------------------------------------------------------------------
# SYSTEM PROMPT
# -------------------------------------------------------------------

SYSTEM_PROMPT = """
You are BharatMaanak AI, an assistant for Indian Standards
and BIS services.

STRICT RULES:

1. Answer ONLY using the supplied BIS context.
2. Do NOT use outside knowledge.
3. Do NOT guess.
4. Every factual claim must include its IS number
   and clause number.
5. If the context is insufficient, clearly state that
   the information was not found in the available BIS
   knowledge base.
6. Keep the answer concise.
""".strip()


# -------------------------------------------------------------------
# PROMPT
# -------------------------------------------------------------------

def build_prompt(
    query: str,
    context_chunks: list,
) -> str:

    if not context_chunks:

        context_block = (
            "No relevant BIS clauses were retrieved."
        )

    else:

        context_block = "\n\n".join(
            (
                f"[{chunk['is_number']} — "
                f"Clause {chunk['clause_number']}]\n"
                f"{chunk['text']}"
            )
            for chunk in context_chunks
        )

    return (
        f"{SYSTEM_PROMPT}\n\n"

        f"CONTEXT:\n"
        f"{context_block}\n\n"

        f"QUESTION:\n"
        f"{query}\n\n"

        "Answer ONLY from the context.\n"

        "For every factual statement, include "
        "the citation in this format:\n"

        "(IS 4250, Clause 6.4)"
    )


# -------------------------------------------------------------------
# FALLBACK
# -------------------------------------------------------------------

def fallback_generate(
    query: str,
    context_chunks: list,
) -> str:

    if not context_chunks:

        return (
            "I couldn't find a relevant BIS clause "
            "in the current knowledge base that "
            "directly answers this question."
        )

    lines = [
        (
            "Based on the available BIS context, "
            "the relevant requirements are:"
        )
    ]

    for index, chunk in enumerate(
        context_chunks,
        start=1,
    ):

        lines.append(
            (
                f"{index}. {chunk['text']} "
                f"({chunk['is_number']}, "
                f"Clause {chunk['clause_number']})."
            )
        )

    return "\n".join(
        lines
    )