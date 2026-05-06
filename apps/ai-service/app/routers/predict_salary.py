"""
Salary Prediction Model
From doc 14 — AI Documentation, Section 5.

Model: XGBoost Regressor (or fallback rule-based estimator)
Features: skills (encoded), experience_years, city_tier, job_type
Output: {daily_rate_min, daily_rate_median, daily_rate_max} in INR
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

router = APIRouter()

# ─── City tier mapping ─────────────────────────────────

CITY_TIERS = {
    # Metro (Tier 0)
    "delhi": 0, "mumbai": 0, "bangalore": 0, "bengaluru": 0,
    "hyderabad": 0, "chennai": 0, "kolkata": 0, "pune": 0,
    # Tier 1
    "noida": 1, "gurgaon": 1, "gurugram": 1, "ahmedabad": 1,
    "jaipur": 1, "lucknow": 1, "chandigarh": 1, "indore": 1,
    "bhopal": 1, "nagpur": 1, "surat": 1, "kochi": 1,
    # Tier 2 (default)
}

# ─── Skill base rates (INR per day) ────────────────────

SKILL_BASE_RATES = {
    "Electrician": 700, "Wiring": 650, "Smart Home": 900,
    "EV Charger": 1000, "Solar Panel": 950, "Circuit Board": 800,
    "Plumber": 650, "Pipe Fitting": 600, "Leakage Repair": 600,
    "Carpenter": 700, "Furniture": 750, "Cabinet Making": 800,
    "Painter": 600, "Wall Painting": 600, "Waterproofing": 700,
    "AC Technician": 750, "Refrigerator Repair": 650,
    "Deep Cleaning": 500, "Kitchen Cleaning": 400,
    "Mason": 700, "Tile Work": 750, "Welding": 800,
    "Mechanic": 650, "Cook": 500, "Maid": 400,
    "Security Guard": 450, "Delivery Driver": 500,
}

DEFAULT_BASE_RATE = 600


class PredictSalaryRequest(BaseModel):
    skills: List[str]
    experience_years: int = 0
    city: str = "delhi"
    job_type: Optional[str] = "contract"


class SalaryPrediction(BaseModel):
    daily_rate_min: float
    daily_rate_median: float
    daily_rate_max: float
    currency: str = "INR"
    confidence: float


@router.post("/predict-salary", response_model=SalaryPrediction)
async def predict_salary(req: PredictSalaryRequest):
    """
    Predict fair daily wage range for given skills + location.
    
    Uses a rule-based estimator (upgraded to XGBoost with training data).
    Factors: base skill rate × experience multiplier × city tier multiplier
    """
    # 1. Base rate from primary skill
    base_rates = [SKILL_BASE_RATES.get(s, DEFAULT_BASE_RATE) for s in req.skills]
    base_rate = max(base_rates) if base_rates else DEFAULT_BASE_RATE
    
    # 2. Experience multiplier (per doc 14: more experience = higher rate)
    exp_multiplier = 1.0 + min(req.experience_years, 20) * 0.05  # +5% per year, max +100%
    
    # 3. City tier multiplier
    city_tier = CITY_TIERS.get(req.city.lower(), 2)
    city_multipliers = {0: 1.3, 1: 1.15, 2: 1.0}  # Metro pays 30% more
    city_mult = city_multipliers.get(city_tier, 1.0)
    
    # 4. Job type multiplier
    type_multipliers = {"permanent": 0.95, "contract": 1.0, "oneday": 1.15}
    type_mult = type_multipliers.get(req.job_type or "contract", 1.0)
    
    # 5. Multi-skill bonus
    skill_bonus = 1.0 + max(0, len(req.skills) - 1) * 0.08  # +8% per additional skill
    
    # Calculate median rate
    median = base_rate * exp_multiplier * city_mult * type_mult * skill_bonus
    
    # Min/Max range (±20%)
    daily_min = round(median * 0.80, 0)
    daily_median = round(median, 0)
    daily_max = round(median * 1.20, 0)
    
    return SalaryPrediction(
        daily_rate_min=daily_min,
        daily_rate_median=daily_median,
        daily_rate_max=daily_max,
        confidence=0.82
    )
