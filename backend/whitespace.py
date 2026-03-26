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


def build_whitespace_prompt(evidence_rows: List[Dict[str, Any]]) -> str:
    evidence_text = json.dumps(evidence_rows, indent=2)

    return f"""
You are a fintech whitespace opportunity analyst.

You are given structured public evidence across competitors in India's fintech lending / digital credit / BNPL market.

Your task:
Identify whitespace opportunities and underserved market zones.

You must do 3 things:
1. Signal frequency analysis
2. Market zone detection
3. Opportunity recommendation

Interpret whitespace as:
- repeated customer pain points that competitors are not solving well
- overcrowded themes where many players compete in the same way
- underserved segments where demand exists but trust, clarity, support, or differentiation are weak
- low-competition strategic zones a new entrant could own

Important:
- Use only the provided evidence.
- Do not invent private market data.
- Do not invent exact revenue or market share numbers.
- Be strategic and actionable.

Return ONLY valid JSON in this exact format:

{{
  "signal_frequency_analysis": {{
    "repeated_negative_signals": [
      "signal 1",
      "signal 2"
    ],
    "repeated_positive_signals": [
      "signal 1",
      "signal 2"
    ],
    "crowded_themes": [
      "theme 1",
      "theme 2"
    ]
  }},
  "market_zone_detection": {{
    "underserved_segments": [
      "segment 1",
      "segment 2"
    ],
    "low_competition_zones": [
      "zone 1",
      "zone 2"
    ],
    "high_risk_zones": [
      "zone 1",
      "zone 2"
    ]
  }},
  "opportunity_recommendation": [
    {{
      "opportunity": "clear opportunity title",
      "why_it_matters": "short explanation",
      "recommended_positioning": "how a new player should position",
      "confidence": 0.0
    }}
  ]
}}

Evidence:
{evidence_text}
"""


def map_whitespace() -> Dict[str, Any]:
    evidence = load_evidence()

    if not evidence:
        return {
            "status": "error",
            "message": "No evidence found."
        }

    # Optional: only use validated rows if available
    usable_rows = [
        row for row in evidence
        if row.get("verification_status") in (None, "verified", "weak")
    ]

    prompt = build_whitespace_prompt(usable_rows)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    raw_text = (response.text or "").strip()
    print("\\n===== WHITESPACE RAW RESPONSE =====")
    print(raw_text)
    print("==================================\\n")

    parsed = extract_json_block(raw_text)

    return {
        "status": "ok",
        "whitespace_map": parsed
    }