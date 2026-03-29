DISEASE_PROFILES = {
    "viral_fever": {
        "keywords": ["fever", "hot", "burning", "temperature", "chills", "shiver", "sweating"],
        "condition": "Viral Fever / Influenza",
        "medicines": [
            {"name": "Paracetamol 650mg",     "reason": "Reduces fever and relieves body pain",         "dose": "Every 6-8 hrs after food. Max 4 doses/day"},
            {"name": "ORS Sachet (Electral)",  "reason": "Replenishes electrolytes lost from sweating",  "dose": "1 sachet in 1L water, sip throughout day"},
            {"name": "Ibuprofen 400mg",        "reason": "Anti-inflammatory for chills and body ache",   "dose": "Every 8 hrs strictly after food"},
            {"name": "Vitamin C 500mg",        "reason": "Boosts immune response against viral load",    "dose": "Once daily after breakfast"},
        ],
        "diet": ["warm khichdi", "dal soup", "coconut water", "warm turmeric milk", "boiled vegetables"],
        "avoid": ["cold drinks", "oily food", "outside food", "dairy products"],
        "warning": "Seek doctor if fever exceeds 103F / 39.4C or lasts more than 3 days",
        "activity": "complete bed rest"
    },

    "headache_migraine": {
        "keywords": ["headache", "head pain", "migraine", "head hurts", "heaviness in head", "dizzy", "dizziness"],
        "condition": "Tension Headache / Migraine",
        "medicines": [
            {"name": "Paracetamol 500mg",      "reason": "First line relief for tension headache",       "dose": "Every 6 hrs, not more than 3 doses/day"},
            {"name": "Ibuprofen 400mg",        "reason": "Reduces inflammation causing head pressure",   "dose": "Once after food if paracetamol insufficient"},
            {"name": "Domperidone 10mg",       "reason": "If headache is accompanied by nausea",         "dose": "30 min before meals, max 3 times/day"},
            {"name": "ORS / Electrolyte drink","reason": "Dehydration is a common migraine trigger",     "dose": "2-3 glasses spread across the day"},
        ],
        "diet": ["light toast", "banana", "ginger tea", "plain rice", "watermelon"],
        "avoid": ["caffeine", "chocolate", "strong smells", "bright screens", "alcohol"],
        "warning": "Seek immediate care if headache is sudden and severe (thunderclap) or with vision loss",
        "activity": "rest in dark quiet room, no screen time"
    },

    "cold_flu": {
        "keywords": ["cold", "runny nose", "stuffy nose", "sneezing", "congestion", "blocked nose", "sore throat", "throat pain", "swallowing"],
        "condition": "Common Cold / Upper Respiratory Infection",
        "medicines": [
            {"name": "Cetirizine 10mg",        "reason": "Antihistamine for runny nose and sneezing",    "dose": "Once at night before sleep"},
            {"name": "Strepsils lozenges",     "reason": "Soothes sore throat and reduces irritation",   "dose": "1 lozenge every 3-4 hrs, max 5/day"},
            {"name": "Steam inhalation",       "reason": "Clears nasal congestion naturally",             "dose": "Twice daily — morning and before bed, 10 min each"},
            {"name": "Paracetamol 500mg",      "reason": "For associated mild fever or throat pain",      "dose": "Every 6-8 hrs only if needed"},
        ],
        "diet": ["warm soup", "honey lemon water", "ginger tea", "warm broth", "soft foods"],
        "avoid": ["cold water", "ice cream", "cold beverages", "air conditioning directly"],
        "warning": "See doctor if throat becomes severely painful, white patches appear, or breathing is difficult",
        "activity": "light rest, avoid going out in cold air"
    },

    "gastro": {
        "keywords": ["vomiting", "nausea", "diarrhea", "loose motion", "stomach pain", "stomach ache", "acidity", "bloating", "indigestion", "not eating", "no appetite", "loss of appetite"],
        "condition": "Gastroenteritis / Digestive Upset",
        "medicines": [
            {"name": "ORS Sachet (Electral)",  "reason": "Critical — prevents dehydration from vomiting/diarrhea", "dose": "Sip slowly every 15-20 min throughout day"},
            {"name": "Domperidone 10mg",       "reason": "Controls nausea and vomiting reflex",          "dose": "30 min before meals, 3 times daily"},
            {"name": "Zinc 20mg tablet",       "reason": "Speeds up gut recovery in diarrhea",           "dose": "Once daily for 10-14 days"},
            {"name": "Probiotics (Darolac)",   "reason": "Restores good gut bacteria balance",           "dose": "Once daily after any meal"},
        ],
        "diet": ["BRAT diet (banana, rice, apple, toast)", "plain boiled rice", "clear soup", "coconut water", "sips of plain water"],
        "avoid": ["dairy", "spicy food", "oily food", "raw vegetables", "fruit juice", "caffeine"],
        "warning": "Seek doctor if vomiting persists more than 24 hrs, blood in stool, or signs of severe dehydration",
        "activity": "complete rest, do not travel or exert"
    },

    "body_ache": {
        "keywords": ["body ache", "body pain", "muscle pain", "joint pain", "weakness", "fatigue", "tired", "exhausted", "weak", "lying down"],
        "condition": "Viral Myalgia / Generalized Body Pain",
        "medicines": [
            {"name": "Ibuprofen 400mg",        "reason": "Best anti-inflammatory for muscle and joint pain", "dose": "Every 8 hrs strictly after food"},
            {"name": "Paracetamol 650mg",      "reason": "Additional pain and fever relief",               "dose": "Every 6-8 hrs if ibuprofen not enough"},
            {"name": "Magnesium supplement",   "reason": "Muscle cramp and fatigue recovery",              "dose": "Once daily at night"},
            {"name": "ORS / Electrolyte drink","reason": "Weakness often caused by electrolyte loss",      "dose": "2-3 times across the day"},
        ],
        "diet": ["protein rich dal", "eggs if tolerated", "banana", "sweet potato", "warm milk at night"],
        "avoid": ["strenuous activity", "cold water bathing", "skipping meals"],
        "warning": "Seek doctor if weakness is extreme, you cannot walk, or pain is localised and worsening",
        "activity": "bed rest with gentle stretching every 2 hours"
    },

    "respiratory": {
        "keywords": ["cough", "dry cough", "wet cough", "chest pain", "breathless", "breathing", "wheezing", "phlegm", "mucus"],
        "condition": "Respiratory Tract Infection / Bronchitis",
        "medicines": [
            {"name": "Dextromethorphan syrup", "reason": "Suppresses dry cough reflex",                   "dose": "10ml every 6-8 hrs after food"},
            {"name": "Ambroxol syrup",         "reason": "Loosens thick mucus for wet cough",             "dose": "10ml 3 times daily after food"},
            {"name": "Steam inhalation",       "reason": "Clears airways and reduces chest tightness",    "dose": "Morning and night, 10-15 min each"},
            {"name": "Honey + warm water",     "reason": "Natural soothing agent for irritated throat",   "dose": "1 tsp honey in warm water, 2-3 times daily"},
        ],
        "diet": ["warm soup", "ginger honey tea", "tulsi tea", "warm water with turmeric", "light meals"],
        "avoid": ["cold drinks", "dust exposure", "smoking area", "air conditioning"],
        "warning": "Seek immediate care if breathing difficulty, chest pain, or coughing blood occurs",
        "activity": "rest, avoid cold air, sleep with head slightly elevated"
    },
}

