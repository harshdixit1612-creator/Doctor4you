import json, os, sys
from colorama import Fore, Style, init
from models.ner       import extract_entities
from models.diagnosis import get_diagnosis
from models.questions import generate_questions
from models.progress  import score_progress
from models.routine   import generate_routine

init(autoreset=True)
LOG_FILE = "storage/patient_log.json"

def load_log():
    if not os.path.exists(LOG_FILE):
        return {}
    with open(LOG_FILE) as f:
        content = f.read().strip()
        if not content:
            return {}
        return json.loads(content)

def save_log(log):
    with open(LOG_FILE, "w") as f:
        json.dump(log, f, indent=2)

def banner(text, color=Fore.CYAN):
    print(f"\n{color}{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}{Style.RESET_ALL}")

def section(title, color=Fore.YELLOW):
    print(f"\n{color}[ {title} ]{Style.RESET_ALL}")

def run():
    log = load_log()
    day = len(log) + 1

    if day > 3:
        prog = log.get("day_3", {}).get("progress", {})
        score = prog.get("score", 0)
        if score >= 70:
            print(Fore.GREEN + "\n✓ Patient has recovered (score >= 70%). Tracking complete.")
        else:
            print(Fore.RED + "\n! 3 days tracked. Please see a doctor if not recovered.")
        return

    banner(f"HEALTH TRACKER — DAY {day}", Fore.CYAN)
    print(Fore.WHITE + "Type your symptoms below (press Enter twice when done):\n")

    lines = []
    while True:
        line = input()
        if line == "":
            if lines:
                break
        else:
            lines.append(line)
    user_input = " ".join(lines)

    if not user_input.strip():
        print(Fore.RED + "No input provided. Exiting.")
        return

    # --- Model 1: NER ---
    section("Model 1 — HUMADEX NER: Extracting entities", Fore.MAGENTA)
    entities = extract_entities(user_input)
    print(f"  Symptoms   : {', '.join(entities['symptoms']) or 'none detected'}")
    print(f"  Body parts : {', '.join(entities['body_parts']) or 'none detected'}")
    print(f"  Medications: {', '.join(entities['medications']) or 'none mentioned'}")
    print(f"  Diseases   : {', '.join(entities['diseases']) or 'none mentioned'}")

    # --- Model 2: Diagnosis ---
    section("Model 2 — ClinicalBERT: Diagnosis & Medicine", Fore.GREEN)
    diagnosis = get_diagnosis(entities, user_input)
    print(f"  Condition  : {Fore.WHITE}{diagnosis['condition']}{Style.RESET_ALL}")
    print(f"\n  Medicines  : ({len(diagnosis['medicines'])} total — covering all your symptoms)")
    for i, m in enumerate(diagnosis["medicines"], 1):
        print(f"\n  {i}. {Fore.CYAN}{m['name']}{Style.RESET_ALL}")
        print(f"     Reason : {m['reason']}")
        print(f"     Dose   : {m['dose']}")
    print(f"\n  Diet today : {', '.join(diagnosis.get('diet', []))}")
    print(f"  Avoid      : {', '.join(diagnosis.get('avoid', []))}")
    print(f"  Activity   : {diagnosis.get('activity', 'rest')}")
    print(f"\n  {Fore.RED}Warning    :{Style.RESET_ALL}")
    for w in diagnosis['warning'].split('\n'):
        print(f"  {Fore.RED}{w}{Style.RESET_ALL}")
    print(f"\n  {Fore.YELLOW}Disclaimer : AI simulation only — NOT real medical advice.{Style.RESET_ALL}")

    # --- Model 3: Questions ---
    section("Model 3 — Flan-T5: Verification Questions", Fore.BLUE)
    questions, answers = generate_questions(entities, user_input, day)

    # --- Model 4: Progress ---
    section("Model 4 — NLI Scorer: Health Progress", Fore.MAGENTA)
    day1_text = log.get("day_1", {}).get("input", "")
    progress = score_progress(day1_text, user_input)
    print(f"  Recovery score : {Fore.GREEN}{progress['score']}%{Style.RESET_ALL}")
    print(f"  Trend          : {progress['trend']}")
    print(f"  Detail         : {progress['summary']}")

    bar_filled = int(progress['score'] / 5)
    bar = "█" * bar_filled + "░" * (20 - bar_filled)
    print(f"  [{bar}] {progress['score']}%")

    if progress['score'] >= 70:
        print(Fore.GREEN + "\n  ✓ Recovery target reached (70%+)!")

    # --- Routine ---
    section("Daily Routine — Day " + str(day), Fore.YELLOW)
    routine = generate_routine(diagnosis, day)
    print(f"  {'Time':<12} {'Activity':<40} Note")
    print(f"  {'-'*80}")
    for time, activity, note in routine:
        print(f"  {Fore.CYAN}{time:<12}{Style.RESET_ALL} {activity:<40} {Fore.WHITE}{note}{Style.RESET_ALL}")

    # Save to log
    log[f"day_{day}"] = {
        "input": user_input,
        "entities": entities,
        "diagnosis": diagnosis,
        "answers": answers,
        "progress": progress
    }
    save_log(log)

    print(f"\n{Fore.GREEN}✓ Day {day} saved. Run main.py again tomorrow for Day {day+1}.{Style.RESET_ALL}\n")

if __name__ == "__main__":
    run()