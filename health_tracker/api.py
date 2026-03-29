from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
import tempfile

# 🔥 CREATE app FIRST
app = FastAPI()

# CORS (keep this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 PATH SETUP
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🔥 MOUNT STATIC
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "../Doctor4you frontend/static")),
    name="static"
)

# 🔥 SERVE FRONTEND
@app.get("/")
def serve_frontend():
    return FileResponse(
        os.path.join(BASE_DIR, "../Doctor4you frontend/templates/index.html")
    )

# ─── AI Models ────────────────────────────────────────────────────────────────

class TextInput(BaseModel):
    text: str

class ProgressInput(BaseModel):
    day1: str
    today: str

@app.post("/analyze")
def analyze(data: TextInput):
    from models.ner import extract_entities
    from models.diagnosis import get_diagnosis
    entities = extract_entities(data.text)
    diagnosis = get_diagnosis(entities, data.text)
    return {
        "entities": entities,
        "diagnosis": diagnosis
    }

@app.post("/progress")
def progress(data: ProgressInput):
    from models.progress import score_progress
    return score_progress(data.day1, data.today)

@app.post("/analyze-report")
async def analyze_report_endpoint(file: UploadFile = File(...)):
    from models.ocr_analyzer import analyze_report
    # Save the file temporarily
    suffix = os.path.splitext(file.filename)[1]
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        shutil.copyfileobj(file.file, temp_file)
        temp_file.close() # Close to ensure flushing
        
        # Analyze it
        result = analyze_report(temp_file.name)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)