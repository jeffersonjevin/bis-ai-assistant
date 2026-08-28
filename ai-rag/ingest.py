"""
BharatMaanak AI - BIS RAG ingestion.

Loads BIS CSV datasets, creates embeddings,
and stores the resulting vectors in Qdrant.
"""

import os
import pickle

from dotenv import load_dotenv

from embeddings import (
    get_embeddings,
    TfidfEmbeddings,
)

from vectorstore import (
    get_client,
    build_collection,
)

from data.dataset_loader import (
    load_all_datasets,
)


load_dotenv()


VECTORIZER_PATH = os.path.join(
    os.path.dirname(
        os.path.abspath(__file__)
    ),
    "vectorizer_state.pkl",
)


def run_ingestion():

    print(
        "\n========================================"
    )

    print(
        "       BIS QDRANT INGESTION"
    )

    print(
        "========================================"
    )

    raw_docs = load_all_datasets()

    if not raw_docs:

        raise RuntimeError(
            "No BIS documents were loaded."
        )

    texts = [
        str(
            document.get(
                "text",
                ""
            )
        ).strip()
        for document in raw_docs
    ]

    valid_docs = [
        document
        for document, text in zip(
            raw_docs,
            texts
        )
        if text
    ]

    texts = [
        document["text"]
        for document in valid_docs
    ]

    print(
        f"\n[ingest] Loaded "
        f"{len(valid_docs)} BIS records."
    )

    payloads = []

    for document in valid_docs:

        payloads.append({

            "id":
                document.get(
                    "id",
                    ""
                ),

            "text":
                document.get(
                    "text",
                    ""
                ),

            "title":
                document.get(
                    "title",
                    ""
                ),

            "category":
                document.get(
                    "category",
                    ""
                ),

            "is_number":
                document.get(
                    "is_number",
                    ""
                ),

            "clause_number":
                document.get(
                    "clause_number",
                    ""
                ),

            "page":
                document.get(
                    "page",
                    ""
                ),

            "source_title":
                document.get(
                    "source_title",
                    ""
                ),

            "source_url":
                document.get(
                    "source_url",
                    ""
                ),
        })

    embeddings = get_embeddings()

    print(
        f"\n[ingest] Embedding "
        f"{len(texts)} BIS records..."
    )

    vectors = embeddings.embed_documents(
        texts
    )

    if len(vectors) != len(payloads):

        raise RuntimeError(
            "Embedding/payload count mismatch: "
            f"{len(vectors)} vectors vs "
            f"{len(payloads)} payloads."
        )

    print(
        f"[ingest] Created "
        f"{len(vectors)} vectors."
    )

    client = get_client()

    build_collection(
        client,
        vectors,
        payloads,
    )

    print(
        "\n========================================"
    )

    print(
        "SUCCESS: Qdrant ingestion completed!"
    )

    print(
        f"Records indexed: {len(vectors)}"
    )

    print(
        "Collection: bis_clauses"
    )

    print(
        "========================================"
    )

    if isinstance(
        embeddings,
        TfidfEmbeddings
    ):

        with open(
            VECTORIZER_PATH,
            "wb",
        ) as file:

            pickle.dump(
                embeddings.vectorizer,
                file
            )

        print(
            "[ingest] TF-IDF vectorizer saved."
        )


if __name__ == "__main__":

    run_ingestion()