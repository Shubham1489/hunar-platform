"""
Applicant Ranking for Employers
From doc 14 — AI Documentation, Section 4.

Scoring:
- match_score = cosine_similarity(worker_skills, job_skills) × 100
- Experience bonus: +5 if worker.experience >= job.experience_min
- Rating tiebreaker: higher rating wins at equal match scores
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.routers.recommend import compute_skill_similarity

router = APIRouter()


class RankApplicantsRequest(BaseModel):
    job_id: str
    job_skills: List[str] = []
    experience_min: int = 0
    applicants: List[dict] = []


class RankedApplicant(BaseModel):
    worker_id: str
    name: Optional[str]
    match_score: float
    skill_match: float
    experience_bonus: float
    rating: float
    skills: List[str]


class RankSingleRequest(BaseModel):
    job_id: str
    worker_id: str
    job_skills: List[str] = []
    worker_skills: List[str] = []


@router.post("/rank-applicants")
async def rank_applicants(req: RankApplicantsRequest):
    """
    Rank job applicants by AI match score.
    
    Algorithm:
    1. Cosine similarity between worker skills and job requirements
    2. Experience bonus (+5 if meets minimum)
    3. Rating tiebreaker for equal scores
    """
    ranked = []
    
    for applicant in req.applicants:
        worker_skills = applicant.get("skills", [])
        
        # Skill match score (0-100)
        skill_match = compute_skill_similarity(worker_skills, req.job_skills) * 100
        
        # Experience bonus
        exp_bonus = 5.0 if applicant.get("experience_years", 0) >= req.experience_min else 0.0
        
        # Rating (0-5)
        rating = applicant.get("rating_avg", 0.0)
        
        # Final score (skill match is dominant)
        match_score = round(skill_match + exp_bonus + (rating * 0.5), 1)
        
        ranked.append(RankedApplicant(
            worker_id=applicant.get("worker_id", ""),
            name=applicant.get("name"),
            match_score=match_score,
            skill_match=round(skill_match, 1),
            experience_bonus=exp_bonus,
            rating=rating,
            skills=worker_skills
        ))
    
    # Sort by match score descending, then by rating
    ranked.sort(key=lambda x: (x.match_score, x.rating), reverse=True)
    
    return {"applicants": ranked}


@router.post("/rank-single")
async def rank_single(req: RankSingleRequest):
    """Get match score for a single worker-job pair."""
    match_score = compute_skill_similarity(req.worker_skills, req.job_skills) * 100
    return {"match_score": round(match_score, 1)}
