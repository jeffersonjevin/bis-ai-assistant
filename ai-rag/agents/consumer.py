def run(state: dict) -> dict:

    answer = (
        "For consumer grievances related to a "
        "BIS-certified or hallmarked product, you can:\n\n"

        "1. File a complaint via the BIS CARE portal "
        "or BIS CARE mobile app.\n\n"

        "2. Provide the product's license number "
        "or HUID for verification.\n\n"

        "3. Track the resolution status online.\n\n"

        "Tip: Verify the license or HUID first."
    )

    return {
        **state,

        "sources": [],

        "answer": answer,

        "confidence": 0.7,

        "agent_used": "consumer_grievance",

        "low_confidence_flag": False,

        "generation_mode": "template",
    }
