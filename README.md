# RefillFlow
### A workflow engine for prescription refill coordination

RefillFlow is a digital healthcare workflow platform built to coordinate prescription refill requests across **patients, pharmacies, providers, and practice staff**.
A refill request can involve multiple hand-offs before it is completed. RefillFlow turns those hand-offs into a **single, trackable case** with a clear status, responsible action, prescription information, and complete audit history.

> **Every refill request becomes a case. Every case has a state. Every action leaves a trace.**

### The problem for a B2B organization is workflow coordination:

Where is each refill request?
Who needs to act next?
Which requests are waiting for provider approval?
Has the pharmacy confirmed the action?
What happened to a particular case?
Can staff see the complete history?

## 🛠️ RefillFlow Tech Stack

| Category | Technology / Description |
| :--- | :--- |
| **🎨 Frontend** | **Next.js** — Web application framework<br>**React** — UI components<br>**TypeScript** — Type-safe development<br>**Tailwind CSS** — Responsive interface styling |
| **⚙️ Backend** | **Python** — Backend programming<br>**FastAPI** — REST API and backend services<br>**Pydantic** — Request/response validation<br>**SQLAlchemy** — Database ORM |
| **🤖 AI / Prescription Intelligence** | **AI-powered document processing** — Prescription information extraction<br>**Prescription verification workflow** — Review and validation before creating a refill case |
| **🗄️ Database** | **SQLAlchemy** — Database abstraction and models<br>**Stores:** Refill cases, Audit events, Prescription extraction data |
| **🔗 API Communication** | **REST APIs** — Frontend ↔ FastAPI backend communication<br>Environment-based API configuration |
| **☁️ Deployment & Development** | **Vercel** — Next.js frontend<br>**Render** — FastAPI backend<br>**GitHub** — Version control and repository<br>**Vercel CLI / Render CLI** — Deployment |

---

### 📐 Architecture Overview
```text
Next.js + React + TypeScript
          ↓
       REST API
          ↓
FastAPI + Pydantic + SQLAlchemy
          ↓
       Database

