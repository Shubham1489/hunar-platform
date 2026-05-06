"""
Job Recommendation Engine
From doc 14 — AI Documentation, Section 2.

Content-Based Filtering:
- TF-IDF weighted skill vectors
- Cosine similarity for skill matching
- Haversine distance for location scoring

Hybrid Scoring:
- 0.6 × content_score + 0.3 × collaborative_score + 0.1 × recency_bonus
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from math import radians, cos, sin, asin, sqrt
from datetime import datetime, timedelta
import json
import os

router = APIRouter()


class RecommendRequest(BaseModel):
    worker_id: str
    limit: int = 20


class RecommendedJob(BaseModel):
    job_id: str
    title: str
    company: str
    city: Optional[str]
    salary_min: Optional[float]
    salary_max: Optional[float]
    match_score: float
    skill_match_score: float
    location_score: float
    recency_bonus: float
    skills_required: List[str]


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance (km) between two points on earth."""
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return 6371 * c  # Earth radius in km


def compute_skill_similarity(worker_skills: List[str], job_skills: List[str]) -> float:
    """
    Cosine similarity between worker and job skill vectors.
    Uses simple TF-IDF-like weighting.
    """
    if not worker_skills or not job_skills:
        return 0.0
    
    # Create unified skill set
    all_skills = list(set([s.lower() for s in worker_skills + job_skills]))
    
    # Binary vectors (can be enhanced with TF-IDF weights)
    worker_vec = np.array([1 if s.lower() in [ws.lower() for ws in worker_skills] else 0 for s in all_skills], dtype=float)
    job_vec = np.array([1 if s.lower() in [js.lower() for js in job_skills] else 0 for s in all_skills], dtype=float)
    
    # Cosine similarity
    dot_product = np.dot(worker_vec, job_vec)
    norm_product = np.linalg.norm(worker_vec) * np.linalg.norm(job_vec)
    
    if norm_product == 0:
        return 0.0
    
    return float(dot_product / norm_product)


def compute_location_score(
    worker_lat: Optional[float], worker_lng: Optional[float],
    job_lat: Optional[float], job_lng: Optional[float],
    max_radius_km: float = 50.0
) -> float:
    """Location score: 1.0 (same location) to 0.0 (beyond max radius)."""
    if not all([worker_lat, worker_lng, job_lat, job_lng]):
        return 0.5  # Neutral if location unknown
    
    distance = haversine(worker_lat, worker_lng, job_lat, job_lng)
    return max(0.0, 1.0 - distance / max_radius_km)


def compute_recency_bonus(created_at: str) -> float:
    """Recency bonus for recently posted jobs."""
    try:
        job_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        age_hours = (datetime.now(job_date.tzinfo or None) - job_date).total_seconds() / 3600
        
        if age_hours < 24:
            return 0.1
        elif age_hours < 48:
            return 0.05
        return 0.0
    except:
        return 0.0


# ─── Sample data for demonstration ─────────────────────

SAMPLE_WORKERS = {
    "worker-1": {
        "skills": ["Electrician", "Wiring", "Smart Home", "EV Charger"],
        "city": "Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "experience_years": 8
    },
    "worker-2": {
        "skills": ["Plumber", "Pipe Fitting", "Leakage Repair"],
        "city": "Mumbai",
        "lat": 19.0760,
        "lng": 72.8777,
        "experience_years": 5
    }
}

SAMPLE_JOBS = [
    {
        "job_id": "job-001",
        "title": "Senior Electrician - Commercial Building",
        "company": "BuildCraft Infra",
        "city": "Delhi",
        "lat": 28.6500,
        "lng": 77.2167,
        "salary_min": 800.0,
        "salary_max": 1200.0,
        "skills_required": ["Electrician", "Wiring", "Safety Certified"],
        "created_at": datetime.now().isoformat()
    },
    {
        "job_id": "job-002",
        "title": "Smart Home Installation Expert",
        "company": "TechHome Solutions",
        "city": "Noida",
        "lat": 28.5355,
        "lng": 77.3910,
        "salary_min": 1000.0,
        "salary_max": 1500.0,
        "skills_required": ["Smart Home", "Electrician", "EV Charger"],
        "created_at": datetime.now().isoformat()
    },
    {
        "job_id": "job-003",
        "title": "Plumbing Maintenance - Residential Complex",
        "company": "GreenView Apartments",
        "city": "Delhi",
        "lat": 28.5800,
        "lng": 77.1900,
        "salary_min": 600.0,
        "salary_max": 900.0,
        "skills_required": ["Plumber", "Pipe Fitting", "Bath Fittings"],
        "created_at": (datetime.now() - timedelta(days=3)).isoformat()
    },
    {
        "job_id": "job-004",
        "title": "Full House Rewiring",
        "company": "PowerGrid Services",
        "city": "Gurgaon",
        "lat": 28.4595,
        "lng": 77.0266,
        "salary_min": 850.0,
        "salary_max": 1200.0,
        "skills_required": ["Electrician", "Wiring", "Circuit Board"],
        "created_at": (datetime.now() - timedelta(hours=12)).isoformat()
    },
    {
        "job_id": "job-005",
        "title": "AC Installation & Repair",
        "company": "CoolTech HVAC",
        "city": "Delhi",
        "lat": 28.6300,
        "lng": 77.2200,
        "salary_min": 700.0,
        "salary_max": 1100.0,
        "skills_required": ["AC Technician", "HVAC", "Electrician"],
        "created_at": (datetime.now() - timedelta(hours=6)).isoformat()
    }
]


@router.post("/recommend", response_model=List[RecommendedJob])
async def get_recommendations(req: RecommendRequest):
    """
    Get AI-ranked job recommendations for a worker.
    
    Algorithm:
    1. Compute skill match score (cosine similarity)
    2. Compute location score (haversine distance)
    3. Compute recency bonus
    4. Hybrid score = 0.6×skill + 0.3×location + 0.1×recency
    5. Return top-N ranked jobs
    """
    # Get worker data (from DB in production, sample for demo)
    worker = SAMPLE_WORKERS.get(req.worker_id, {
        "skills": ["Electrician", "Wiring"],  # Default fallback
        "city": "Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "experience_years": 3
    })
    
    recommendations = []
    
    for job in SAMPLE_JOBS:
        # 1. Skill match score
        skill_score = compute_skill_similarity(
            worker["skills"], job["skills_required"]
        )
        
        # 2. Location score
        loc_score = compute_location_score(
            worker.get("lat"), worker.get("lng"),
            job.get("lat"), job.get("lng")
        )
        
        # 3. Recency bonus
        recency = compute_recency_bonus(job["created_at"])
        
        # 4. Hybrid score (P0 content-based weights)
        match_score = round(
            0.6 * skill_score * 100 +
            0.3 * loc_score * 100 +
            0.1 * recency * 100, 1
        )
        
        recommendations.append(RecommendedJob(
            job_id=job["job_id"],
            title=job["title"],
            company=job["company"],
            city=job.get("city"),
            salary_min=job.get("salary_min"),
            salary_max=job.get("salary_max"),
            match_score=match_score,
            skill_match_score=round(skill_score * 100, 1),
            location_score=round(loc_score * 100, 1),
            recency_bonus=round(recency * 100, 1),
            skills_required=job["skills_required"]
        ))
    
    # Sort by match score descending
    recommendations.sort(key=lambda x: x.match_score, reverse=True)
    
    return recommendations[:req.limit]
