"""
Sample BIS knowledge corpus — used ONLY so Pair 1 can build and test the
RAG pipeline independently, before Pair 2's real PDF ingestion pipeline is
ready. Each record becomes one retrievable "document" with metadata used
for citations (is_number, clause_number).

NOTE: clause text here is illustrative sample content written for this
hackathon build — NOT verbatim text copied from real IS documents.
Once Pair 2 delivers real parsed/chunked BIS PDFs (with the same shape:
text + is_number + clause_number + page_number), swap `load_documents()`
in ingest.py to read from their output instead of this file — nothing
else in the RAG pipeline needs to change.
"""

BIS_CORPUS = [
    {"is_number": "IS 302 Part 1", "title": "Safety of Household Electrical Appliances", "clause_number": "7.3", "page": 14,
     "text": "Appliances shall be constructed so that live parts are inaccessible to a standard test finger during normal use, and insulation resistance between live parts and accessible metal parts shall not be less than 2 megohms."},
    {"is_number": "IS 302 Part 1", "title": "Safety of Household Electrical Appliances", "clause_number": "9.1", "page": 18,
     "text": "Every appliance shall be marked legibly with rated voltage, rated frequency, rated input power, and the manufacturer's identification mark or trademark."},
    {"is_number": "IS 4250", "title": "Domestic Pressure Cookers Specification", "clause_number": "5.2", "page": 9,
     "text": "The pressure cooker body and lid shall withstand a hydrostatic test pressure of not less than 3.5 kgf per square cm without any sign of leakage, distortion, or rupture."},
    {"is_number": "IS 4250", "title": "Domestic Pressure Cookers Specification", "clause_number": "6.4", "page": 11,
     "text": "Every pressure cooker shall be fitted with a safety valve or equivalent device designed to release excess pressure before the working pressure exceeds the safe limit specified in Table 2."},
    {"is_number": "IS 1417", "title": "Grading and Marking of Gold and Gold Alloy Jewellery", "clause_number": "4.1", "page": 6,
     "text": "Gold jewellery offered for hallmarking shall conform to one of the permissible fineness grades: 14K, 18K, 20K, 22K, 23K, or 24K, as declared by the jeweller."},
    {"is_number": "IS 1417", "title": "Grading and Marking of Gold and Gold Alloy Jewellery", "clause_number": "5.3", "page": 8,
     "text": "Each hallmarked article shall bear the BIS Standard Mark, the fineness grade number, the Hallmarking Unique Identification (HUID) number, and the identification mark of the Assaying and Hallmarking Centre."},
    {"is_number": "IS 14625", "title": "Packaged Natural Mineral Water Specification", "clause_number": "3.2", "page": 4,
     "text": "Packaged natural mineral water shall not contain any added mineral salts and shall conform to the physicochemical and microbiological limits specified in the relevant tables of this standard."},
    {"is_number": "IS 9873 Part 1", "title": "Toys and Playthings Safety Requirements", "clause_number": "4.5", "page": 12,
     "text": "Toys intended for children under 3 years shall have no small parts capable of passing entirely into the small parts test cylinder, in order to eliminate choking hazards."},
    {"is_number": "IS 16046 Part 2", "title": "LED Lamps Safety Requirements", "clause_number": "6.1", "page": 10,
     "text": "LED lamps shall be designed such that surface temperature at the accessible parts does not exceed the specified limits, under normal operating conditions after a one hour thermal stabilization period."},
    {"is_number": "IS 2062", "title": "Hot Rolled Structural Steel Specification", "clause_number": "8.2", "page": 16,
     "text": "Structural steel of Grade E250 shall have a minimum yield strength of 250 MPa and minimum elongation of 23 percent, as determined per the tensile test procedure."},
    {"is_number": "IS 1786", "title": "High Strength Deformed Steel Bars for Concrete Reinforcement", "clause_number": "6.2", "page": 10,
     "text": "Reinforcement bars of grade Fe500 shall have a minimum 0.2 percent proof stress of 500 MPa and shall satisfy the elongation and bend test requirements specified in this standard."},
    {"is_number": "IS 15410", "title": "Solar Photovoltaic Modules Specification", "clause_number": "5.4", "page": 7,
     "text": "Photovoltaic modules shall be tested for thermal cycling, damp heat, and mechanical load as per the sequence defined in this standard prior to certification."},
]


def load_documents():
    """Returns the corpus as a flat list of dicts ready for chunking/embedding."""
    return BIS_CORPUS
