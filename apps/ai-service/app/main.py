"""
Hunar AI/ML Service — FastAPI Application
Provides: Job Recommendations, Skill Extraction, Salary Prediction, Applicant Ranking.
From doc 14 — AI Documentation.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='../../.env')

from app.routers import recommend, extract_skills, predict_salary, rank_applicants

app = FastAPI(
    title="Hunar AI Service",
    description="AI/ML microservice for job recommendations, skill extraction, salary prediction, and applicant ranking.",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(recommend.router, tags=["Recommendations"])
app.include_router(extract_skills.router, tags=["Skill Extraction"])
app.include_router(predict_salary.router, tags=["Salary Prediction"])
app.include_router(rank_applicants.router, tags=["Applicant Ranking"])


@app.get("/health")
async def health_check():
    """Liveness probe endpoint."""
    return {"status": "ok", "service": "hunar-ai-service"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
