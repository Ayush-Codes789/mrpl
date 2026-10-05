# 🛡️ Sovereign AI Workbench (SIH Problem Statement 117)
### Self-Hosted, Air-Gapped Industrial Agentic AI Platform for Refineries & Critical Infrastructure

[![Python 3.13+](https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agentic_Loop-FF6F00?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_Inference-000000?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.ai/)
[![Docker](https://img.shields.io/badge/Docker-Network_Isolated_Sandbox-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![React 19](https://img.shields.io/badge/React_19-Sovereign_Studio-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Air-Gapped](https://img.shields.io/badge/Security-Zero_Outbound_Exfiltration-critical?style=for-the-badge&logo=shield&logoColor=white)](#-air-gap-security--network-monitor)

---

## 📌 Executive Overview & Problem Statement 117

Industrial environments like **Mangalore Refinery and Petrochemicals Limited (MRPL)**, defense manufacturing units, and public sector undertakings (PSUs) manage proprietary operating procedures, confidential piping & instrumentation diagrams (P&IDs), Pressure Relief Valve (PRV) inspection logs, and critical infrastructure telemetry.

### The Challenge
* **No Cloud Exfiltration:** Critical infrastructure data **cannot** leave the refinery premises under any circumstances (CISO / national security directives forbid commercial cloud APIs like OpenAI or Anthropic).
* **Heterogeneous Engineering Tasks:** Refinery engineers require multi-modal support: analyzing handwritten inspection reports, querying dense technical SOPs, calculating set-pressure deviations in Python, and generating standardized PSU approval notes.
* **Deterministic Auditability:** Every recommendation, code execution, and autonomous decision must have a tamper-evident cryptographic audit trail for safety compliance.

### The Solution: Sovereign AI Workbench
A self-hosted, air-gapped industrial AI agent workbench running 100% on-premises on local hardware. Powered by **LangGraph**, **Ollama**, **ChromaDB**, **Docker**, and **React 19**, it guarantees:
1. **Zero Outbound Internet Calls:** Verified continuously by a real-time network socket monitor.
2. **Dynamic Multi-Stage Routing:** Cascades incoming engineering queries across specialized local models (`qwen2.5-coder:7b`, `granite4:1b`, `moondream:latest`).
3. **Singleton Hybrid RAG:** High-speed dense semantic embeddings + sparse BM25 keyword matching with singleton caching (`lru_cache`).
4. **Self-Correcting Agentic Loop:** Multi-step subtask planner with tool execution and reflection/confidence gating.
5. **Isolated Docker Sandbox:** Safe execution of generated Python/data-science scripts with `--network none`.
6. **Cryptographic SHA-256 Audit Hash-Chain:** Immutable record of all system queries, actions, and deliverables.

---

## 🏗️ System Architecture

```
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ SOVEREIGN STUDIO (React 19 + Tailwind CSS 4 + Vite)                                    │
 │  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────────────────────┐  │
 │  │ Document Workspace    │  │ Interactive Chat (SSE)│  │ Deliverables & Audit Trail │  │
 │  │ Drag & Drop SOP Ingest│  │ Live Tool Execution   │  │ Hash-Chain Verification UI │  │
 │  └───────────┬───────────┘  └───────────┬───────────┘  └─────────────▲──────────────┘  │
 └──────────────┼──────────────────────────┼────────────────────────────┼─────────────────┘
                │ HTTP / Multipart Upload  │ SSE / REST (port 8000)     │
 ┌──────────────▼──────────────────────────▼────────────────────────────┴─────────────────┐
 │ FASTAPI AIR-GAPPED BACKEND                                                             │
 │                                                                                        │
 │  ┌─────────────────────────┐     ┌──────────────────────────────────────────────────┐  │
 │  │ Ingest & Memory Engine  │     │ Router Cascade (regex → embedding → LLM judge)   │  │
 │  │ uploads/ | memory.json  │     └─────────────────────────┬────────────────────────┘  │
 │  └───────────┬─────────────┘                               │                           │
 │              │ Chunks & Embeddings                         ▼ Dispatched Task           │
 │  ┌───────────▼─────────────┐     ┌──────────────────────────────────────────────────┐  │
 │  │ Hybrid RAG Store        │ <─> │ LangGraph Autonomous Agent Loop                  │  │
 │  │ ChromaDB (Dense) + BM25 │     │ StateGraph: Plan → Execute → Evaluate → Deliver  │  │
 │  └─────────────────────────┘     └───────┬─────────────────┬────────────────┬───────┘  │
 └──────────────────────────────────────────┼─────────────────┼────────────────┼──────────┘
                                            │ Tool Calls      │ Local LLM      │ Hash Log
                                            ▼                 ▼                ▼
 ┌───────────────────────────┐  ┌───────────────────────┐  ┌───────┐  ┌────────────────┐
 │ Docker Execution Sandbox  │  │ Local Ollama Registry │  │ OCR   │  │ Audit Ledger   │
 │ --network none, RAM capped│  │ Qwen2.5-Coder /       │  │ Engine│  │ SHA-256 Hash   │
 │ Safe script execution     │  │ Granite / Moondream   │  │ Vision│  │ Chain (.audit) │
 └───────────────────────────┘  └───────────────────────┘  └───────┘  └────────────────┘
```

---

## ✨ Key Technical Pillars

### 1. 🎯 Dynamic Cascade Router
Instead of routing all requests through a massive LLM, incoming queries pass through a 3-tier cascade:
* **Stage 1 (Regex & Keyword Matcher):** Ultra-fast identification of coding keywords (`def `, `calculate`, `pandas`) and vision terms (`read form`, `handwriting`, `ocr`).
* **Stage 2 (Local Embedding Similarity):** Vector similarity against benchmark domain exemplar queries using the local sentence transformer.
* **Stage 3 (Local Judge Fallback):** For ambiguous queries, the lightweight `granite4:1b` model acts as a classification judge.

| Task Type | Assigned Model | Ollama Tag | Quantization | Primary Purpose |
|:---|:---|:---|:---|:---|
| **Coding & Data Science** | Qwen 2.5 Coder 7B | `qwen2.5-coder:7b` | Q4_K_M | Python scripts, valve math, spreadsheet analysis |
| **Reasoning & Planning** | IBM Granite 4 1B | `granite4:1b` | Q4_K_M | Task decomposition, SOP retrieval, conversational notes |
| **Vision & Scanned Forms** | Moondream2 | `moondream:latest` | Q4_K_M | P&ID symbols, handwritten maintenance slips |

---

### 2. ⚡ Singleton Hybrid RAG (Dense + BM25)
* Supports `.pdf`, `.docx`, `.txt`, `.md`, `.pptx`, and `.xls` engineering files.
* **Dense Retrieval:** Local `sentence-transformers` embeddings mapped into persistent local ChromaDB.
* **Sparse Retrieval:** Exact BM25 keyword matching for valve codes, equipment tags (e.g. `PRV-1042`), and standard codes.
* **Singleton Zero-Waste Pattern:** Embedder and ChromaDB connections are decorated with `@lru_cache(maxsize=1)`. During a batch ingestion of hundreds of chunks, models and database connections are loaded **only once**, eliminating redundant VRAM/RAM allocation.

---

### 3. 🤖 LangGraph Multi-Agent Loop
The agent loop implements a complete autonomous state machine (`agent/graph.py`):
1. **Planner (`plan_step`):** Deconstructs refinery queries into a structured Directed Acyclic Graph (DAG) of subtasks.
2. **Executor (`execute_subtask`):** Dispatches subtasks to registered tools:
   - `rag_search`: Hybrid dense + sparse SOP retrieval with document citations.
   - `document_extract`: Direct document inspection and extraction.
   - `code_exec`: Secure sandboxed script execution.
   - `ocr_vision`: Tesseract first pass with Ollama vision escalation.
   - `spreadsheet_op`: Automated calculations on refinery logs via pandas/openpyxl.
   - `memory_read` / `memory_write`: Cross-turn short-term context.
3. **Confidence Gate & Reflection (`evaluate_step`):** Verifies the step output against safety and accuracy thresholds (confidence >= 0.6). If low or deficient, it generates reflection feedback and triggers an automatic retry (up to max iterations).
4. **Deliverable Generator (`deliver_step`):** Formats deliverables (inspection approval notes, python calculation scripts, structured executive summaries) into `outputs/`.

---

### 4. 🐳 Secure Air-Gapped Sandbox
To execute Python scripts (e.g. calculating pressure relief valve tolerance deviations), the system invokes a dedicated Docker container configured with:
* `--network none`: Physically incapable of opening network sockets.
* Hard resource limits: 512MB RAM cap and 1 CPU core limit.
* Execution timeout: Process terminated after 15 seconds to prevent runaway loops.

---

### 5. 🔗 Tamper-Evident SHA-256 Audit Chain
Every operation is written to an immutable append-only ledger in `.audit/audit_chain.jsonl`.
* Each entry contains: `timestamp`, `session_id`, `task_type`, `model_tag`, `query`, `action_summary`, and `previous_hash`.
* Current hash is computed as:
  $$\text{Hash}_n = \text{SHA256}(\text{Index} \parallel \text{Timestamp} \parallel \text{Data} \parallel \text{Hash}_{n-1})$$
* Any manual tampering, line deletion, or bit-flip invalidates the entire chain, detectable via `GET /audit/verify`.

---

### 6. 🌐 Live Air-Gap Network Monitor
A standalone background diagnostic (`network_monitor/monitor.py`) continuously scans OS socket connections (`psutil`). It filters specifically for `python`, `uvicorn`, `docker`, and `containerd` processes, throwing immediate visual alerts if any connection attempts to communicate with a non-loopback IP address.

---

## 📂 Repository Structure

```
SIH-PS-117/
├── agent/                     # LangGraph autonomous workflow
│   ├── graph.py               # StateGraph: plan → execute → evaluate → deliver
│   ├── state.py               # AgentState and SubTask Pydantic models
│   ├── tools.py               # Tool definitions (rag, sandbox, vision, memory)
│   ├── deliverables.py        # Output document generator
│   └── short_term_memory.py   # Cross-session state persistence
├── audit/                     # Cryptographic compliance
│   └── hashchain.py           # SHA-256 linked audit ledger
├── backend/                   # REST & SSE backend
│   └── main.py                # FastAPI endpoints, file streaming & background ingest
├── data/                      # Sample documents & testing data
│   └── sample_docs/           # Industrial SOPs, valve guidelines, approval formats
├── models/                    # Model orchestration
│   ├── registry.py            # Local model candidates & capability resolution
│   └── registry.yaml          # Registered Ollama model definitions & VRAM specs
├── network_monitor/           # Security assurance
│   └── monitor.py             # Live air-gap non-localhost socket sniffer
├── rag/                       # Local RAG engine
│   ├── embeddings.py          # Cached local sentence-transformers embedder
│   ├── vectorstore.py         # Persistent local ChromaDB singleton
│   ├── ingest.py              # Multi-format parser & chunker (PDF, DOCX, TXT)
│   └── retrieve.py            # Hybrid Dense + BM25 ranker
├── router/                    # Task classification
│   └── cascade.py             # 3-tier cascade (regex → embedding → local LLM)
├── sandbox/                   # Secure execution
│   └── executor.py            # Docker runner (--network none, memory capped)
├── sovereign-studio/          # Web frontend
│   ├── src/                   # React 19 workspace, components, & views
│   ├── package.json           # Tailwind CSS 4 & Lucide React dependencies
│   └── vite.config.js         # Vite bundler configuration
├── demo.py                    # 6-step end-to-end pipeline validation script
├── run.py                     # Backend server launcher
├── pyproject.toml             # Python package specifications
└── requirements.txt           # Python dependencies
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
* **Operating System:** Linux, macOS, or Windows (WSL2 recommended for Docker).
* **Python:** 3.11, 3.12, or 3.13.
* **Node.js:** v18.0.0 or later.
* **Docker:** Installed and running (for sandbox code execution).
* **Ollama:** Installed and running locally ([ollama.ai](https://ollama.ai/)).

---

### 2. Pull the Local Models
Ensure Ollama is running (`ollama serve`), then pull the designated quantised models:

```bash
# Coding & script execution engine (~4.7 GB VRAM)
ollama pull qwen2.5-coder:7b

# Reasoning, planning, and task router judge (~3.3 GB VRAM)
ollama pull granite4:1b

# Vision & OCR escalation (~1.7 GB VRAM)
ollama pull moondream:latest
```

---

### 3. Install Python Dependencies

Using `pip`:
```bash
pip install -r requirements.txt
```

*(Optional)* Or using `uv`:
```bash
uv pip install -e .
```

---

### 4. Run the Verification Demo
Verify the entire backend stack (RAG singletons, hybrid retrieval, router cascade, LangGraph loop, and audit hash-chain) in a single command:

```bash
python demo.py
```

Expected output:
* Step 1: Ingests sample engineering SOPs into ChromaDB.
* Step 2: Retrieves relevant sections with BM25 + dense hybrid scores.
* Step 3: Classifies sample industrial queries across cascade stages.
* Step 4: Proves embedding and ChromaDB singletons only initialized once.
* Step 5: Executes a full LangGraph reasoning cycle via Ollama.
* Step 6: Validates cryptographic integrity of the audit hash-chain (`All OK`).

---

### 5. Start the Application

#### A. Start the FastAPI Backend
```bash
python run.py
# Server runs on: http://127.0.0.1:8000
# OpenAPI Docs:   http://127.0.0.1:8000/docs
```

#### B. Start the Sovereign Studio Frontend
Open a new terminal in the `sovereign-studio` folder:
```bash
cd sovereign-studio
npm install
npm run dev
# Studio UI runs on: http://localhost:5173
```

#### C. Run the Air-Gap Network Monitor (Optional / Demo Mode)
Open a third terminal to prove zero outbound network communication:
```bash
python -m network_monitor.monitor
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/health` | Liveness and readiness probe |
| `POST` | `/chat` | Synchronous execution of the LangGraph agent |
| `POST` | `/chat/stream` | **Server-Sent Events (SSE)** real-time streaming of planner steps and responses |
| `POST` | `/upload` | Upload engineering documents with automatic background RAG chunking |
| `GET` | `/files` | List all uploaded documents in `uploads/` |
| `POST` | `/rag/search` | Direct test of dense + BM25 hybrid document search |
| `GET` | `/models` | Retrieve loaded models, VRAM specs, and active Ollama tags |
| `GET` | `/memory` | Inspect short-term conversational working memory |
| `GET` | `/outputs` | List generated deliverables (notes, scripts, spreadsheets) |
| `GET` | `/download/{file}` | Download generated deliverable from `outputs/` |
| `GET` | `/audit` | View the last $N$ entries in the SHA-256 audit ledger |
| `GET` | `/audit/verify` | Verify cryptographic validity of the entire audit hash-chain |

---

## 🧪 Automated Testing

Execute the unit and integration test suite:

```bash
pytest tests/ -v
```

Tests cover:
* Singleton immutability and memory load counts.
* Cascade router classification accuracy.
* Docker container `--network none` isolation and timeout limits.
* Tamper detection in the audit hash chain.
* API response schemas and SSE streaming contracts.

---

## 🏆 SIH Problem Statement 117 Alignment

| SIH Requirement | How Sovereign Workbench Solves It |
|:---|:---|
| **Air-Gap Strictness** | Zero cloud calls. All models served via local Ollama. Active `psutil` network monitor confirms zero outbound traffic. |
| **Document Understanding** | Local ingestion of refinery SOPs, inspection sheets, and legacy manuals using hybrid Dense + BM25 retrieval. |
| **Actionable Engineering Automation** | Multi-agent DAG planner executes code in a sandboxed Docker container to compute engineering metrics without hallucinating math. |
| **Explainability & Compliance** | Cryptographically sealed SHA-256 hash-chain creates an immutable audit trail of every prompt, tool execution, and deliverable. |
| **Enterprise-Ready Interface** | Full-fledged React 19 UI with workspace file explorer, markdown streaming, and direct deliverable download. |
