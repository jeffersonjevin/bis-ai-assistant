"""
LangGraph orchestration for BharatMaanak AI.

Flow:

    User Query
        ↓
    Intent Detection
        ↓
    Specialized Agent
        ↓
    Retrieval / Processing
        ↓
    Answer
"""

from langgraph.graph import (
    StateGraph,
    END,
)

from state import RAGState

from intent import classify_intent

from agents import (
    standard_finder,
    certification,
    hallmarking,
    lab,
    consumer,
)

from vectorstore import close_client


# -------------------------------------------------------------------
# AGENTS
# -------------------------------------------------------------------

_AGENT_NODES = {

    "standard_finder":
        standard_finder.run,

    "certification":
        certification.run,

    "hallmarking":
        hallmarking.run,

    "lab":
        lab.run,

    "consumer":
        consumer.run,
}


# -------------------------------------------------------------------
# ROUTING
# -------------------------------------------------------------------

def _route(state: RAGState) -> str:
    """
    Route the query according to detected intent.
    """

    intent = state.get("intent")

    if intent not in _AGENT_NODES:

        # Safe fallback.
        return "standard_finder"

    return intent


# -------------------------------------------------------------------
# BUILD GRAPH
# -------------------------------------------------------------------

def build_graph():

    graph = StateGraph(RAGState)

    # Intent node.
    graph.add_node(
        "classify_intent",
        classify_intent,
    )

    # Specialized agents.
    for name, function in _AGENT_NODES.items():

        graph.add_node(
            name,
            function,
        )

    graph.set_entry_point(
        "classify_intent"
    )

    graph.add_conditional_edges(
        "classify_intent",
        _route,
        {
            name: name
            for name in _AGENT_NODES
        },
    )

    for name in _AGENT_NODES:

        graph.add_edge(
            name,
            END,
        )

    return graph.compile()


# -------------------------------------------------------------------
# COMPILED GRAPH
# -------------------------------------------------------------------

_compiled_graph = None


def get_graph():

    global _compiled_graph

    if _compiled_graph is None:

        _compiled_graph = build_graph()

    return _compiled_graph


# -------------------------------------------------------------------
# ANSWER QUERY
# -------------------------------------------------------------------

def answer_query(query: str) -> dict:
    """
    Execute the complete LangGraph workflow.
    """

    if not query or not query.strip():

        raise ValueError(
            "Query cannot be empty."
        )

    graph = get_graph()

    result = graph.invoke(
        {
            "query": query.strip()
        }
    )

    return result


# -------------------------------------------------------------------
# CLI TEST
# -------------------------------------------------------------------

if __name__ == "__main__":

    import sys

    query = (
        sys.argv[1]
        if len(sys.argv) > 1
        else
        "What safety standard applies to a pressure cooker?"
    )

    try:

        result = answer_query(
            query
        )

        print(
            f"\nQ: {result.get('query')}"
        )

        print(
            f"Routed to: "
            f"{result.get('agent_used')}"
        )

        print(
            f"Confidence: "
            f"{result.get('confidence')}"
        )

        print(
            f"\nA:\n"
            f"{result.get('answer')}"
        )

        print("\nSources:")

        for source in result.get(
            "sources",
            [],
        ):

            print(
                f"  - {source}"
            )

    finally:

        close_client()