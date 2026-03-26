import uuid
import json
import os
import re
from datetime import datetime, timezone
from typing import Any, Dict, List

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# TEST WITH ONE COMPANY FIRST
COMPANIES = ["KreditBee","LazyPay","CASHe","MoneyTap"]

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
DATA_FILE = os.path.join(DATA_DIR, "evidence.json")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=API_KEY)

ALLOWED_SIGNAL_TYPES = {
    "pricing_change",
    "eligibility_change",
    "feature_launch",
    "partnership",
    "regulatory_signal",
    "positive_review_trend",
    "negative_review_trend",
    "trust_issue",
    "support_issue",
    "collection_issue",
    "messaging_shift",
    "app_update",
    "expansion_signal",
}

ALLOWED_SOURCE_TYPES = {
    "website",
    "app_store",
    "news",
    "review",
    "blog",
    "official_update",
}


def ensure_data_file() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)


def build_prompt(company: str) -> str:
    return f"""
You are a fintech market intelligence extractor.

Find recent public web-backed signals about {company} in India's fintech lending / digital credit / BNPL space.

Focus only on:
- pricing or fee complaints/changes
- lending eligibility changes
- partnerships or expansion
- app update changes
- user complaints about support, harassment, recovery, hidden charges, delays, trust
- positive or negative review trends
- messaging or positioning shifts
- regulatory or compliance mentions

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation before or after the JSON.

Use this exact structure:
{{
  "company": "{company}",
  "signals": [
    {{
      "title": "short signal title",
      "source_url": "https://example.com",
      "source_type": "news",
      "signal_type": "trust_issue",
      "summary": "short summary",
      "evidence_excerpt": "short evidence excerpt",
      "direction": "negative",
      "confidence": 0.82,
      "tags": ["trust", "complaints"]
    }}
  ]
}}

Rules:
- return exactly 2 strongest signals only
- every signal must have a source_url
- source_type must be one of: website, app_store, news, review, blog, official_update
- signal_type must be one of:
  pricing_change, eligibility_change, feature_launch, partnership, regulatory_signal,
  positive_review_trend, negative_review_trend, trust_issue, support_issue,
  collection_issue, messaging_shift, app_update, expansion_signal
- confidence must be a number between 0 and 1
"""


def load_existing() -> List[Dict[str, Any]]:
    ensure_data_file()
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            raw = f.read().strip()
            if not raw:
                return []
            data = json.loads(raw)
            return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        return []


def save_existing(rows: List[Dict[str, Any]]) -> None:
    ensure_data_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)


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


