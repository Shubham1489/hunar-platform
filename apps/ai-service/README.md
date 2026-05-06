# Hunar AI/ML Service

The Python AI microservice powering intelligent features in the Hunar platform.

## Tech Stack

- **Runtime:** Python 3.11+
- **Framework:** FastAPI 0.115
- **ML:** scikit-learn (TF-IDF, cosine similarity)
- **NLP:** langdetect, googletrans, RapidFuzz
- **Server:** Uvicorn (ASGI)

## Quick Start

```bash
# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python -m app.main
# ✅ http://localhost:8000
# 📖 http://localhost:8000/docs (Swagger)
```

## Project Structure

```
app/
├── main.py                    # FastAPI application entry point
└── routers/
    ├── recommend.py           # Job recommendation engine
    ├── extract_skills.py      # Voice/text → skill extraction
    ├── predict_salary.py      # Fair wage prediction
    └── rank_applicants.py     # Applicant ranking for employers
```

## API Endpoints

### `GET /health`
Health check endpoint.

### `POST /recommend`
Get AI-recommended jobs for a worker.

```json
// Request
{
  "worker_id": "worker-uuid",
  "skills": ["Electrician", "Wiring"],
  "lat": 28.6139,
  "lng": 77.2090
}

// Response
{
  "recommendations": [
    { "job_id": "...", "score": 0.95, "skill_match": 0.97, "location_score": 0.89 }
  ]
}
```

### `POST /extract-skills`
Extract structured skills from natural language (Hindi/English).

```json
// Request
{ "transcript": "main electrician hoon aur wiring ka kaam karta hoon" }

// Response
{
  "detected_language": "hi",
  "translated_text": "I am an electrician and I do wiring work",
  "skills": [
    { "skill": "Electrician", "confidence": 1.0 },
    { "skill": "Wiring", "confidence": 1.0 }
  ]
}
```

### `POST /predict-salary`
Predict fair daily wage range.

```json
// Request
{ "skills": ["Electrician", "Smart Home"], "experience_years": 5, "city": "delhi" }

// Response
{ "daily_rate_min": 850, "daily_rate_median": 1000, "daily_rate_max": 1200 }
```

### `POST /rank-applicants`
Rank job applicants by match quality.

```json
// Request
{
  "job_skills": ["Electrician", "Circuit Board"],
  "applicants": [
    { "id": "w1", "skills": ["Electrician", "Wiring"], "experience": 8, "rating": 4.9 },
    { "id": "w2", "skills": ["Electrician", "Circuit Board"], "experience": 5, "rating": 4.5 }
  ]
}

// Response
{
  "ranked": [
    { "id": "w2", "score": 0.94 },
    { "id": "w1", "score": 0.87 }
  ]
}
```

## Algorithms

### Recommendation Engine
- **Method:** Content-based filtering (hybrid scoring)
- **Skill matching:** TF-IDF vectorization → cosine similarity
- **Location:** Haversine distance, 50km radius
- **Formula:** `0.6 × skill_match + 0.3 × location_score + 0.1 × recency_bonus`

### Skill Extraction
- **Pipeline:** Language detection → translation → tokenization → fuzzy matching
- **Matching:** RapidFuzz @ 80% threshold against 27-skill taxonomy
- **Languages:** Hindi, English, Hinglish

### Salary Prediction
- **Model:** Rule-based (XGBoost-ready when training data available)
- **Factors:** Base skill rate × experience × city tier × job type

### Applicant Ranking
- **Scoring:** `0.7 × skill_cosine + 0.2 × experience_norm + 0.1 × rating_norm`

## Dependencies

```
fastapi>=0.115.0          # Web framework
uvicorn>=0.32.0           # ASGI server
scikit-learn>=1.5.0       # ML algorithms (TF-IDF, cosine)
numpy>=2.0.0              # Numerical computing
pydantic>=2.10.0          # Data validation
langdetect>=1.0.9         # Language detection
googletrans==4.0.0rc1     # Translation
rapidfuzz>=3.9.0          # Fuzzy string matching
python-dotenv>=1.0.0      # Environment config
```

## Docker

```bash
docker build -t hunar-ai .
docker run -p 8000:8000 hunar-ai
```
