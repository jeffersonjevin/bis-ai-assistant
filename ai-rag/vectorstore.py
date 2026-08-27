"""
Qdrant vector store wrapper for BharatMaanak AI.

Development:
    Uses local embedded Qdrant storage.

Production:
    Set QDRANT_URL and optionally QDRANT_API_KEY.
"""

import os
import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct


# -------------------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------------------

COLLECTION_NAME = "bis_clauses"

DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "qdrant_data",
)

_client = None


# -------------------------------------------------------------------
# QDRANT CLIENT
# -------------------------------------------------------------------

def get_client() -> QdrantClient:
    """
    Return the shared Qdrant client.
    """

    global _client

    if _client is not None:
        return _client

    qdrant_url = os.getenv("QDRANT_URL")

    if qdrant_url:
        _client = QdrantClient(
            url=qdrant_url,
            api_key=os.getenv("QDRANT_API_KEY"),
        )

        print("[qdrant] Using remote Qdrant server")

    else:
        _client = QdrantClient(
            path=DATA_PATH
        )

        print(
            f"[qdrant] Using local storage: {DATA_PATH}"
        )

    return _client


# -------------------------------------------------------------------
# COLLECTION
# -------------------------------------------------------------------

def collection_exists(client: QdrantClient) -> bool:
    """
    Check whether the BIS collection exists.
    """

    return client.collection_exists(
        COLLECTION_NAME
    )


def build_collection(
    client: QdrantClient,
    vectors: list,
    payloads: list,
):
    """
    Recreate the BIS collection and insert vectors.
    """

    if not vectors:
        raise ValueError(
            "Cannot build Qdrant collection: no vectors provided."
        )

    if len(vectors) != len(payloads):
        raise ValueError(
            "Number of vectors must match number of payloads."
        )

    dimension = len(vectors[0])

    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=dimension,
            distance=Distance.COSINE,
        ),
    )

    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=vector,
            payload=payload,
        )
        for vector, payload in zip(vectors, payloads)
    ]

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    print(
        f"[qdrant] Inserted {len(points)} points"
    )


# -------------------------------------------------------------------
# SEARCH
# -------------------------------------------------------------------

def search(
    client: QdrantClient,
    query_vector: list,
    top_k: int = 10,
):
    """
    Retrieve candidate BIS clauses from Qdrant.

    Qdrant performs the initial broad retrieval.
    Cross-Encoder reranking happens separately.
    """

    if not query_vector:
        return []

    if not collection_exists(client):
        print(
            f"[qdrant] Collection '{COLLECTION_NAME}' does not exist."
        )
        return []

    hits = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=top_k,
    ).points

    results = []

    for hit in hits:

        payload = hit.payload or {}

        result = {
            "score": round(float(hit.score), 4),
            **payload,
        }

        results.append(result)

    return results


# -------------------------------------------------------------------
# CLEAN SHUTDOWN
# -------------------------------------------------------------------

def close_client():
    """
    Safely close the shared Qdrant client.
    """

    global _client

    client = _client

    _client = None

    if client is None:
        return

    try:
        client.close()

    except Exception as exc:
        print(
            f"[qdrant] Cleanup warning: {exc}"
        )