def _match_profile(entities: dict, raw_text: str) -> list:
    text_lower = raw_text.lower()
    all_symptoms = " ".join(
        entities.get("symptoms", []) +
        entities.get("diseases", []) +
        entities.get("body_parts", [])
    ).lower() + " " + text_lower

    scores = {}
    for profile_key, profile in DISEASE_PROFILES.items():
        score = sum(1 for kw in profile["keywords"] if kw in all_symptoms)
        if score > 0:
            scores[profile_key] = score

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return ranked


def get_diagnosis(entities: dict, raw_text: str) -> dict:
    ranked = _match_profile(entities, raw_text)

    print(f"\n  [DEBUG] Profiles matched:")
    for k, s in ranked:
        print(f"    → {k} (score: {s})")

    if not ranked:
        return {
            "condition": "General Viral Illness",
            "matched_profiles": [],
            "medicines": [
                {"name": "Paracetamol 650mg",  "reason": "General fever and pain relief", "dose": "Every 6-8 hrs after food"},
                {"name": "ORS Sachet",          "reason": "Stay hydrated",                 "dose": "2 sachets across the day"},
                {"name": "Vitamin C 500mg",     "reason": "Immune support",                "dose": "Once daily"},
            ],
            "diet":   ["light khichdi", "warm soup", "coconut water"],
            "avoid":  ["oily food", "cold drinks"],
            "warning": "Consult a doctor if symptoms worsen or persist beyond 3 days",
            "activity": "bed rest",
        }

    # --- Take ALL matched profiles, not just top 2 ---
    all_matched_keys     = [k for k, s in ranked]          # every profile that scored > 0
    all_matched_profiles = [DISEASE_PROFILES[k] for k in all_matched_keys]

    # --- Build condition name from ALL matches ---
    condition = " + ".join(p["condition"] for p in all_matched_profiles)

    # --- Merge medicines across ALL profiles (deduplicate by name) ---
    seen_meds = set()
    merged_meds = []
    for p in all_matched_profiles:
        for m in p["medicines"]:
            if m["name"] not in seen_meds:
                merged_meds.append(m)
                seen_meds.add(m["name"])

    # --- Merge diet across ALL profiles (deduplicate) ---
    merged_diet = list(dict.fromkeys(
        item for p in all_matched_profiles for item in p["diet"]
    ))

    # --- Merge avoid across ALL profiles (deduplicate) ---
    merged_avoid = list(dict.fromkeys(
        item for p in all_matched_profiles for item in p["avoid"]
    ))

    # --- Merge warnings across ALL profiles ---
    merged_warning = "\n    ! ".join(p["warning"] for p in all_matched_profiles)

    # --- Merge activity across ALL profiles ---
    merged_activity = " | ".join(
        dict.fromkeys(p["activity"] for p in all_matched_profiles)
    )

    return {
        "condition":        condition,
        "matched_profiles": all_matched_keys,
        "medicines":        merged_meds,        # ALL medicines, no cap
        "diet":             merged_diet[:6],    # top 6 diet items
        "avoid":            merged_avoid[:6],   # top 6 avoid items
        "warning":          merged_warning,
        "activity":         merged_activity,
    }