import csv
import os


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATASET_DIR = os.path.join(
    BASE_DIR,
    "datasets"
)

# Do not load starter/demo data.
EXCLUDED_FILES = {
    "person6_starter_dataset.csv",
}


def _clean(value):
    if value is None:
        return ""

    return str(value).strip()


def load_all_datasets():

    documents = []

    print("\n========================================")
    print("       BIS DATASET LOADER")
    print("========================================")
    print("Dataset folder:")
    print(DATASET_DIR)

    if not os.path.isdir(DATASET_DIR):

        print(
            "\nERROR: Dataset folder not found!"
        )

        print(
            f"Expected folder:\n{DATASET_DIR}"
        )

        return []

    csv_files = sorted(
        [
            filename
            for filename in os.listdir(
                DATASET_DIR
            )
            if filename.lower().endswith(".csv")
            and filename.lower()
            not in EXCLUDED_FILES
        ]
    )

    print(
        f"\nCSV files found: {len(csv_files)}"
    )

    for filename in csv_files:

        path = os.path.join(
            DATASET_DIR,
            filename
        )

        print(
            f"\n[READING] {filename}"
        )

        try:

            with open(
                path,
                "r",
                encoding="utf-8-sig",
                errors="replace",
                newline=""
            ) as file:

                reader = csv.DictReader(file)

                rows = list(reader)

                columns = (
                    reader.fieldnames
                    or []
                )

            print(
                f"[FOUND] {len(rows)} records"
            )

            if columns:
                print(
                    f"[COLUMNS] {columns}"
                )

            for index, row in enumerate(
                rows,
                start=1
            ):

                parts = []

                for key, value in row.items():

                    if key is None:
                        continue

                    value = _clean(value)

                    if value:

                        parts.append(
                            f"{key}: {value}"
                        )

                text = "\n".join(parts)

                if not text:
                    continue

                source_title = _clean(
                    row.get(
                        "source_title"
                    )
                )

                if not source_title:

                    source_title = _clean(
                        row.get(
                            "source_document"
                        )
                    )

                if not source_title:

                    source_title = _clean(
                        row.get(
                            "document_name"
                        )
                    )

                if not source_title:

                    source_title = filename

                source_url = _clean(
                    row.get(
                        "source_url"
                    )
                )

                if not source_url:

                    source_url = _clean(
                        row.get(
                            "url"
                        )
                    )

                is_number = _clean(
                    row.get(
                        "standard_number"
                    )
                )

                if not is_number:

                    is_number = _clean(
                        row.get(
                            "is_number"
                        )
                    )

                document = {

                    "id": (
                        _clean(
                            row.get("id")
                        )
                        or f"{filename}_{index}"
                    ),

                    "text": text,

                    "title": filename,

                    "category": (
                        _clean(
                            row.get(
                                "category"
                            )
                        )
                        or filename.replace(
                            ".csv",
                            ""
                        )
                    ),

                    "source_title":
                        source_title,

                    "source_url":
                        source_url,

                    "is_number":
                        is_number,

                    "clause_number":
                        _clean(
                            row.get(
                                "clause_number"
                            )
                        ),

                    "page":
                        _clean(
                            row.get("page")
                        ),
                }

                documents.append(
                    document
                )

        except Exception as exc:

            print(
                f"[ERROR] {filename}: {exc}"
            )

    print("\n========================================")
    print(
        f"TOTAL DATASET RECORDS: "
        f"{len(documents)}"
    )
    print("========================================")

    return documents


if __name__ == "__main__":

    records = load_all_datasets()

    print(
        f"\nSUCCESS!"
    )

    print(
        f"Loaded {len(records)} BIS records."
    )