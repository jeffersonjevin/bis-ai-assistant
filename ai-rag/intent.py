"""
Master AI Agent intent classifier.

Routes user queries to the appropriate specialized agent.

Routing priority:
1. Certification
2. Hallmarking
3. Consumer
4. Laboratory
5. Standard finder (default)

Important:
Words such as "test", "testing", and "requirement" can refer to
a BIS standard requirement and should NOT automatically mean that
the user is asking for a laboratory.
"""

INTENT_KEYWORDS = {
    "certification": [
        "isi",
        "certificat",
        "license",
        "licence",
        "scheme",
        "crs",
        "register",
    ],

    "hallmarking": [
        "hallmark",
        "gold",
        "jewel",
        "purity",
        "huid",
        "silver",
    ],

    "consumer": [
        "complain",
        "complaint",
        "grievance",
        "fraud",
        "fake",
        "verify",
        "genuine",
    ],

    "lab": [
        "laboratory",
        "lab",
        "nearby",
        "near me",
        "testing lab",
        "test laboratory",
        "testing laboratory",
        "where can i test",
        "where to test",
        "find a lab",
    ],
}


def classify_intent(state: dict) -> dict:
    query = state["query"].lower().strip()

    # ---------------------------------------------------------
    # Laboratory intent
    # ---------------------------------------------------------
    # Do NOT route merely because the query contains "test".
    # "test requirement", "hydrostatic test", etc. are normally
    # standard/document questions.
    #
    # Laboratory routing requires an explicit laboratory context.
    # ---------------------------------------------------------

    for keyword in INTENT_KEYWORDS["lab"]:
        if keyword in query:
            return {
                **state,
                "intent": "lab"
            }

    # ---------------------------------------------------------
    # Other specialized intents
    # ---------------------------------------------------------

    for intent in ["certification", "hallmarking", "consumer"]:
        for keyword in INTENT_KEYWORDS[intent]:
            if keyword in query:
                return {
                    **state,
                    "intent": intent
                }

    # ---------------------------------------------------------
    # Default
    # ---------------------------------------------------------
    # General BIS standard questions go to standard_finder.
    # This includes:
    #
    # "What is the test requirement?"
    # "What is the safety requirement?"
    # "Which clause specifies..."
    # "What pressure should it withstand?"
    # ---------------------------------------------------------

    return {
        **state,
        "intent": "standard_finder"
    }