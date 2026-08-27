"""
Claim extraction for BharatMaanak AI.

Extracts factual claims from the generated answer
for downstream NLI verification.
"""

import re


def clean_claim(text: str) -> str:
    """
    Clean markdown formatting from a claim.
    """

    text = text.strip()

    # Remove markdown bullets.
    text = re.sub(
        r"^[-*]\s+",
        "",
        text,
    )

    # Remove numbered list markers.
    text = re.sub(
        r"^\d+\.\s+",
        "",
        text,
    )

    # Remove blockquote marker.
    text = re.sub(
        r"^>\s*",
        "",
        text,
    )

    # Remove bold markdown.
    text = text.replace(
        "**",
        "",
    )

    return text.strip()


def is_citation_only(text: str) -> bool:
    """
    Check whether a line is only a citation.
    """

    cleaned = text.strip()

    if not cleaned:
        return True

    # Example:
    # (IS 4250, Clause 6.4)
    if re.fullmatch(
        r"\(?\s*IS\s+.+?\s*,?\s*Clause\s+[\w.\-]+\s*\)?",
        cleaned,
        re.IGNORECASE,
    ):
        return True

    return False


def is_heading_or_intro(text: str) -> bool:
    """
    Remove headings and generic introductory sentences.
    """

    lower = text.lower().strip()

    ignored_starts = (
        "based on ",
        "according to ",
        "the following ",
        "the relevant ",
        "the applicable ",
        "sources:",
        "source:",
        "answer:",
        "context:",
        "question:",
        "also relevant",
        "relevant clauses",
        "hallmarking process:",
        "process:",
    )

    return lower.startswith(
        ignored_starts
    )


def extract_claims(answer: str) -> list[str]:
    """
    Extract factual claims from an AI-generated answer.
    """

    if not answer:
        return []

    claims = []

    lines = answer.splitlines()

    for raw_line in lines:

        line = clean_claim(
            raw_line
        )

        if not line:
            continue

        # -----------------------------------------------------------
        # IGNORE HEADINGS
        # -----------------------------------------------------------

        if line.startswith("#"):
            continue

        # -----------------------------------------------------------
        # IGNORE INTRODUCTORY TEXT
        # -----------------------------------------------------------

        if is_heading_or_intro(line):
            continue

        # -----------------------------------------------------------
        # IGNORE SOURCE/CITATION-ONLY LINES
        # -----------------------------------------------------------

        if is_citation_only(line):
            continue

        # -----------------------------------------------------------
        # IGNORE VERY SHORT TEXT
        # -----------------------------------------------------------

        if len(line.split()) < 8:
            continue

        # -----------------------------------------------------------
        # IGNORE LINES THAT ARE JUST LABELS
        # -----------------------------------------------------------

        if line.endswith(":"):

            # Keep it only if there is substantial
            # factual content after the colon.
            if len(
                line.split()
            ) < 12:
                continue

        # -----------------------------------------------------------
        # REMOVE LEADING LABELS
        # -----------------------------------------------------------

        line = re.sub(
            r"^[A-Za-z][A-Za-z\s/()-]{2,50}:\s*",
            "",
            line,
        ).strip()

        if not line:
            continue

        if len(line.split()) < 8:
            continue

        # -----------------------------------------------------------
        # REMOVE DUPLICATES
        # -----------------------------------------------------------

        if line not in claims:

            claims.append(
                line
            )

    return claims