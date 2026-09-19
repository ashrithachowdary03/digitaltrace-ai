# DigitalTrace AI
### AI-Powered Public Profile & Digital Footprint Intelligence

**Tagline:** *Discover. Correlate. Verify.*

---

## 1. Project Overview

**DigitalTrace AI** is an AI-powered digital identity intelligence system designed to discover, correlate, and verify fragmented public digital information associated with an organizer-provided, consented image and limited context.

A person's digital presence may be distributed across multiple platforms such as LinkedIn, GitHub, YouTube, X/Twitter, Instagram, personal websites, company pages, conferences, hackathons, publications, and other public sources.

The same person may use different usernames, aliases, name variations, or incomplete profile information across these platforms. This makes manually connecting the information difficult and increases the possibility of incorrect matches.

DigitalTrace AI addresses this problem by combining AI-based identity matching, public profile discovery, entity resolution, information extraction, multi-platform correlation, evidence verification, and relationship analysis.

The system is designed to identify the most likely public identity, discover relevant public information, connect information across sources, and present the findings with evidence and confidence.

---

## 2. Problem Statement

Public information about an individual is often fragmented across multiple independent sources. 

For example:
* **LinkedIn** → Professional profile & role history
* **GitHub** → Projects / technical contributions
* **YouTube** → Keynote tech talk videos & interviews
* **Conference / Devpost** → Speaker & hackathon awards
* **Company Site** → Organization affiliation & executive bio
* **Google Scholar** → Academic research & peer-reviewed publications
* **USPTO** → Documented public patents

These sources may contain different names, usernames, aliases, or incomplete information. A conventional search or generic web scraper collects information but does not reliably determine whether records from different sources belong to the same individual.

**DigitalTrace AI solves this by:**
1. Identifying the most likely public identity candidates.
2. Discovering relevant public profiles from approved sources.
3. Correlating information across multiple public sources.
4. Resolving names, aliases, and usernames (`John Kumar` ↔ `johnk` ↔ `J. Kumar` ↔ `JohnKTech`).
5. Extracting structured professional and technical entities.
6. Generating chronological timelines and topological relationship graphs.
7. Providing auditable evidence and confidence ratings for every material finding.
8. Handling uncertain, conflicting, and insufficient information ethically.

---

## 3. Objectives

* **Identify Identity Candidates**: Generate the most likely public identity associated with a consented image and limited context.
* **Discover Profiles**: Retrieve authorized public profiles across approved platforms.
* **Resolve Aliases**: Mathematically match different names, handle permutations, and abbreviations.
* **Extract Entities**: Structure data into `Person → Organization → Role → Project → Event → Publication → Product → Patent → Date`.
* **Chronological Timeline**: Display career and contribution milestones chronologically.
* **Relationship Graph**: Construct an interactive topology graph connecting people, organizations, projects, and events.
* **Evidence & Confidence Matrix**: Attach verbatim proof quotes and multi-signal confidence scores to every claim.
* **Discrepancy Disclosure**: Explicitly flag uncertain, conflicting, or weak signals.
* **Ethical Safeguards**: Maintain strict consent-based and public-information boundaries.

---

## 4. Proposed Solution & Architecture

```text
Consented Image + Limited Context
                │
                ▼
       Identity Candidate
          Generation
                │
                ▼
       Public Profile
          Discovery
                │
                ▼
       Information
         Extraction
                │
                ▼
       Entity Resolution
                │
                ▼
      Multi-Platform
        Correlation
                │
                ▼
      Evidence & Confidence
          Verification
                │
        ┌───────┴────────┐
        ▼                ▼
    Timeline       Relationship
    Generation         Graph
        │                │
        └───────┬────────┘
                ▼
       DigitalTrace AI
        Intelligence
           Report
```

The system combines multiple weighted signals:
* **Image similarity** & avatar matching
* **Name similarity** (Jaro-Winkler, Levenshtein, Token-set)
* **Username & handle permutations**
* **Organization & institute congruency**
* **Role & career timeline consistency**
* **Cross-source backlinks and mutual citations**

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React |
| **Graph Topology** | React Flow (`@xyflow/react`) |
| **Charts & Metrics** | Recharts |
| **Backend API** | Python, FastAPI, Uvicorn, Pydantic v2 |
| **AI / NLP & Extraction** | Groq API (`llama-3.3-70b-versatile`), Jaro-Winkler, Sentence Similarity |
| **Database & Storage** | Supabase PostgreSQL, Supabase Storage, Local Persistence Fallback |
| **Deployment Ready** | Vercel (Frontend), Render (Backend) |

---

## 6. Key Features

### 6.1 Consent-Based Input
Accepts consented image, name, handle, organization, and domain keywords with explicit authorization verification.

### 6.2 Identity Candidate Matching
Generates possible identity candidates and aliases with confidence levels instead of treating matches as automatically confirmed.

### 6.3 Public Profile Discovery
Retrieves relevant profiles from approved sources: LinkedIn, GitHub, YouTube, Google Scholar, Devpost, X/Twitter, Medium, and Company pages.

### 6.4 AI Information Extraction
Extracts structured entities adhering to:
`Person → Organization → Role → Project → Event → Publication → Product → Patent → Date`

### 6.5 Multi-Platform Correlation
Compares multi-source data points to evaluate if records refer to the same public persona.

### 6.6 Entity Resolution
Handles diverse alias representations (`John Kumar` ↔ `johnk` ↔ `J. Kumar` ↔ `JohnKTech`).

### 6.7 Audited Evidence & Confidence
Every factual finding contains **Claim**, **Source URL**, **Supporting Evidence Quote**, **Confidence %**, and **Verification Status**.

### 6.8 Chronological Timeline
Organizes publicly documented milestones (career, releases, talks, papers) in chronological order with category filtering.

### 6.9 Interactive Relationship Graph
Renders an interactive topological graph connecting people, organizations, projects, events, and publications using React Flow.

### 6.10 False-Match & Discrepancy Handling
Flags possible matches, high-confidence matches, conflicting signals, and insufficient evidence. A single matching attribute is never treated as conclusive proof.

---

## 7. Getting Started & Installation

### Prerequisites
* Node.js 18+ and npm
* Python 3.9+ (Python 3.11 pre-configured in portable environment)

### 1. Backend Setup & Launch
```powershell
# From project root
& ".\python_env\python.exe" backend/run.py
```
> Backend API: `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`)

### 2. Frontend Setup & Launch
```powershell
cd frontend
npm install
npm run dev
```
> Frontend Web App: `http://localhost:5173`

---

## 8. Privacy and Responsible Design

DigitalTrace AI operates exclusively with consented, authorized, and publicly available information. It strictly prohibits:
* Unauthorized surveillance or tracking
* Accessing private, password-gated, or restricted accounts
* Utilizing leaked, breached, or stolen credential datasets
* Bypassing platform privacy settings or access controls
* Stalking, harassment, or identity theft

---

## 9. License & Disclaimer
This project is intended for authorized, consented, and ethical cybersecurity research, hackathon judging, and professional talent verification only.
