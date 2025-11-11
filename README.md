# FuelEU-Maritime-it 🚢⚡

AI-powered system for monitoring, analyzing, and ensuring compliance with the **FuelEU Maritime Regulation**, helping ship operators meet emission standards efficiently.

---

## 🧭 Overview

The project automates maritime emission tracking and compliance using an AI-driven backend and an interactive frontend dashboard.  
It provides:
- Data upload and validation
- CO₂ emission computation
- Compliance classification
- Report generation and visualization

---

## 🧱 Architecture Summary (Hexagonal Architecture)

            ┌───────────────────────────┐
            │       Frontend (React)     │
            │ - Tailwind UI Dashboard    │
            │ - Visualization Components │
            └────────────┬───────────────┘
                         │
            ┌────────────┴────────────┐
            │     API Layer (FastAPI) │
            │ - RESTful endpoints      │
            │ - Auth & Routing         │
            └────────────┬────────────┘
                         │
            ┌────────────┴────────────┐
            │   Domain Layer (Agents) │
            │ - Emission logic        │
            │ - ML models             │
            └────────────┬────────────┘
                         │
            ┌────────────┴────────────┐
            │ Persistence (Database)  │
            │ - PostgreSQL / MongoDB  │
            └─────────────────────────┘

Each layer is independent and follows dependency inversion:  
- Frontend interacts via REST APIs only.  
- Agents perform calculations and reporting independent of UI.  
- Core logic resides in the domain layer.  

---

## ⚙️ Setup & Run Instructions

### 🧩 Prerequisites
- Node.js ≥ 18  
- Python ≥ 3.10  
- pip / npm  
- PostgreSQL or MongoDB  

---

### 🚀 Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
