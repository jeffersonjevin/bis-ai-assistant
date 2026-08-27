"""
NLI Evidence Verification for BharatMaanak AI.

Evidence = premise
Claim    = hypothesis

The citation is used to FIND the correct BIS evidence,
but the citation itself is removed before NLI comparison.

This prevents citation text from interfering with
the semantic entailment model.
"""

from typing import List, Dict, Any, Optional
import re

import torch

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)


# -------------------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------------------

MODEL_NAME = "cross-encoder/nli-deberta-v3-small"

ENTAILMENT_THRESHOLD = 0.70
CONTRADICTION_THRESHOLD = 0.70

_tokenizer = None
_model = None


# -------------------------------------------------------------------
# LOAD MODEL
# -------------------------------------------------------------------

def get_nli_model():

    global _tokenizer
    global _model

    if _tokenizer is None or _model is None:

        print(
            f"[nli] Loading model: {MODEL_NAME}"
        )

        _tokenizer = AutoTokenizer.from_pretrained(
            MODEL_NAME
        )

        _model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_NAME
        )

        _model.eval()

        print("[nli] Model loaded")

        print(
            f"[nli] Model labels: "
            f"{_model.config.id2label}"
        )

    return _tokenizer, _model


# -------------------------------------------------------------------
# GET LABEL IDS
# -------------------------------------------------------------------

def get_label_ids(model):

    contradiction_id = None
    entailment_id = None
    neutral_id = None

    for index, label in model.config.id2label.items():

        label = str(label).lower()

        if "contradiction" in label:
            contradiction_id = int(index)

        elif "entailment" in label:
            entailment_id = int(index)

        elif "neutral" in label:
            neutral_id = int(index)

    return (
        contradiction_id,
        entailment_id,
        neutral_id,
    )


# -------------------------------------------------------------------
# REMOVE CITATION FROM CLAIM
# -------------------------------------------------------------------

def remove_citation(text: str) -> str:
    """
    Remove BIS citation from a claim before NLI.

    Example:

        Every pressure cooker must have a safety valve
        (IS 4250, Clause 6.4).

    becomes:

        Every pressure cooker must have a safety valve.
    """

    if not text:
        return ""

    # Remove:
    #
    # (IS 4250, Clause 6.4)
    #
    # IS 4250, Clause 6.4
    #
    text = re.sub(
        r"\(?\s*IS\s+[\w]+"
        r"(?:\s+Part\s+\w+)?"
        r"\s*,?\s*Clause\s+[\w.\-]+"
        r"\s*\)?",
        "",
        text,
        flags=re.IGNORECASE,
    )

    # Remove markdown bold.
    text = text.replace(
        "**",
        "",
    )

    # Remove blockquote marker.
    text = re.sub(
        r"^\s*>\s*",
        "",
        text,
    )

    # Remove excessive whitespace.
    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


# -------------------------------------------------------------------
# EXTRACT CITATION
# -------------------------------------------------------------------

def extract_citation(
    text: str,
) -> Optional[Dict[str, str]]:
    """
    Extract a citation such as:

        IS 4250, Clause 6.4

    """

    if not text:
        return None

    pattern = re.compile(
        r"\b(IS\s+[\w]+"
        r"(?:\s+Part\s+\w+)?)"
        r"\s*,?\s*Clause\s+([\w.\-]+)",
        re.IGNORECASE,
    )

    match = pattern.search(
        text
    )

    if not match:
        return None

    return {
        "is_number": match.group(
            1
        ).strip(),

        "clause_number": match.group(
            2
        ).strip(),
    }


# -------------------------------------------------------------------
# FIND EXACT CITED CHUNK
# -------------------------------------------------------------------

def find_matching_chunk(
    claim: str,
    chunks: List[Dict[str, Any]],
):

    citation = extract_citation(
        claim
    )

    if not citation:
        return None

    wanted_is = citation[
        "is_number"
    ].lower()

    wanted_clause = citation[
        "clause_number"
    ].lower()

    for chunk in chunks:

        chunk_is = str(
            chunk.get(
                "is_number",
                "",
            )
        ).lower()

        chunk_clause = str(
            chunk.get(
                "clause_number",
                "",
            )
        ).lower()

        if (
            chunk_is == wanted_is
            and chunk_clause == wanted_clause
        ):

            return chunk

    return None


# -------------------------------------------------------------------
# RUN NLI
# -------------------------------------------------------------------

