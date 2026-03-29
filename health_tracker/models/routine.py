from datetime import datetime

ROUTINE_TEMPLATES = {
    "viral_fever": [
        ("7:00 AM",  "Wake up + check temperature with thermometer",       "Record the reading to track progress"),
        ("7:30 AM",  "Take {med1} with half glass of warm water",          "Never take on completely empty stomach"),
        ("8:00 AM",  "Light breakfast — {diet1} or {diet2}",               "Eat even if no appetite — medicine needs food"),
        ("10:30 AM", "Drink ORS / coconut water (1 full glass)",           "Sweating from fever causes electrolyte loss"),
        ("1:00 PM",  "Light lunch — {diet3}",                              "Small portion, easy to digest"),
        ("1:30 PM",  "Take {med2} if fever is still present",              "Skip if temperature is below 99F"),
        ("3:00 PM",  "Rest in bed — no phone or screen",                   "Sleep if possible, body heals fastest during rest"),
        ("5:30 PM",  "Warm turmeric milk or ginger tea",                   "Natural anti-inflammatory — very helpful"),
        ("7:30 PM",  "Light dinner — {diet1} or soup",                     "Avoid heavy dinner, digestion is slow during fever"),
        ("9:00 PM",  "Take {med1} if fever returns at night",              "Fever often spikes at night — be prepared"),
        ("9:30 PM",  "Sleep early — 9 to 10 hours target",                 "Deep sleep is when immune system works hardest"),
    ],
    "headache_migraine": [
        ("7:00 AM",  "Wake up slowly — do not get up abruptly",           "Sudden movement worsens headache and dizziness"),
        ("7:30 AM",  "Drink 2 glasses of water before anything else",      "Dehydration is a top migraine trigger"),
        ("8:00 AM",  "Light breakfast — {diet1} or {diet2}",               "Empty stomach worsens headache"),
        ("8:30 AM",  "Take {med1} with water",                             "Take at first sign of pain, not when severe"),
        ("10:00 AM", "Cold or warm compress on forehead for 15 min",       "Cold for throbbing pain, warm for tension pain"),
        ("12:00 PM", "Rest in a dark, quiet room",                         "Avoid bright light and loud sounds completely"),
        ("1:00 PM",  "Light lunch — {diet2} or {diet3}",                   "Avoid skipping meals even if not hungry"),
        ("3:00 PM",  "Drink electrolyte water or ORS",                     "Keeps blood pressure and hydration stable"),
        ("5:00 PM",  "10 min gentle neck and shoulder stretches",          "Only if headache is mild — stop if it worsens"),
        ("7:30 PM",  "Light dinner — avoid caffeine and chocolate",        "Both are known migraine triggers"),
        ("9:00 PM",  "Sleep in dark room — no screens 1 hr before bed",   "Screen light delays recovery significantly"),
    ],
    "cold_flu": [
        ("7:00 AM",  "Steam inhalation — 10 minutes",                      "Opens blocked nasal passages immediately"),
        ("7:30 AM",  "Honey + lemon in warm water (1 glass)",              "Soothes throat and boosts immunity"),
        ("8:00 AM",  "Light breakfast — {diet1} or {diet2}",               "Warm foods only, no cold items"),
        ("8:30 AM",  "Take {med1} if throat pain or mild fever present",   "Do not take if no fever or pain"),
        ("11:00 AM", "Warm soup or ginger tea",                            "Keeps throat moist and warm"),
        ("1:00 PM",  "Light lunch — {diet3}",                              "Warm foods, nothing from fridge"),
        ("3:00 PM",  "Gargle with warm salt water for 2 minutes",         "Kills bacteria in throat, very effective"),
        ("5:00 PM",  "Take {med2} — Strepsils or throat lozenge",         "Reduces throat irritation"),
        ("7:30 PM",  "Light warm dinner",                                  "Avoid cold beverages with dinner"),
        ("9:00 PM",  "Steam inhalation again before bed",                  "Prevents congestion from worsening at night"),
        ("9:30 PM",  "Take Cetirizine 10mg and sleep",                    "Antihistamine works best overnight"),
    ],
    "gastro": [
        ("7:00 AM",  "Start with small sips of ORS — do not rush",        "Rapid drinking worsens nausea"),
        ("8:00 AM",  "Plain toast or banana only if not nauseous",         "BRAT diet is safest for upset stomach"),
        ("9:00 AM",  "Take {med1} (Domperidone) before eating anything",  "Take 30 min before any food"),
        ("11:00 AM", "Continue ORS sips every 20 minutes",                 "Dehydration is the main danger here"),
        ("1:00 PM",  "Plain boiled rice or khichdi — very small portion",  "No spices, no oil, no dal initially"),
        ("3:00 PM",  "Take Probiotic (Darolac) capsule",                   "Restores good gut bacteria"),
        ("5:00 PM",  "Coconut water or plain water — keep sipping",        "No fruit juice — too acidic for gut"),
        ("7:00 PM",  "Light dinner — plain rice or toast",                 "Do not experiment with food today"),
        ("9:00 PM",  "Rest completely — no physical activity",             "Body needs all energy for gut recovery"),
        ("9:30 PM",  "Sleep on left side if nauseous",                    "Left side sleeping reduces acid reflux"),
    ],
    "body_ache": [
        ("7:00 AM",  "Wake up slowly — gentle stretches in bed first",    "Sudden movement causes sharp muscle pain"),
        ("7:30 AM",  "Take {med1} with warm water",                        "Anti-inflammatory works best on empty stomach with small snack"),
        ("8:00 AM",  "Warm breakfast — {diet1} or eggs if tolerated",     "Protein helps muscle repair"),
        ("10:00 AM", "Warm compress on most painful areas — 15 min",      "Increases blood flow and reduces stiffness"),
        ("12:00 PM", "Drink ORS or electrolyte water",                    "Muscle pain is often worsened by electrolyte loss"),
        ("1:00 PM",  "Light lunch — {diet2} with dal",                    "Protein and iron support muscle recovery"),
        ("3:00 PM",  "Rest — gentle walk of 5 min indoors only",          "Complete immobility stiffens muscles more"),
        ("5:00 PM",  "Warm bath or hot water foot soak",                  "Relieves deep muscle tension effectively"),
        ("7:30 PM",  "Light dinner + Magnesium supplement",               "Magnesium at night reduces overnight muscle cramps"),
        ("9:30 PM",  "Sleep with a pillow under knees if back hurts",     "Reduces spine pressure during sleep"),
    ],
    "respiratory": [
        ("7:00 AM",  "Steam inhalation — 15 minutes",                     "Loosens mucus and opens airways"),
        ("7:30 AM",  "Honey in warm water — do not skip",                 "Most effective natural cough suppressant"),
        ("8:00 AM",  "Light breakfast — {diet1}",                         "No cold items at all today"),
        ("8:30 AM",  "Take cough syrup — {med1}",                         "Take correct type: dry cough vs wet cough syrup"),
        ("11:00 AM", "Ginger tulsi tea — warm",                           "Powerful natural bronchodilator"),
        ("1:00 PM",  "Light lunch — warm soup + {diet2}",                 "Warm liquids thin mucus effectively"),
        ("3:00 PM",  "Deep breathing exercise — 10 slow breaths",         "Expands lung capacity and clears mucus"),
        ("5:00 PM",  "Steam inhalation again",                            "Second session gives maximum benefit"),
        ("7:30 PM",  "Light warm dinner — no dairy",                      "Dairy thickens mucus — avoid completely"),
        ("9:00 PM",  "Take cough syrup before sleep",                     "Prevents coughing fits at night"),
        ("9:30 PM",  "Sleep with head elevated — use 2 pillows",          "Prevents mucus from pooling in chest"),
    ],
}

