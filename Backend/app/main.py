from fastapi import FastAPI

from sqlalchemy import text
from app.database.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

# Import models before create_all
from app.models import *

from app.routers.auth import router as auth_router
from app.routers.jobs import router as job_router
from app.routers.resumes import router as resume_router
from app.routers.screening import router as screening_router
from app.routers.dashboard import router as dashboard_router

app = FastAPI(
    title="AI Resume Screening System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Ensure job_descriptions, resumes, and screening_results tables have required columns
with engine.begin() as conn:
    conn.execute(text("ALTER TABLE job_descriptions ADD COLUMN IF NOT EXISTS location VARCHAR(255);"))
    conn.execute(text("ALTER TABLE job_descriptions ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;"))
    conn.execute(text("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS resume_text TEXT;"))
    conn.execute(text("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS candidate_name VARCHAR(255);"))
    conn.execute(text("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS email VARCHAR(255);"))
    conn.execute(text("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS phone VARCHAR(30);"))
    conn.execute(text("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Uploaded';"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS technical_score DOUBLE PRECISION;"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS experience_score DOUBLE PRECISION;"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS education_score DOUBLE PRECISION;"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS domain_score DOUBLE PRECISION;"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS recommendation VARCHAR(100);"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS executive_summary TEXT;"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS strengths JSONB;"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS weaknesses JSONB;"))
    conn.execute(text("ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS interview_questions JSONB;"))

# Register Routers
app.include_router(auth_router)
app.include_router(job_router)
app.include_router(resume_router)   
app.include_router(screening_router)
app.include_router(dashboard_router)

@app.get("/")
def home():
    return {
        "message": "AI Resume Screening System API"
    }