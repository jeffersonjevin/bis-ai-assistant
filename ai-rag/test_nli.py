from nli_verifier import verify_claim


evidence = """
Every pressure cooker shall be fitted with a safety valve
or equivalent device designed to release excess pressure
before the working pressure exceeds the safe limit specified
in Table 2.
"""

claim = """
Every pressure cooker must be fitted with a safety valve
or equivalent device designed to release excess pressure
before the working pressure exceeds the safe limit.
"""


result = verify_claim(
    claim=claim,
    evidence=evidence,
)


print("\n================ NLI TEST ================")

print(
    "Claim:",
    result["claim"]
)

print(
    "Status:",
    result["status"]
)

print(
    "Confidence:",
    result["confidence"]
)

print(
    "Raw label:",
    result["raw_label"]
)

print(
    "Contradiction:",
    result["contradiction_probability"]
)

print(
    "Entailment:",
    result["entailment_probability"]
)

print(
    "Neutral:",
    result["neutral_probability"]
)

print("==========================================")