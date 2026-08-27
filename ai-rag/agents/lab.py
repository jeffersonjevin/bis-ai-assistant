from data.schemes_labs import TESTING_LABS


def run(state: dict) -> dict:

    query = state["query"].lower()

    matched = []

    for lab in TESTING_LABS:

        standards = lab.get(
            "recognized_standards",
            [],
        )

        for standard in standards:

            parts = standard.split()

            if len(parts) > 1:

                standard_identifier = parts[1]

                if standard_identifier.lower() in query:

                    matched.append(lab)

                    break

    labs = matched or TESTING_LABS[:3]

    answer = (
        "Recognized testing labs that may serve "
        "your product:\n"
    )

    answer += "\n".join(
        f"- {lab['lab_name']} — {lab['address']}"
        for lab in labs
    )

    return {
        **state,

        "sources": [
            {
                "lab_name": lab["lab_name"]
            }
            for lab in labs
        ],

        "answer": answer,

        "confidence": 0.8,

        "agent_used": "lab_finder",

        "low_confidence_flag": False,

        "generation_mode": "template",
    }