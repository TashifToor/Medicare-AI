# 🏥 MediCare AI — Medical RAG Chatbot

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![LangChain](https://img.shields.io/badge/LangChain-0.2-green?style=for-the-badge&logo=chainlink&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-0.5-orange?style=for-the-badge&logo=googlecloud&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**A production-ready Full Stack AI Chatbot powered by Retrieval-Augmented Generation (RAG)**  
*Ask medical questions — get precise answers from a curated clinical knowledge base.*

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📋 Table of Contents
* [Overview](#-overview)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Architecture](#-architecture)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [API Endpoints](#-api-endpoints)
* [Project Structure](#-project-structure)
* [Knowledge Base](#-knowledge-base)
* [RAG Pipeline Flow](#-rag-pipeline-flow)
* [Author](#-author)
* [Disclaimer](#-disclaimer)

---

## 🎯 Overview

**MediCare AI** is an enterprise-grade medical knowledge chatbot utilizing state-of-the-art **Retrieval-Augmented Generation (RAG)** architectures. Engineered to eliminate LLM hallucinations, the platform restricts its context strictly to verified, peer-reviewed clinical data and internal documents, ensuring precise, grounded insights for healthcare exploration.

> 💡 **Core Mechanics:** The system dynamically captures user queries, vectorizes them to query a local high-performance vector store, extracts targeted content chunks, and pipes them into Groq's LLaMA 3.3 70B engine for deterministic response compilation.

---

## ✨ Features

* 🔐 **Secure AAA Lifecycle** — JWT validation coupled with salted `bcrypt` storage profiles.
* 💬 **Context-Grounded Chat** — RAG architecture natively prevents information hallucination.
* 🗄️ **Persistent State Engine** — Multi-user session tracking managed securely inside PostgreSQL.
* 🎨 **Medical-Grade Experience** — High-contrast, clean dark theme client optimized for multi-device viewports.
* 📚 **Configured Knowledge Base** — 8 comprehensive core blueprints containing diagnostic data pre-indexed.
* 🐳 **Immutable Deployments** — Full Docker container configurations for production scaling.
* ⚡ **Sub-Second Inference** — Backed by Groq's high-throughput LLaMA 3.3 runtime framework.

---

## 🛠️ Tech Stack

### Backend Services
* **Framework:** FastAPI (Asynchronous High-Performance Routing)
* **Orchestration:** LangChain v0.2 (Agentic and Tool-Chaining Framework)
* **Vector Store:** ChromaDB v0.5 (High-Density Vector Storage)
* **Embeddings:** SentenceTransformers (`all-MiniLM-L6-v2`)
* **Inference Core:** Groq Cloud SDK + LLaMA 3.3 70B
* **Relational Store:** PostgreSQL Engine + SQLAlchemy ORM

### Frontend Client
* **Core Engine:** React 18 & Vite (Blazing Fast Asset Compilation)
* **Navigation:** React Router DOM v6
* **Data Transport:** Axios (Configured with automated Token Interceptors)

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                          React Frontend                         │
│             (Login / Register / Chat View / History)            │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP REST (Bearer JWT)
┌────────────────────────────────▼────────────────────────────────┐
│                         FastAPI Backend                         │
│      [/api/auth/*]       │      [/api/chat]      │  [/api/history]│
└──────┬───────────────────┴──────┬────────────────┴────────────────┘
       │                          │
┌──────▼──────┐            ┌──────▼────────────────────────────────┐
│ PostgreSQL  │            │              RAG Pipeline             │
│ ──────────  │            │  Query ➔ Vectorization ➔ ChromaDB     │
│ Users Schema│            │  ➔ Context Retrieval  ➔ Groq LLM      │
│ History Log │            │  ➔ Deterministic Grounded Compilation │
└─────────────┘            └───────────────────────────────────────┘
🚀 Getting StartedOption 1: Docker Compose (Recommended)Run the entire ecosystem natively inside isolation layers with a single script execution:Bash# Clone the remote tracking repository
git clone [https://github.com/TashifToor/medicare-ai.git](https://github.com/TashifToor/medicare-ai.git)
cd medicare-ai

# Initialize execution configurations
cp .env.example .env

# Spin up services
docker-compose up --build
Access the interface instantly at: http://localhost ✅Option 2: Bare-Metal Setup🟢 Backend SetupBashcd backend

# Initialize isolated runtime environment
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Inject dependencies
pip install -r requirements.txt

# Configure environments and launch
cp .env.example .env
uvicorn main:app --reload --port 8000
🔵 Frontend SetupBashcd frontend

# Install package dependencies
npm install

# Run Vite deployment development pipeline
npm run dev
🔑 Environment VariablesCreate a detailed configuration matrix inside your backend/.env file:Code snippetDATABASE_URL=postgresql://postgres:password@localhost:5432/medicare_db
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your-super-secret-jwt-key
HF_TOKEN=your_huggingface_token_here
🛈 Access API keys directly via console.groq.com.📡 API EndpointsIdentity ManagementMethodEndpointDescriptionPOST/api/auth/registerRegisters a unique user instance inside persistent schemaPOST/api/auth/loginValidates credentials and challenges back authorization tokensGET/api/auth/meProcesses signature states to deliver payload profilesChat OrchestrationMethodEndpointDescriptionPOST/api/chatTransmits runtime payload inputs to RAG engineGET/api/chat/historyFetches historical log array tied to token session keysDELETE/api/chat/historyDrops structured relational indices for clean context resetsPlatform IntegrityMethodEndpointDescriptionGET/healthValidates target routing state across operational vectorsSwagger UI is auto-generated and exposed at: http://localhost:8000/docs📁 Project StructurePlaintextmedicare-ai/
├── backend/
│   ├── core/              # Global Core Configurations
│   ├── middleware/        # Authorization Interceptors
│   │   └── auth.py        # Token Signatures & Context Handling
│   ├── models/            # SQLAlchemy Database Schemas
│   │   ├── database.py    # DB Connection Pooling Setup
│   │   ├── user.py        # Relational User Profiles
│   │   └── chat.py        # Relational Session Stores
│   ├── routes/            # FastAPI Endpoint Controllers
│   │   ├── auth.py        # Authentication Logic
│   │   └── chat.py        # Core RAG Processing Controllers
│   ├── schemas/           # Pydantic Structural Contracts
│   ├── data/              # Storage Volume Laydowns
│   │   ├── pdf/           # Embedded Source Medical Matrix Documentation
│   │   └── vector_store/  # ChromaDB Binary File Allocation System
│   ├── pipeline.py        # Main Vector RAG Processing Orchestrator
│   ├── main.py            # Primary Entry Point
│   ├── requirements.txt   # Dependencies Matrix
│   └── Dockerfile         # Python Build Layer Blueprint
├── frontend/
│   ├── src/
│   │   ├── api/           # Base Axios Transport Configurations
│   │   ├── context/       # Auth Global State Providers
│   │   ├── components/    # Reusable Interface Modules
│   │   └── pages/         # Application Main View Ports
│   ├── nginx.conf         # Static SPA Host Routing Engine Configuration
│   └── Dockerfile         # Multi-Stage Production SPA Builder
└── docker-compose.yml     # Multi-Container Application Stack Orchestrator
📚 Knowledge BaseThe vector lookup engine handles semantic extraction against these 8 core domains:Reference IndexKnowledge Document File targetDomain & Structural Coverage01Common Diseases & SymptomsPathologies: Influenza, Pneumonia, HTN, AMI, Diabetes Mellitus02Drug Info & PharmacologyApplications: Analgesics, Antibiotics, Antihypertensives, Contraindications03Medical ProceduresDiagnostics: Complete Blood Count, ECG, CT-Scan Interpretations04Emergency MedicineDirect Actions: Advanced Life Support Protocols, Anaphylaxis, Stroke Triage05Preventive MedicineOutlines: Dietetics, Systematic Profiling, Global Immunization Rules06Mental HealthDiagnostics: Clinical Depressive States, Generalized Anxiety, Mood Disorders07Paediatric MedicineCheckpoints: Milestone Matrix Tracking, Febrile Management, Respiratory Syncytial08Chronic ManagementParadigms: Long-term Care Plans, Advanced Heart Failure, Chronic Kidney Insufficiency🔄 RAG Pipeline FlowPlaintext  [ User Query Inbound ]
            │
            ▼
┌─────────────────────────┐
│ SentenceTransformer Model│ ➔ Converts text to a high-density vector
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ ChromaDB Semantic Search│ ➔ Calculates Cosine Similarity profiles
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Context Chunk Isolation │ ➔ Extracts top-K most relevant reference chunks
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Structured Prompting  │ ➔ Merges Context + Original Intent Payload
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Groq LLaMA 3.3 70B    │ ➔ High-speed factual text generation
└───────────┬─────────────┘
            │
            ▼
  [ Verified Medical Answer ]
👨‍💻 AuthorMuhammad Tashif Munir ToorAcademic Profile: BS Information Technology — University of the Punjab, Lahore 🇵🇰Professional Track: Backend & AI Engineer Intern — M1Portfolio Hub: tashif-portfolio.vercel.appGitHub Engine: @TashifToorBusiness Contact: tashiftoor12345@gmail.com

