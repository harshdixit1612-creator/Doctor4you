from transformers import pipeline

_nli = None

def load_nli():
    global _nli
    if _nli is None:
        print("[NLI] Loading cross-encoder/nli-MiniLM2-L6-H768...")
        _nli = pipeline(
            "text-classification",
            model="cross-encoder/nli-MiniLM2-L6-H768"
        )
        print("[NLI] Model ready.")
    return _nli

def score_progress(day1_text: str, today_text: str) -> dict:
    if not day1_text:
        return {"score": 0, "trend": "baseline", "summary": "Day 1 baseline set."}
    
    nli = load_nli()
    hypothesis = f"The patient is recovering and feeling better than before."
    premise = f"Previously: {day1_text[:200]}. Now: {today_text[:200]}"
    result = nli(f"{premise} [SEP] {hypothesis}")[0]

    label = result["label"].lower()
    conf  = result["score"]

    if "entail" in label:
        score = int(40 + conf * 60)
        trend = "improving"
    elif "neutral" in label:
        score = int(20 + conf * 20)
        trend = "same"
    else:
        score = int(conf * 20)
        trend = "worsening"

    return {
        "score": min(score, 100),
        "trend": trend,
        "summary": f"NLI confidence: {conf:.2f} | Label: {label}"
    }