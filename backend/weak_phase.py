import json
import os
import re
from typing import Any, Dict, List

from dotenv import load_dotenv
from google import genai

load_dotenv()

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "evidence.json")
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=API_KEY)


def load_evidence() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        raw = f.read().strip()
        if not raw:
            return []
        return json.loads(raw)


def extract_json_block(text: str) -> Dict[str, Any]:
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    fenced = re.search(r"```json\s*(\{.*\})\s*```", text, re.DOTALL)
    if fenced:
        return json.loads(fenced.group(1))

    obj_match = re.search(r"(\{.*\})", text, re.DOTALL)
    if obj_match:
        return json.loads(obj_match.group(1))

    raise ValueError("Could not parse JSON from model response")


def build_weak_phase_prompt(company: str, evidence_rows: List[Dict[str, Any]]) -> str:
    evidence_text = json.dumps(evidence_rows, indent=2)

    return f"""
You are a fintech competitive risk analyst.

You are given structured public evidence about {company} in India's fintech lending / digital credit / BNPL market.

Your task:
Predict whether {company} may be entering a weak phase.

A weak phase means potential vulnerability caused by:
- rising complaints
- trust deterioration
- support issues
- collection backlash
- regulatory pressure
- risky expansion
- mismatch between product promises and customer experience

Important:
- This is a risk prediction, not a fact.
- Use only the provided evidence.
- Do not invent numbers or hidden facts.
- Be clear and strategic.

Return ONLY valid JSON in this format:

{{
  "company": "{company}",
  "weak_phase_risk": "Low / Medium / High",
  "confidence": 0.0,
  "summary": "short conclusion",
  "warning_signals": [
    "signal 1",
    "signal 2",
    "signal 3"
  ],
  "reasoning": [
    "reason 1",
    "reason 2",
    "reason 3"
  ],
  "strategic_opportunity": "how a competitor could take advantage of this weak phase"
}}

Evidence:
{evidence_text}
"""


def predict_weak_phase(company: str) -> Dict[str, Any]:
    evidence = load_evidence()
    company_rows = [row for row in evidence if row.get("company", "").lower() == company.lower()]

    if not company_rows:
        return {
            "status": "error",
            "message": f"No evidence found for company: {company}"
        }

    prompt = build_weak_phase_prompt(company, company_rows)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    raw_text = (response.text or "").strip()
    print(f"\\n===== WEAK PHASE RAW RESPONSE FOR {company} =====")
    print(raw_text)
    print("================================================\\n")

    parsed = extract_json_block(raw_text)
    return {
        "status": "ok",
        "weak_phase_prediction": parsed
    }