DEFAULT_ROUTINE = [
    ("7:00 AM",  "Wake up and assess how you feel",                    "Note any changes from yesterday"),
    ("7:30 AM",  "Take {med1} with warm water",                        "With a light snack"),
    ("8:00 AM",  "Light breakfast — {diet1}",                          "Eat even if appetite is low"),
    ("11:00 AM", "Drink {med2} or warm fluids",                        "Stay hydrated throughout"),
    ("1:00 PM",  "Light lunch + short rest",                           "No heavy meals"),
    ("4:00 PM",  "Repeat {med1} if symptoms persist",                  "Only if needed"),
    ("7:30 PM",  "Light dinner",                                       "Easy to digest foods only"),
    ("9:30 PM",  "Sleep early — 8 to 9 hours",                         "Rest is the most important medicine"),
]

def _fill(template_str: str, diagnosis: dict) -> str:
    meds = diagnosis.get("medicines", [])
    diet = diagnosis.get("diet", [])
    replacements = {
        "{med1}":  meds[0]["name"] if len(meds) > 0 else "Paracetamol 650mg",
        "{med2}":  meds[1]["name"] if len(meds) > 1 else "ORS Sachet",
        "{med3}":  meds[2]["name"] if len(meds) > 2 else "Vitamin C 500mg",
        "{diet1}": diet[0]         if len(diet) > 0 else "khichdi",
        "{diet2}": diet[1]         if len(diet) > 1 else "warm soup",
        "{diet3}": diet[2]         if len(diet) > 2 else "plain rice",
    }
    for key, val in replacements.items():
        template_str = template_str.replace(key, val)
    return template_str

