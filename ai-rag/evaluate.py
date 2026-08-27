"""
AI-RAG Evaluation Script

Tests:
1. Intent/agent routing
2. Retrieval quality
3. Source/citation correctness
4. Golden-question evaluation
"""

from graph import answer_query


# ---------------------------------------------------------
# GOLDEN QUESTIONS
# Add more questions here as your BIS knowledge base grows.
# ---------------------------------------------------------

GOLDEN_QUESTIONS = [
    {
        "question": "What safety standard applies to a pressure cooker?",
        "expected_is": "IS 4250",
        "expected_clause": "6.4",
        "expected_page": 11,
    },
    {
        "question": "What is the hydrostatic test requirement for a pressure cooker?",
        "expected_is": "IS 4250",
        "expected_clause": "5.2",
        "expected_page": 9,
    },
    {
        "question": "What information must be marked on a household electrical appliance?",
        "expected_is": "IS 302 Part 1",
        "expected_clause": "9.1",
        "expected_page": 18,
    },
]


# ---------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------

def get_answer_text(answer):
    """
    Handles both normal string answers and Gemini structured responses.
    """
    if isinstance(answer, str):
        return answer

    if isinstance(answer, list):
        texts = []

        for item in answer:
            if isinstance(item, dict):
                if item.get("type") == "text":
                    texts.append(item.get("text", ""))
                elif "text" in item:
                    texts.append(str(item["text"]))

        return " ".join(texts)

    if isinstance(answer, dict):
        if "text" in answer:
            return str(answer["text"])

    return str(answer)


def get_sources(result):
    """
    Safely return the source list.
    """
    sources = result.get("sources", [])

    if not isinstance(sources, list):
        return []

    return sources


# ---------------------------------------------------------
# RETRIEVAL QUALITY TEST
# ---------------------------------------------------------

def check_retrieval(result, expected):
    sources = get_sources(result)

    if not sources:
        return False, "No sources retrieved"

    # Check whether expected IS number appears
    is_match = any(
        expected["expected_is"].lower()
        in str(source.get("is_number", "")).lower()
        for source in sources
    )

    # Check whether expected clause appears
    clause_match = any(
        str(expected["expected_clause"]).lower()
        == str(source.get("clause_number", "")).lower()
        for source in sources
    )

    if is_match and clause_match:
        return True, "Correct standard and clause retrieved"

    if is_match:
        return False, "Correct standard retrieved, but expected clause missing"

    return False, "Expected BIS standard not retrieved"


# ---------------------------------------------------------
# CITATION VALIDATION
# ---------------------------------------------------------

def check_citation(result, expected):
    answer = get_answer_text(result.get("answer", ""))
    sources = get_sources(result)

    answer_lower = answer.lower()

    # Standard must appear in answer
    is_in_answer = expected["expected_is"].lower() in answer_lower

    # Clause must appear in answer
    clause_in_answer = str(expected["expected_clause"]).lower() in answer_lower

    # Check source metadata
    source_match = any(
        expected["expected_is"].lower()
        == str(source.get("is_number", "")).lower()
        and str(expected["expected_clause"]).lower()
        == str(source.get("clause_number", "")).lower()
        for source in sources
    )

    if is_in_answer and clause_in_answer and source_match:
        return True, "Citation/source validated"

    problems = []

    if not is_in_answer:
        problems.append("IS number missing from answer")

    if not clause_in_answer:
        problems.append("Clause number missing from answer")

    if not source_match:
        problems.append("Matching source metadata missing")

    return False, "; ".join(problems)


# ---------------------------------------------------------
# RUN ONE GOLDEN QUESTION
# ---------------------------------------------------------

def evaluate_question(test_number, test):
    print("\n" + "=" * 70)
    print(f"TEST {test_number}")
    print("=" * 70)

    print(f"Question : {test['question']}")
    print(f"Expected : {test['expected_is']} | Clause {test['expected_clause']} | Page {test['expected_page']}")

    try:
        result = answer_query(test["question"])

        print(f"\nAgent    : {result.get('agent_used', 'unknown')}")
        print(f"Confidence: {result.get('confidence', 'unknown')}")

        answer = get_answer_text(result.get("answer", ""))

        print("\nAnswer:")
        print(answer)

        # Retrieval test
        retrieval_ok, retrieval_msg = check_retrieval(result, test)

        print("\nRetrieval:")
        print("PASS" if retrieval_ok else "FAIL", "-", retrieval_msg)

        # Citation test
        citation_ok, citation_msg = check_citation(result, test)

        print("\nCitation:")
        print("PASS" if citation_ok else "FAIL", "-", citation_msg)

        # Sources
        print("\nSources:")

        for source in get_sources(result):
            print(
                f"  - {source.get('is_number', 'N/A')} | "
                f"Clause {source.get('clause_number', 'N/A')} | "
                f"Page {source.get('page', 'N/A')} | "
                f"Score {source.get('score', 'N/A')}"
            )

        return retrieval_ok, citation_ok

    except Exception as e:
        print("\nERROR:", e)
        return False, False


# ---------------------------------------------------------
# MAIN EVALUATION
# ---------------------------------------------------------

def main():
    print("\n")
    print("=" * 70)
    print("          BIS AI-RAG GOLDEN QUESTION EVALUATION")
    print("=" * 70)

    retrieval_pass = 0
    citation_pass = 0
    total = len(GOLDEN_QUESTIONS)

    for index, test in enumerate(GOLDEN_QUESTIONS, start=1):

        retrieval_ok, citation_ok = evaluate_question(index, test)

        if retrieval_ok:
            retrieval_pass += 1

        if citation_ok:
            citation_pass += 1

    retrieval_accuracy = (retrieval_pass / total) * 100
    citation_accuracy = (citation_pass / total) * 100

    print("\n")
    print("=" * 70)
    print("                 FINAL EVALUATION")
    print("=" * 70)

    print(f"Total questions       : {total}")
    print(f"Retrieval passed      : {retrieval_pass}/{total}")
    print(f"Retrieval accuracy    : {retrieval_accuracy:.2f}%")

    print(f"Citation passed       : {citation_pass}/{total}")
    print(f"Citation accuracy     : {citation_accuracy:.2f}%")

    print("=" * 70)

    if retrieval_accuracy >= 80:
        print("Retrieval Quality     : GOOD")
    else:
        print("Retrieval Quality     : NEEDS IMPROVEMENT")

    if citation_accuracy >= 80:
        print("Citation Validation   : GOOD")
    else:
        print("Citation Validation   : NEEDS IMPROVEMENT")

    print("=" * 70)


if __name__ == "__main__":
    main()