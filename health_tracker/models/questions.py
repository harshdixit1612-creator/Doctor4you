from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

_tokenizer = None
_model = None

FALLBACK_QUESTIONS = [
    "1. How long have you had these symptoms exactly?",
    "2. Have you measured your temperature? What was the reading?",
    "3. Are you experiencing any additional symptoms like cough, nausea or rash?",
    "4. Have you been in contact with anyone recently who was sick?"
]

def load_qa():
    global _tokenizer, _model
    if _model is None:
        print("[Flan-T5] Loading google/flan-t5-base...")
        _tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
        _model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
        _model.eval()
        print("[Flan-T5] Model ready.")

def _generate(prompt: str) -> str:
    inputs = _tokenizer(prompt, return_tensors="pt", max_length=256, truncation=True)
    with torch.no_grad():
        outputs = _model.generate(
            **inputs,
            max_new_tokens=150,
            num_beams=4,
            early_stopping=True
        )
    return _tokenizer.decode(outputs[0], skip_special_tokens=True)

def _parse_questions(raw: str) -> list:
    questions = []
    for part in raw.replace("\n", " ").split("."):
        part = part.strip()
        if part and len(part) > 10:
            q = part.lstrip("0123456789. ")
            q = q + "?" if not q.endswith("?") else q
            questions.append(q)
    return questions[:4]

def generate_questions(entities: dict, raw_text: str, day: int = 1) -> tuple:
    load_qa()

    feeling = "not specified"
    focus = "focus on verifying the current severity of all reported symptoms"
    fallback = FALLBACK_QUESTIONS

    # --- Only ask "how are you feeling" from Day 2 onwards ---
    if day > 1:
        print("\n  Before we verify — tell us overall:")
        print("  How are you feeling today compared to yesterday?")
        print("  (e.g. worse, same as yesterday, a little better, much better)\n")
        feeling = input("  Your answer: ").strip()
        if not feeling:
            feeling = "not specified"

        feeling_lower = feeling.lower()
        if any(w in feeling_lower for w in ["worse", "bad", "terrible", "awful", "no improvement", "not better"]):
            focus = "focus on what has gotten worse and check for any new or severe symptoms"
            fallback = [
                "Which symptom has gotten significantly worse since yesterday?",
                "Have any new symptoms appeared that were not there before?",
                "Have you been able to eat or drink anything today?",
                "Is your fever higher than it was yesterday?"
            ]
        elif any(w in feeling_lower for w in ["better", "improving", "good", "recovering", "less", "much better", "little better"]):
            focus = "focus on confirming what has improved and what symptoms still remain"
            fallback = [
                "Which symptom improved the most since yesterday?",
                "Were you able to eat a proper meal today?",
                "Is your body temperature lower than yesterday?",
                "Are you still feeling weak or is your energy coming back?"
            ]
        elif any(w in feeling_lower for w in ["same", "similar", "unchanged", "no change", "no difference"]):
            focus = "focus on why there is no change and check for any hidden or worsening symptoms"
            fallback = [
                "Is any symptom slightly better even if overall you feel the same?",
                "Are you taking medicines on time and with food?",
                "How many hours of sleep did you get last night?",
                "Have you been drinking enough water and ORS today?"
            ]

    # --- Generate questions from model ---
    symptoms = ", ".join(entities.get("symptoms", [])) or raw_text[:100]
    prompt = (
        f"You are a doctor. A patient has: {symptoms}. "
        f"They feel: '{feeling}'. "
        f"Write 4 specific medical questions to verify their condition. "
        f"{focus}. Number them 1 to 4."
    )

    try:
        raw_output = _generate(prompt)
        parsed = _parse_questions(raw_output)
        if len(parsed) < 2:
            raise ValueError("Too few questions")
        questions_list = [f"{i+1}. {q}" for i, q in enumerate(parsed[:4])]
    except Exception as e:
        print(f"  [Flan-T5] Using smart fallback ({e})")
        questions_list = [f"{i+1}. {q}" for i, q in enumerate(fallback)]

    # --- Ask questions and collect answers ---
    print("\n  Please answer these verification questions:\n")
    answers = {}
    from colorama import Fore, Style
    for q in questions_list:
        print(f"  {Fore.CYAN}{q}{Style.RESET_ALL}")
        ans = input("  Your answer: ").strip()
        answers[q] = ans if ans else "no answer"
        print()

    return questions_list, answers