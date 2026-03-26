from whitespace import map_whitespace
from weak_phase import predict_weak_phase
from simulator import simulate_decision
from pydantic import BaseModel
from predictor import predict_strategy
import json
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from collector import run_collector, DATA_FILE, ensure_data_file
from scheduler_jobs import start_scheduler
from predictor import predict_strategy
from simulator import simulate_decision


# ✅ PASTE CLASS HERE (RIGHT AFTER IMPORTS)
class SimulationRequest(BaseModel):
    company: str
    proposed_action: str


app = FastAPI(title="YuktiLens Collector API")

app = FastAPI(title="YuktiLens Collector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    ensure_data_file()
    start_scheduler()

@app.get("/")
def root():
    return {"message": "YuktiLens collector running"}

    
@app.post("/run-collector")
def run_collector_now():
    return run_collector()

@app.post("/debug-run")
def debug_run_collector():
    return run_collector()
@app.post("/simulate-decision")
def simulate_decision_route(payload: SimulationRequest):
    return simulate_decision(payload.company, payload.proposed_action)
@app.post("/predict-weak-phase/{company}")
def predict_weak_phase_route(company: str):
    return predict_weak_phase(company)
@app.post("/map-whitespace")
def map_whitespace_route():
    return map_whitespace()
@app.get("/evidence")
def get_evidence():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            raw = f.read().strip()
            if not raw:
                return []
            return json.loads(raw)
    except json.JSONDecodeError:
        return []
@app.post("/predict-strategy/{company}")
def predict_strategy_route(company: str):
    return predict_strategy(company)

@app.get("/health")
def health():
    return {"status": "healthy"}
@app.get("/verified-evidence")
def get_verified_evidence():
    if not os.path.exists(DATA_FILE):
        return []

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            raw = f.read().strip()
            if not raw:
                return []
            rows = json.loads(raw)
            return [row for row in rows if row.get("verification_status") == "verified"]
    except json.JSONDecodeError:
        return []
    
@app.get("/weak-evidence")
def get_weak_evidence():
    if not os.path.exists(DATA_FILE):
        return []

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            raw = f.read().strip()
            if not raw:
                return []
            rows = json.loads(raw)
            return [row for row in rows if row.get("verification_status") == "weak"]
    except json.JSONDecodeError:
        return []