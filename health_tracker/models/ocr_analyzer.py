import os
import re
import pytesseract
from PIL import Image
from pdf2image import convert_from_path

# Windows specific configurations from plan
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r'C:\Users\Harsh\Downloads\Release-24.08.0-0\poppler-24.08.0\Library\bin'

# Regex patterns for common lab values
PARAMETERS = {
    "Hemoglobin": { "pattern": r"\b(haemoglobin|hemoglobin|hb)\b", "unit": "g/dL", "normal": (12, 18) },
    "Total RBC": { "pattern": r"\b(total rbc|rbc)\b", "unit": "x10^12/l", "normal": (4.5, 6.5) },
    "MCV": { "pattern": r"\b(mcv|mean corpuscular volume)\b", "unit": "fl", "normal": (75, 95) },
    "Platelet Count": { "pattern": r"\b(platelet|plt)\b", "unit": "x10^9/l", "normal": (150, 400) },
    "WBC Count": { "pattern": r"\b(wbc|tlc|white blood)\b", "unit": "x10^9/l", "normal": (4.0, 11.0) },
    "Neutrophils": { "pattern": r"\b(neutrophils)\b", "unit": "%", "normal": (40.0, 75.0) },
    "Lymphocytes": { "pattern": r"\b(lymphocytes)\b", "unit": "%", "normal": (20.0, 50.0) },
    "Fasting Sugar": { "pattern": r"\b(fasting|fbs|sugar)\b", "unit": "mg/dL", "normal": (70, 100) },
    "Total Cholesterol": { "pattern": r"\b(cholesterol|tc)\b", "unit": "mg/dL", "normal": (0, 200) },
    "HbA1c": { "pattern": r"\bhba1c\b", "unit": "%", "normal": (4.0, 5.7) },
    "TSH": { "pattern": r"\btsh\b", "unit": "mIU/L", "normal": (0.4, 4.0) }
}

def extract_text_from_file(file_path: str) -> str:
    _, ext = os.path.splitext(file_path.lower())
    
    try:
        if ext == '.pdf':
            # Convert PDF to images
            images = convert_from_path(file_path, poppler_path=POPPLER_PATH)
            text = ""
            for img in images:
                text += pytesseract.image_to_string(img)
            return text
        elif ext in ['.png', '.jpg', '.jpeg']:
            # Read directly from image
            return pytesseract.image_to_string(Image.open(file_path))
        else:
            raise ValueError(f"Unsupported file type: {ext}")
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""

def determine_status(value: float, normal_range: tuple) -> str:
    low, high = normal_range
    if value < low:
        return "low"
    elif value > high:
        # Check for critical thresholds (just simple logic)
        if value > high * 1.5:
            return "critical"
        return "high"
    return "normal"

def extract_value_from_line(line: str) -> float:
    # Remove reference ranges e.g., "150 - 400" or "4.5-6.5"
    line_no_bounds = re.sub(r'\d+\.?\d*\s*-\s*\d+\.?\d*', '', line)
    
    # Remove scientific notation elements e.g., "x10^9" or "10^12"
    line_no_sci = re.sub(r'10\^\d+', '', line_no_bounds)
    line_no_sci = re.sub(r'x\s*10', '', line_no_sci)
    
    # Find all remaining numbers (floats or ints)
    numbers = re.findall(r'\b\d+\.\d+\b|\b\d+\b', line_no_sci)
    
    # Exclude dates/years like 2021
    numbers = [n for n in numbers if not (len(n) == 4 and n.startswith('202'))]
    
    if numbers:
        # The last number is typically the patient result
        return float(numbers[-1])
    return None

def analyze_report(file_path: str) -> dict:
    text = extract_text_from_file(file_path)
    if not text:
        return {
            "success": False,
            "error": "Failed to extract text from the document. Please ensure it's a clear image or PDF."
        }
        
    extracted_params = []
    found_keys = set()
    
    score = 100
    abnormal_count = 0
    
    lines = text.lower().split('\n')
    
    for line in lines:
        for name, config in PARAMETERS.items():
            if name in found_keys:
                continue
                
            match = re.search(config["pattern"], line)
            # Ensure it's not "abs. neutrophils" matching "neutrophils"
            if match and "abs." not in line:
                val = extract_value_from_line(line)
                if val is not None:
                    # Ignore weirdly large values (like an ID number)
                    if val > 5000:
                        continue
                        
                    status = determine_status(val, config["normal"])
                    
                    # Deduct score
                    if status == "low" or status == "high":
                        score -= 5
                        abnormal_count += 1
                    elif status == "critical":
                        score -= 15
                        abnormal_count += 1
                        
                    extracted_params.append({
                        "name": name,
                        "value": val,
                        "unit": config["unit"],
                        "status": status,
                        "normalRange": f"{config['normal'][0]} - {config['normal'][1]}"
                    })
                    found_keys.add(name)

    # Generate basic English summary
    summary = "Your health report looks good! Continue maintaining a healthy lifestyle."
    recommendations = []
    if abnormal_count > 0:
        summary = f"We detected {abnormal_count} parameters outside the normal range."
        for p in extracted_params:
            if p["status"] == "high" or p["status"] == "critical":
                recommendations.append(f"Consider discussing your high {p['name']} with a doctor.")
            elif p["status"] == "low":
                recommendations.append(f"Your {p['name']} is lower than normal. Focus on improving your diet related to this.")
    
    score = max(0, score)

    return {
        "success": True,
        "score": score,
        "parameters": extracted_params,
        "summary": summary,
        "recommendations": recommendations,
        "raw_text": text[:500] + "..." if len(text) > 500 else text
    }
