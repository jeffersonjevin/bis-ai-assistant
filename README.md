# 🇮🇳 BharatMaanak AI — BIS Regulatory Intelligence Assistant

An AI-powered regulatory assistant for the Bureau of Indian Standards (BIS) that helps users understand Indian Standards, certification procedures, licensing requirements, hallmarking, QCOs and related BIS compliance information.

The system combines Retrieval-Augmented Generation (RAG), Qdrant vector search, LangGraph-based workflow orchestration, intelligent retrieval, reranking and NLI-based verification to generate grounded answers from a curated BIS knowledge base.

---

## 🎯 Problem Statement

BIS regulations, standards, certification procedures and compliance requirements are distributed across multiple documents and official web resources.

Users may find it difficult to quickly determine:

- Which Indian Standard applies to a product
- How BIS certification works
- What documents are required
- How licensing works
- What a Quality Control Order (QCO) means
- What hallmarking and HUID are
- Which official BIS source supports an answer

BharatMaanak AI provides a conversational interface that retrieves relevant BIS information and generates evidence-grounded responses.

---

## 🚀 Key Features

### 🔎 Intelligent BIS Search

Users can ask natural-language questions about:

- Indian Standards
- BIS certification
- Licensing
- Hallmarking
- HUID
- Quality Control Orders (QCOs)
- Standard Mark
- Consumer-related BIS information

---

### 🧠 Retrieval-Augmented Generation

The system follows a grounded RAG pipeline:

User Query
↓
Query Embedding
↓
Qdrant Vector Retrieval
↓
Candidate Filtering / Reranking
↓
Relevant BIS Evidence
↓
Grounded LLM Response
↓
Verification
↓
Final Answer

The LLM is provided with retrieved BIS evidence rather than relying only on its general knowledge.

---

### 🕸️ LangGraph Workflow

LangGraph is used to orchestrate the AI workflow and route queries through specialized BIS agents.

The system contains domain-specific agents for areas such as:

- Certification
- Hallmarking
- Consumer information
- Laboratory information
- Standard finding

This allows different BIS-related questions to be handled through appropriate retrieval logic.

---

### 🎯 Standard-Aware Retrieval

The system detects Indian Standard numbers from user queries.

For example:

```text
What is IS 1417?
