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


def build_simulation_prompt(company: str, proposed_action: str, evidence_rows: List[Dict[str, Any]]) -> str:
    evidence_text = json.dumps(evidence_rows, indent=2)

    return f"""
You are a fintech competitive intelligence simulation engine.

A company is considering this action:
"{proposed_action}"

Use the evidence below from competitors in India's fintech lending / digital credit / BNPL space.

Your job:
Simulate the likely outcome if {company} takes this action.

Rules:
- This is an evidence-backed simulation, not a guaranteed fact.
- Use only the provided evidence.
- Infer from similar patterns, signals, complaints, expansions, or shifts.
- Do not invent exact profit or market-share numbers.
- Keep the answer strategic and realistic.

Return ONLY valid JSON in this exact structure:

{{
  "company": "{company}",
  "proposed_action": "{proposed_action}",
  "likely_outcome": "short outcome summary",
  "recommendation": "Proceed / Proceed cautiously / Refrain",
  "risk_level": "Low / Medium / High",
  "reasoning": [
    "reason 1",
    "reason 2",
    "reason 3"
  ],
  "historical_analogs": [
    "example pattern 1",
    "example pattern 2"
  ],
  "suggested_adjustment": "how to improve or de-risk the move"
}}

Evidence:
{evidence_text}
"""


def simulate_decision(company: str, proposed_action: str) -> Dict[str, Any]:
    evidence = load_evidence()

    if not evidence:
        return {
            "status": "error",
            "message": "No evidence found."
        }

    prompt = build_simulation_prompt(company, proposed_action, evidence)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    raw_text = (response.text or "").strip()
    print(f"\n===== DECISION SIMULATION RAW RESPONSE =====")
    print(raw_text)
    print("===========================================\n")

    parsed = extract_json_block(raw_text)
    return {
        "status": "ok",
        "simulation": parsed
    }