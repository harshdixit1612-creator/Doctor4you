# Offline keyword-based entity extractor
# (Replaces heavy Hugging Face model — diagnosis.py already handles keyword matching)

SYMPTOM_KEYWORDS = [
    "fever", "cough", "cold", "headache", "nausea", "vomiting", "diarrhea",
    "fatigue", "weakness", "body ache", "body pain", "sore throat", "runny nose",
    "chills", "sweating", "dizziness", "bloating", "acidity", "indigestion",
    "breathless", "wheezing", "chest pain", "muscle pain", "joint pain",
    "loss of appetite", "loose motion", "stomach pain", "migraine", "sneezing",
    "congestion", "throat pain", "phlegm", "mucus", "temperature",
]

BODY_PART_KEYWORDS = [
    "head", "chest", "stomach", "throat", "nose", "lungs", "muscles",
    "joints", "back", "abdomen", "ears", "eyes",
]

DISEASE_KEYWORDS = [
    "flu", "influenza", "covid", "dengue", "malaria", "typhoid",
    "pneumonia", "bronchitis", "gastroenteritis",
]


def extract_entities(text: str) -> dict:
    text_lower = text.lower()
    entities = {"symptoms": [], "body_parts": [], "medications": [], "diseases": []}

    for kw in SYMPTOM_KEYWORDS:
        if kw in text_lower and kw not in entities["symptoms"]:
            entities["symptoms"].append(kw)

    for kw in BODY_PART_KEYWORDS:
        if kw in text_lower and kw not in entities["body_parts"]:
            entities["body_parts"].append(kw)

    for kw in DISEASE_KEYWORDS:
        if kw in text_lower and kw not in entities["diseases"]:
            entities["diseases"].append(kw)

    return entities