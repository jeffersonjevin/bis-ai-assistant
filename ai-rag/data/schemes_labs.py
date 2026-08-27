CERTIFICATION_SCHEMES = [
    {
        "scheme_name": "ISI Mark (Product Certification Scheme)",
        "description": "Voluntary/mandatory certification for manufactured products confirming conformity to the relevant Indian Standard.",
        "applicable_products": ["pressure cooker", "electrical appliance", "cement", "steel"],
        "process_steps": [
            "Submit application (Form V) with product details & test reports",
            "Factory inspection by BIS officer",
            "Sample testing at BIS-recognized/in-house lab",
            "Grant of license (valid 1-2 years, renewable)",
            "Periodic surveillance & market sampling",
        ],
        "avg_timeline_days": 90,
        "avg_fee_range": "Rs 25,000 - Rs 1,00,000 (varies by product & scheme)",
    },
    {
        "scheme_name": "CRS (Compulsory Registration Scheme)",
        "description": "Mandatory registration for notified electronics/IT products under the Electronics & IT Goods Order.",
        "applicable_products": ["led lamp", "mobile charger", "power bank", "laptop"],
        "process_steps": [
            "Get product tested at a BIS-recognized lab",
            "Apply online via BIS CRS portal with test report",
            "BIS reviews & grants Registration Number (R-Number)",
            "Affix R-Number + self-declaration on product",
        ],
        "avg_timeline_days": 30,
        "avg_fee_range": "Rs 20,000 - Rs 40,000 (registration + testing)",
    },
    {
        "scheme_name": "Hallmarking Scheme",
        "description": "Certification of gold/silver jewellery purity via BIS-recognized Assaying & Hallmarking Centres (AHCs).",
        "applicable_products": ["gold jewellery", "silver jewellery", "gold artefact"],
        "process_steps": [
            "Jeweller registers on BIS HUID portal / BIS Care app",
            "Submit jewellery batch to a licensed AHC",
            "AHC assays purity and generates unique HUID per article",
            "Hallmark + HUID engraved/lasered on the article",
        ],
        "avg_timeline_days": 2,
        "avg_fee_range": "Rs 35-45 per article (assaying + hallmarking fee)",
    },
]

TESTING_LABS = [
    {"lab_name": "BIS Regional Testing Laboratory, Chennai", "address": "CIT Campus, Taramani, Chennai, Tamil Nadu",
     "recognized_standards": ["IS 302", "IS 4250", "IS 16046"]},
    {"lab_name": "BIS Regional Testing Laboratory, Mumbai", "address": "Andheri (East), Mumbai, Maharashtra",
     "recognized_standards": ["IS 2062", "IS 1786", "IS 4031"]},
    {"lab_name": "BIS Regional Testing Laboratory, Delhi", "address": "Manak Bhavan, New Delhi",
     "recognized_standards": ["IS 9873", "IS 15410", "IS 14625"]},
    {"lab_name": "BIS Regional Testing Laboratory, Kolkata", "address": "Salt Lake City, Kolkata, West Bengal",
     "recognized_standards": ["IS 1417", "IS 2062"]},
]