def dedupe(existing: List[Dict[str, Any]], new_rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = {
        (
            row.get("company"),
            row.get("source_url"),
            row.get("signal_type"),
            row.get("title"),
        )
        for row in existing
    }

    unique_rows = []
    for row in new_rows:
        key = (
            row.get("company"),
            row.get("source_url"),
            row.get("signal_type"),
            row.get("title"),
        )
        if key not in seen:
            seen.add(key)
            unique_rows.append(row)

    return unique_rows
def merge_or_append(existing: List[Dict[str, Any]], new_rows: List[Dict[str, Any]]) -> tuple[List[Dict[str, Any]], int]:
    inserted = 0

    existing_index = {}
    for i, row in enumerate(existing):
        key = (
            row.get("company"),
            row.get("source_url"),
            row.get("signal_type"),
            row.get("title"),
        )
        existing_index[key] = i

    for row in new_rows:
        key = (
            row.get("company"),
            row.get("source_url"),
            row.get("signal_type"),
            row.get("title"),
        )

        if key in existing_index:
            idx = existing_index[key]
            existing[idx]["last_seen_at"] = row["captured_at"]
            existing[idx]["occurrence_count"] = existing[idx].get("occurrence_count", 1) + 1
            existing[idx]["summary"] = row["summary"]
            existing[idx]["evidence_excerpt"] = row["evidence_excerpt"]
            existing[idx]["direction"] = row["direction"]
            existing[idx]["confidence"] = row["confidence"]
            existing[idx]["tags"] = row["tags"]
            existing[idx]["run_id"] = row["run_id"]
        else:
            existing.append(row)
            existing_index[key] = len(existing) - 1
            inserted += 1

    return existing, inserted
def validate_signal_fields(
    source_url: str,
    title: str,
    summary: str,
    source_type: str,
    confidence: float,
    tags: list[str],
) -> tuple[str, str, str]:
    if not source_url:
        return "rejected", "missing source_url", "low"

    if not source_url.startswith("http"):
        return "rejected", "invalid source_url", "low"

    if not title or len(title.strip()) < 8:
        return "rejected", "title too short or missing", "low"

    if not summary or len(summary.strip()) < 20:
        return "rejected", "summary too short or missing", "low"

    if source_type not in ALLOWED_SOURCE_TYPES:
        return "weak", "unexpected source_type", "medium"

    if confidence < 0.60:
        return "weak", "low confidence score", "medium"

    if not tags or len(tags) == 0:
        return "weak", "missing tags", "medium"

    return "verified", "basic validation passed", "high"

def normalize_signal(company: str, prompt: str, signal: Dict[str, Any]) -> Dict[str, Any] | None:
    source_url = (signal.get("source_url") or "").strip()
    title = (signal.get("title") or "").strip()
    source_type = (signal.get("source_type") or "").strip()
    signal_type = (signal.get("signal_type") or "").strip()
    summary = (signal.get("summary") or "").strip()
    evidence_excerpt = (signal.get("evidence_excerpt") or "").strip()
    direction = (signal.get("direction") or "").strip().lower()
    confidence = signal.get("confidence")
    tags = signal.get("tags") or []

    if not source_url or not title or not summary:
        return None

    if source_type not in ALLOWED_SOURCE_TYPES:
        source_type = "news"

    if signal_type not in ALLOWED_SIGNAL_TYPES:
        signal_type = "messaging_shift"

    if direction not in {"positive", "negative", "neutral", "mixed"}:
        direction = "neutral"

    try:
        confidence = float(confidence)
    except (TypeError, ValueError):
        confidence = 0.5

    confidence = max(0.0, min(1.0, confidence))

    if not isinstance(tags, list):
        tags = []
    tags = [str(tag).strip() for tag in tags if str(tag).strip()]
    verification_status, verification_reason, signal_strength = validate_signal_fields(
        source_url=source_url,
        title=title,
        summary=summary,
        source_type=source_type,
        confidence=confidence,
        tags=tags,
    )
    now_ts = datetime.now(timezone.utc).isoformat()

    return {
        "company": company,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "search_query": prompt,
        "title": title,
        "source_url": source_url,
        "source_type": source_type,
        "signal_type": signal_type,
        "summary": summary,
        "evidence_excerpt": evidence_excerpt,
        "direction": direction,
        "confidence": confidence,
        "tags": tags,
        "verification_status": verification_status,
        "verification_reason": verification_reason,
        "signal_strength": signal_strength,
        "used_in_prediction": False
    }


def collect_for_company(company: str) -> List[Dict[str, Any]]:
    prompt = build_prompt(company)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())]
        ),
    )

    raw_text = (response.text or "").strip()
    print(f"\n===== RAW RESPONSE FOR {company} =====")
    print(raw_text)
    print("=====================================\n")

    parsed = extract_json_block(raw_text)
    signals = parsed.get("signals", [])

    rows = []
    for signal in signals:
        if not isinstance(signal, dict):
            continue
        normalized = normalize_signal(company, prompt, signal)
        if normalized is not None:
            rows.append(normalized)

    return rows

import time
def generate_run_id() -> str:
    return f"run_{uuid.uuid4().hex[:12]}"

def run_collector() -> Dict[str, Any]:
    existing = load_existing()
    run_id = generate_run_id()
    inserted = 0
    all_new_rows: List[Dict[str, Any]] = []
    logs: List[Dict[str, Any]] = []

    for company in COMPANIES:
        try:
            rows = collect_for_company(company)
            for row in rows:
                row["run_id"] = run_id
            all_new_rows.extend(rows)

            logs.append({
                "company": company,
                "status": "ok",
                "rows_found": len(rows),
                "rows_saved": len(rows),
            })
            time.sleep(12)

        except Exception as e:
            logs.append({
                "company": company,
                "status": "error",
                "error": str(e),
            })
            print(f"Collector failed for {company}: {e}")

        if all_new_rows:
            merged_rows, inserted = merge_or_append(existing, all_new_rows)
            save_existing(merged_rows)

    return {
        "status": "ok",
        "run_id": run_id,
        "companies_processed": len(COMPANIES),
        "records_inserted": inserted,
        "total_records": len(load_existing()),
        "logs": logs,
        
    }