def run_nli(
    claim: str,
    evidence: str,
) -> Dict[str, Any]:

    tokenizer, model = get_nli_model()

    # IMPORTANT:
    # Remove citation before semantic comparison.
    clean_claim = remove_citation(
        claim
    )

    clean_evidence = evidence.strip()

    encoded = tokenizer(
        clean_evidence,
        clean_claim,
        return_tensors="pt",
        truncation=True,
        max_length=512,
    )

    with torch.no_grad():

        outputs = model(
            **encoded
        )

    probabilities = torch.softmax(
        outputs.logits,
        dim=-1,
    )[0]

    (
        contradiction_id,
        entailment_id,
        neutral_id,
    ) = get_label_ids(model)

    contradiction_probability = 0.0
    entailment_probability = 0.0
    neutral_probability = 0.0

    if contradiction_id is not None:

        contradiction_probability = float(
            probabilities[
                contradiction_id
            ].item()
        )

    if entailment_id is not None:

        entailment_probability = float(
            probabilities[
                entailment_id
            ].item()
        )

    if neutral_id is not None:

        neutral_probability = float(
            probabilities[
                neutral_id
            ].item()
        )

    # ---------------------------------------------------------------
    # DECISION
    # ---------------------------------------------------------------

    if (
        entailment_probability
        >= ENTAILMENT_THRESHOLD
    ):

        status = "SUPPORTED"

    elif (
        contradiction_probability
        >= CONTRADICTION_THRESHOLD
    ):

        status = "CONTRADICTED"

    else:

        status = "UNSUPPORTED"

    # Confidence should represent the selected
    # semantic status, NOT neutral probability
    # when the result is unsupported.

    if status == "SUPPORTED":

        confidence = entailment_probability

    elif status == "CONTRADICTED":

        confidence = contradiction_probability

    else:

        confidence = max(
            entailment_probability,
            contradiction_probability,
            neutral_probability,
        )

    return {
        "status": status,

        "confidence": round(
            confidence,
            4,
        ),

        "entailment_probability": round(
            entailment_probability,
            4,
        ),

        "contradiction_probability": round(
            contradiction_probability,
            4,
        ),

        "neutral_probability": round(
            neutral_probability,
            4,
        ),
    }


# -------------------------------------------------------------------
# VERIFY ONE CLAIM
# -------------------------------------------------------------------

def verify_claim(
    claim: str,
    evidence: str,
) -> Dict[str, Any]:

    if not claim or not evidence:

        return {
            "claim": claim,
            "status": "UNSUPPORTED",
            "confidence": 0.0,
        }

    result = run_nli(
        claim,
        evidence,
    )

    return {
        "claim": claim,
        **result,
    }


# -------------------------------------------------------------------
# VERIFY CLAIM AGAINST CHUNKS
# -------------------------------------------------------------------

def verify_claim_against_chunks(
    claim: str,
    chunks: List[Dict[str, Any]],
) -> Dict[str, Any]:

    if not chunks:

        return {
            "claim": claim,
            "status": "UNSUPPORTED",
            "confidence": 0.0,
            "evidence": None,
        }

    # ---------------------------------------------------------------
    # 1. USE CLAIM CITATION
    # ---------------------------------------------------------------

    cited_chunk = find_matching_chunk(
        claim,
        chunks,
    )

    if cited_chunk:

        print(
            "[nli] Citation matched: "
            f"{cited_chunk.get('is_number')} | "
            f"Clause "
            f"{cited_chunk.get('clause_number')}"
        )

        result = verify_claim(
            claim,
            cited_chunk.get(
                "text",
                "",
            ),
        )

        result["evidence"] = {
            "is_number": cited_chunk.get(
                "is_number"
            ),

            "clause_number": cited_chunk.get(
                "clause_number"
            ),

            "page": cited_chunk.get(
                "page"
            ),

            "title": cited_chunk.get(
                "title"
            ),

            "text": cited_chunk.get(
                "text"
            ),
        }

        return result

    # ---------------------------------------------------------------
    # 2. NO CITATION
    #
    # Check retrieved chunks.
    # ---------------------------------------------------------------

    results = []

    for chunk in chunks:

        evidence = chunk.get(
            "text",
            "",
        )

        if not evidence:
            continue

        result = verify_claim(
            claim,
            evidence,
        )

        result["evidence"] = {
            "is_number": chunk.get(
                "is_number"
            ),

            "clause_number": chunk.get(
                "clause_number"
            ),

            "page": chunk.get(
                "page"
            ),

            "title": chunk.get(
                "title"
            ),

            "text": evidence,
        }

        results.append(
            result
        )

    if not results:

        return {
            "claim": claim,
            "status": "UNSUPPORTED",
            "confidence": 0.0,
            "evidence": None,
        }

    # ---------------------------------------------------------------
    # 3. BEST ENTAILMENT
    # ---------------------------------------------------------------

    supported = max(
        results,
        key=lambda item:
        item.get(
            "entailment_probability",
            0.0,
        ),
    )

    if (
        supported.get(
            "entailment_probability",
            0.0,
        )
        >= ENTAILMENT_THRESHOLD
    ):

        return supported

    # ---------------------------------------------------------------
    # 4. BEST CONTRADICTION
    # ---------------------------------------------------------------

    contradicted = max(
        results,
        key=lambda item:
        item.get(
            "contradiction_probability",
            0.0,
        ),
    )

    if (
        contradicted.get(
            "contradiction_probability",
            0.0,
        )
        >= CONTRADICTION_THRESHOLD
    ):

        return contradicted

    # ---------------------------------------------------------------
    # 5. UNSUPPORTED
    # ---------------------------------------------------------------

    return supported


# -------------------------------------------------------------------
# VERIFY MULTIPLE CLAIMS
# -------------------------------------------------------------------

def verify_claims(
    claims: List[str],
    chunks: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:

    return [
        verify_claim_against_chunks(
            claim,
            chunks,
        )
        for claim in claims
    ]