def generate_routine(diagnosis: dict, day: int) -> list:
    profiles = diagnosis.get("matched_profiles", [])

    if not profiles:
        template = DEFAULT_ROUTINE
    elif len(profiles) == 1:
        template = ROUTINE_TEMPLATES.get(profiles[0], DEFAULT_ROUTINE)
    else:
        # --- Merge routines from ALL matched profiles ---
        # Collect all time slots from all templates
        time_map = {}
        for p in profiles:
            tmpl = ROUTINE_TEMPLATES.get(p, [])
            for time, activity, note in tmpl:
                if time not in time_map:
                    # first profile to claim this slot wins
                    time_map[time] = (activity, note)
                else:
                    # slot already taken — append as extra note
                    existing_act, existing_note = time_map[time]
                    # only add if it's meaningfully different
                    if activity.lower()[:20] not in existing_act.lower():
                        time_map[time] = (
                            existing_act,
                            existing_note + f" | Also: {activity}"
                        )

        # sort by time
        def time_sort_key(t):
            try:
                h, m = t.replace(" AM","").replace(" PM","").split(":")
                h = int(h)
                m = int(m)
                if "PM" in t and h != 12:
                    h += 12
                return h * 60 + m
            except:
                return 0

        template = [
            (time, act, note)
            for time, (act, note) in sorted(time_map.items(), key=lambda x: time_sort_key(x[0]))
        ]

    # --- Day 2+ add a short walk ---
    routine = list(template)
    if day >= 2:
        # insert gentle walk only if not already present
        if not any("walk" in act.lower() for _, act, _ in routine):
            routine.append((
                "2:30 PM",
                "Short gentle walk — 10 min indoors",
                "Only if energy allows — stop if dizzy or tired"
            ))
        # re-sort after inserting
        def time_sort_key(t):
            try:
                h, m = t.replace(" AM","").replace(" PM","").split(":")
                h = int(h); m = int(m)
                if "PM" in t and h != 12: h += 12
                return h * 60 + m
            except:
                return 999
        routine = sorted(routine, key=lambda x: time_sort_key(x[0]))

    # --- Fill medicine and diet placeholders ---
    filled = []
    for time, activity, note in routine:
        filled.append((
            time,
            _fill(activity, diagnosis),
            _fill(note, diagnosis)
        ))

    return filled