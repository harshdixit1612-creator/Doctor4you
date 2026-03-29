# 🩺 Doctor4you — AI-Powered Personal Health Platform

<div align="center">

![Doctor4you Banner](https://img.shields.io/badge/Doctor4you-AI%20Health%20Platform-00a8ff?style=for-the-badge&logo=heart&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A locally-hosted, AI-driven health companion that analyzes your lab reports via OCR, tracks your medical conditions, generates personalized daily recovery tasks, and lets you monitor your health progress over time — all without sending your data anywhere.

</div>

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔬 **OCR Report Analyzer** | Upload CBC / blood test PDFs or images; AI extracts every parameter and scores your health |
| 📋 **Smart Daily Tasks** | After each report upload, personalized recovery tasks are auto-generated based on your anomalies |
| 📈 **Live Dashboard Charts** | Check off a task → your Health Score chart updates **instantly** on the screen |
| 🧠 **AI Symptom Analysis** | Describe symptoms in plain English; NER + diagnosis models identify likely conditions |
| 📅 **Medicine Reminder** | Log medicines with custom dose/time and get daily reminders |
| 📁 **Reports History** | Every analyzed report is persisted locally with its AI Health Score for easy review or deletion |
| 🧍 **User Profiles** | Supports multi-step signup with age, gender, and health goals |
| 📱 **Responsive UI** | Mobile-first dark-themed design with a collapsible sidebar |

---

## 🏗️ Project Structure

```
doctor4you/
│
├── Doctor4you frontend/        # Vanilla JS Single Page Application
│   ├── templates/
│   │   └── index.html          # App shell (single HTML entry point)
│   ├── static/
│   │   ├── css/
│   │   │   ├── variables.css   # Design tokens (colors, fonts, spacing)
│   │   │   ├── base.css        # Global resets and typography
│   │   │   ├── layout.css      # Sidebar, topbar, grid layout
│   │   │   ├── components.css  # Reusable UI components
│   │   │   ├── dashboard.css   # Dashboard-specific styles
│   │   │   ├── pages.css       # Page-specific styles
│   │   │   ├── auth.css        # Login/signup styles
│   │   │   └── landing.css     # Landing page styles
│   │   └── js/
│   │       ├── main.js         # App entry point, route registration
│   │       ├── router.js       # Hash-based SPA router
│   │       ├── sidebar.js      # Navigation layout & sidebar
│   │       ├── utils.js        # Storage helpers, formatters, generators
│   │       ├── api.js          # All fetch calls to backend
│   │       ├── auth.js         # Login & multi-step signup
│   │       ├── landing.js      # Landing page
│   │       ├── dashboard.js    # Dashboard + live chart updates
│   │       ├── tasks.js        # Daily task engine (generation + persistence)
│   │       ├── disease.js      # Disease tracking page
│   │       ├── daily-health.js # Daily health check-in
│   │       ├── medicine.js     # Medicine reminder management
│   │       ├── report-analyzer.js  # OCR upload, task generation, persistence
│   │       ├── reports.js      # Report History page
│   │       ├── profile.js      # User profile page
│   │       └── checkin.js      # Health check-in module
│   └── server.py               # Dev server (no-cache HTTP server)
│
└── health_tracker/             # FastAPI Python Backend
    ├── api.py                  # API routes (analyze, progress, analyze-report)
    ├── models/
    │   ├── ner.py              # Named Entity Recognition for symptoms
    │   ├── diagnosis.py        # Disease diagnosis engine
    │   ├── ocr_analyzer.py     # OCR extraction + lab report parsing
    │   ├── progress.py         # Health progress scoring
    │   ├── questions.py        # AI health question generation
    │   └── routine.py          # Daily routine/task suggestion engine
    └── venv/                   # Python virtual environment
```

---

## ⚙️ Prerequisites

Before running the project, install these system dependencies:

### 1. Tesseract OCR
Used to extract text from uploaded lab reports (PDFs and images).

- **Download:** https://github.com/UB-Mannheim/tesseract/wiki
- **Install to (default):** `C:\Program Files\Tesseract-OCR\`
- After install, verify: `tesseract --version`

### 2. Poppler (for PDF support)
Converts PDF pages to images before OCR processing.

- **Download:** https://github.com/oschwartz10612/poppler-windows/releases
- **Extract to any path**, e.g. `C:\poppler\Library\bin`
- Add the `bin` folder to your system **PATH** environment variable

### 3. Python 3.10+
- **Download:** https://www.python.org/downloads/

---

## 🚀 Getting Started

### Step 1 — Clone or download the project

```bash
# If using git
git clone <your-repo-url>
cd doctor4you
```

### Step 2 — Set up the Python backend

```bash
cd health_tracker

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn[standard] python-multipart pytesseract pillow pdf2image
```

> **Note:** If you use the AI symptom analysis feature, also install:
> ```bash
> pip install transformers torch
> ```

### Step 3 — Start the backend server

```bash
# From inside health_tracker/ with venv active
python -m uvicorn api:app --reload
```

Backend runs at: **http://127.0.0.1:8000**

### Step 4 — Start the frontend server

Open a **new terminal**:

```bash
cd "Doctor4you frontend"

# Use the built-in no-cache dev server
python server.py
```

Frontend runs at: **http://localhost:3000**

### Step 5 — Open in browser

Navigate to **[http://localhost:3000](http://localhost:3000)** and create your account!

---

## 🔬 How the OCR Analyzer Works

1. **Upload** a CBC / blood test report (PDF, JPG, or PNG)
2. The file is sent to the FastAPI backend (`POST /analyze-report`)
3. **Tesseract** extracts raw text; the parser strips reference ranges to isolate your actual values
4. Each parameter (e.g. Haemoglobin, Platelets, HbA1c) is compared to clinical reference ranges
5. A **Health Score (0–100)** is calculated based on how many values fall outside normal
6. Results are displayed with a color-coded table and bar chart
7. The report is **saved to localStorage** (Reports History) with its score
8. Personalized **Today's Health Tasks** are generated for your Dashboard (e.g. "Eat papaya leaf extract" for low Platelets)

---

## 📊 Dashboard & Live Progress

- The **Health Trend** line chart shows your score history over the last 7 / 30 days
- When you upload a new report, today's data point **syncs to the real AI score**
- Every time you check off a recovery task, your score **increments by +2** and the chart updates live without a page refresh

---

## 🧠 AI Symptom Analysis

Navigate to **Your Diseases** in the sidebar:

1. Type your symptoms in plain English (e.g. *"I have a fever, fatigue and joint pain"*)
2. The NER model extracts medical entities from the text
3. The diagnosis engine maps them to likely conditions with recommendations
4. A personalized care routine is generated

---

## 🗂️ API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Analyze symptoms text → returns diagnosis |
| `POST` | `/progress` | Compare Day 1 vs Today symptoms → returns progress score |
| `POST` | `/analyze-report` | Upload file → OCR extraction + health score |

---

## 💾 Data Storage

All user data is persisted in **browser localStorage** — nothing is sent to any cloud server.

| Key | Contents |
|---|---|
| `healthvault_user` | User profile (name, email, age, gender) |
| `healthvault_reports` | All uploaded + analyzed lab reports with scores |
| `healthvault_last_diagnosis` | Most recent diagnosis for task generation |
| `healthvault_tasks_YYYY-MM-DD` | Daily task checklist per day |
| `healthvault_health_data` | Health score time series for charts |
| `healthvault_medicines` | Medicine reminders |

---

## 🛠️ Tech Stack

### Frontend
- **HTML5 / Vanilla JS** — ES6 modules, hash-based SPA routing
- **CSS3** — custom design tokens, glassmorphism, CSS variables
- **Chart.js** — interactive health trend charts
- **Font Awesome** — icon library

### Backend
- **FastAPI** — lightweight, async Python web framework
- **Pytesseract** — Python wrapper for Tesseract OCR
- **Pillow** — image processing
- **pdf2image** — PDF to image conversion via Poppler
- **Transformers** (optional) — HuggingFace NER + NLI models for symptom analysis

---

## 🐛 Troubleshooting

### OCR says "100% healthy" even for unhealthy reports
- Make sure **Tesseract** is installed and accessible from PATH
- Make sure **Poppler** bin folder is in PATH (required for PDFs)
- Try re-uploading a clearer image/scan of the report

### Frontend changes not reflecting
- The frontend uses `server.py` which disables caching automatically
- If using the old `python -m http.server`, do a hard refresh: **`Ctrl + Shift + R`**

### Backend not starting
- Make sure the virtual environment is **activated**: `venv\Scripts\activate`
- Run from inside the `health_tracker/` directory

### CORS errors in browser console
- Ensure the backend is running on **port 8000**
- The API URL in `static/js/api.js` must be `http://127.0.0.1:8000`

---

## 📄 License

This project is for personal and educational use. Feel free to adapt it for your own health tracking needs.

---

<div align="center">
Made with ❤️ for better health monitoring · <strong>Doctor4you</strong>
</div>
