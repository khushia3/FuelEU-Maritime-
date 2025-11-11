# 🧠 AGENT_WORKFLOW.md

## ⚙️ Overview

The **FuelEU-Maritime-it** project uses multiple AI Agents to automate maritime emission monitoring, compliance validation, and reporting workflows.  
Each agent is responsible for a specific domain task, ensuring modularity, accuracy, and scalability within the system.

---

## 🧩 AI Agent Workflow

### 1. 🧾 **Data Ingestion Agent**
- **Purpose:** Process incoming fuel and voyage datasets from CSV/API uploads.  
- **Functionality:**
  - Validates data schema and cleans missing values.  
  - Normalizes fuel types and voyage metrics for consistency.  
  - Stores verified data in the backend database.  
- **Output:** A standardized dataset ready for emission computation.

---

### 2. ⚡ **Computation & Analysis Agent**
- **Purpose:** Calculate CO₂ emissions using the IMO and FuelEU regulatory formulae.  
- **Functionality:**
  - Applies emission factors to compute total emissions per voyage.  
  - Integrates ML models for predictive analytics (forecasting emission trends).  
  - Flags irregularities in reported values using threshold-based logic.  
- **Output:** Emission summary and deviation insights.

---

### 3. 🧠 **Compliance Validation Agent**
- **Purpose:** Determine whether the computed emissions meet FuelEU compliance thresholds.  
- **Functionality:**
  - Compares each voyage’s emission metrics with EU standards.  
  - Marks ships as `Compliant` or `Non-Compliant`.  
  - Generates improvement suggestions if deviations are detected.  
- **Output:** Compliance classification and recommendations.

---

### 4. 📊 **Report Generation Agent**
- **Purpose:** Convert computed data and compliance results into readable reports.  
- **Functionality:**
  - Produces structured JSON, CSV, or PDF reports.  
  - Adds AI-driven narrative summaries for non-technical users.  
  - Sends results via dashboard or email endpoints.  
- **Output:** Human-readable compliance report.

---

## 🔁 **Workflow Summary**

Data Upload → Data Ingestion Agent → Computation & Analysis Agent
→ Compliance Validation Agent → Report Generation Agent → User Dashboard


Each agent triggers automatically based on API calls or user actions in the frontend dashboard.

---

## 🧭 **Tools and Frameworks**
| Component | Technology |
|------------|-------------|
| Backend Engine | FastAPI / Flask |
| AI Agents | Python (Custom Modules) |
| Frontend Dashboard | React + Tailwind CSS |
| Database | PostgreSQL / MongoDB |
| ML Support | scikit-learn / pandas / NumPy |

---

## 🚀 **Future Enhancements**
- Add **LangGraph or CrewAI** for multi-agent orchestration.  
- Enable **real-time voyage data streaming** and anomaly alerts.  
- Integrate **LLM-based explanation agent** for report insights.  
- Implement **agent-based testing pipelines** for accuracy assurance.

---

## ✅ Summary
The AI Agent architecture transforms FuelEU-Maritime-it from a static calculator into a **dynamic, self-adaptive compliance platform**.  
Each agent automates a stage of the workflow, reducing manual workload while improving regulatory accuracy and response speed.
