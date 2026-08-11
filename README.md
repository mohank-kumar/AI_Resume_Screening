🤖 AI Resume Screening System

An AI-powered resume screening and candidate evaluation platform designed to help HR teams efficiently analyze, compare, rank, and shortlist candidates against job descriptions.

The system uses Large Language Models (LLMs), LangGraph-based AI workflows, FastAPI, React, and PostgreSQL to automate the resume screening process.

📑 Table of Contents

Overview

Problem Statement

Project Objectives

Key Features

System Workflow

AI Screening Pipeline

Architecture

AI Agents

Scoring System

Detailed Candidate Analysis

Technology Stack

Project Structure

Database Design

Backend API

Frontend

Installation

Environment Variables

Running the Application

Security

Future Enhancements

Troubleshooting

Contributing

License

📖 Overview

The AI Resume Screening System is a web-based recruitment assistance platform.

The system allows HR users to:

Register and log in.

Create and manage job descriptions.

Upload multiple candidate resumes.

Extract text from resumes.

Parse candidate information using an LLM.

Extract structured requirements from job descriptions.

Compare job requirements against candidate profiles.

Calculate category-level match scores.

Generate an overall candidate score.

Generate hiring recommendations.

Identify candidate strengths and weaknesses.

Generate targeted interview questions.

Rank candidates based on their screening scores.

View detailed candidate analysis through a web dashboard.

🎯 Problem Statement

Traditional resume screening is often:

Time-consuming

Manual

Repetitive

Difficult to scale

Subject to inconsistent evaluation

Difficult to compare candidates objectively

The system addresses this problem by creating an automated AI-assisted screening pipeline.

Job Description
       ↓
Candidate Resume
       ↓
Skills
       ↓
Experience
       ↓
Education
       ↓
Domain
       ↓
AI Evaluation
       ↓
Candidate Score & Recommendation

🎯 Project Objectives

Automate resume screening.

Extract useful information from resumes.

Convert unstructured job descriptions into structured requirements.

Compare candidate skills with job requirements.

Evaluate experience relevance.

Evaluate education and certifications.

Evaluate domain alignment.

Generate quantitative candidate scores.

Provide hiring recommendations.

Identify candidate strengths and risks.

Generate interview questions based on candidate gaps.

Rank candidates for a particular job.

Provide HR-friendly visualizations and reports.

✨ Key Features

👤 HR Authentication

HR registration

HR login

User session handling

Logout

💼 Job Description Management

Create job descriptions

View job descriptions

Search job descriptions

Edit job descriptions

Delete job descriptions

View uploaded resume count

Navigate to associated candidates

📄 Resume Upload

Supports:

PDF

DOC

DOCX

Multiple resumes can be uploaded for a job.

🔍 Resume Text Extraction

Resume text is extracted before AI processing and stored for subsequent analysis.

🧠 AI Resume Screening

The screening pipeline performs:

Job Description
       │
       ▼
JD Extraction
       │
       ▼
Resume Parsing
       │
       ▼
Match Evaluation
       │
       ▼
Final Scoring
       │
       ▼
Screening Result

🧩 AI Screening Pipeline

The AI pipeline is implemented using LangGraph.

                    ┌──────────────────┐
                    │ Job Description  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ JD Extractor     │
                    │ Agent            │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Resume Parser    │
                    │ Agent            │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Match Evaluator  │
                    │ Agent            │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Final Scorer     │
                    │ Agent            │
                    └────────┬─────────┘
                             │
                             ▼
                    Final Screening Result

🤖 AI Agents

1. JD Extractor

Extracts:

Job title

Mandatory technical skills

Preferred technical skills

Required experience

Education requirements

Certifications

Domain requirements

Example:

{
  "mandatory_skills": ["Python", "FastAPI", "SQL", "Git"],
  "preferred_skills": ["Docker", "AWS"],
  "required_experience": "2 years"
}

2. Resume Parser

Extracts:

Candidate name

Email

Phone

Skills

Education

Certifications

Work experience

Job roles

Responsibilities

Domains

Example:

{
  "candidate_info": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "skills": ["Python", "FastAPI", "SQL", "Docker"]
}

3. Match Evaluator

Compares the extracted JD and parsed resume.

Technical Skills

JD required skills

Candidate skills

Matched mandatory skills

Missing mandatory skills

Matched preferred skills

Missing preferred skills

Additional candidate skills

Experience

Required years

Candidate experience

Experience match

Seniority fit

Relevant responsibilities

Education

Required degree

Required field

Candidate degree

Candidate field

Certifications

Domain Fit

JD target domains

Candidate domains

Matched domains

Related domains

Missing domains

Example:

{
  "technical_skills": {
    "jd_required_skills": ["Python", "FastAPI", "SQL", "Git"],
    "candidate_skills": ["Python", "FastAPI", "SQL", "Docker"],
    "matched_mandatory_skills": ["Python", "FastAPI", "SQL"],
    "missing_mandatory_skills": ["Git"]
  }
}

The detailed analysis is stored as structured JSON in the database.

4. Final Scorer

Produces:

Technical Skills Score

Experience Score

Education Score

Domain Fit Score

Overall Match Score

Hiring Recommendation

Executive Summary

Strengths

Risk Factors

Interview Questions

📊 Scoring System

Technical Skills Score

Evaluates mandatory skills, preferred skills, missing requirements, and additional relevant skills.

Example:

Technical Skills: 65%

Experience Score

Evaluates required experience, candidate experience, previous responsibilities, and seniority alignment.

Experience: 40%

Education Score

Evaluates degree, field of study, certifications, and required educational qualifications.

Education: 90%

Domain Fit Score

Evaluates target industry/domain and candidate domain experience.

Domain Fit: 70%

Overall Candidate Score

The overall score is represented on a 0–100 scale.

Overall Match Score
        72%

The application's scoring logic should be responsible for the final score rather than allowing an LLM to arbitrarily modify it.

🏷️ Hiring Recommendation

Score

Recommendation

85-100

Strong Hire

70-84

Hire

55-69

Shortlist

40-54

Consider

0-39

Reject

📋 Detailed Candidate Analysis

The candidate details page provides evidence behind the scores.

Example:

JD Required Skills

Python
Python OOP concepts
Data Structures and Algorithms
Flask
FastAPI
REST APIs
SQL
Git
GitHub
HTML
CSS
JavaScript

Candidate Skills

Python
FastAPI
Flask
SQL
TensorFlow
PyTorch
Scikit-Learn
LangChain
RAG

Matched Mandatory Skills

Python
FastAPI
Flask
SQL

Missing Mandatory Skills

Git
GitHub
HTML
CSS
JavaScript

This provides transparency behind the candidate score.

🏗️ System Architecture

                         HR USER
                            │
                            ▼
                  ┌───────────────────┐
                  │ React Frontend    │
                  └─────────┬─────────┘
                            │
                         REST API
                            │
                            ▼
                  ┌───────────────────┐
                  │ FastAPI Backend   │
                  └─────────┬─────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        PostgreSQL Database       Resume Files
                │
                ▼
          Screening Service
                │
                ▼
             LangGraph
                │
        ┌───────┼────────┐
        │       │        │
        ▼       ▼        ▼
       JD     Resume    Match
    Extractor Parser   Evaluator
                │
                ▼
          Final Scorer
                │
                ▼
        Screening Result
                │
                ▼
          React Dashboard

🛠️ Technology Stack

Frontend

React

Vite

JavaScript

React Router

Axios

React Icons

CSS

Backend

Python

FastAPI

Uvicorn

SQLAlchemy

PostgreSQL

Pydantic

JWT-based authentication

PDF processing

AI / LLM

Large Language Models

LangChain

LangGraph

Prompt Engineering

Structured JSON output

Agent-based workflow

Database

PostgreSQL

📁 Project Structure

resume-screening-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database/
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── job_description.py
│   │   │   ├── resume.py
│   │   │   └── screening_result.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── job.py
│   │   │   ├── resume.py
│   │   │   └── screening_result.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── jobs.py
│   │   │   ├── resumes.py
│   │   │   └── screening.py
│   │   ├── services/
│   │   │   ├── screening_service.py
│   │   │   ├── resume_service.py
│   │   │   └── job_service.py
│   │   └── deps.py
│   ├── Agents/
│   │   ├── JD_Extractor.py
│   │   ├── Resume_Parser.py
│   │   ├── Match_Evaluator.py
│   │   ├── Final_Scorer.py
│   │   └── resume_screening_agent.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── jobApi.js
│   │   │   ├── resumeApi.js
│   │   │   ├── screeningApi.js
│   │   │   └── dashboardApi.js
│   │   ├── components/
│   │   │   ├── Sidebar/
│   │   │   ├── Navbar/
│   │   │   └── AnalyticsCard/
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── Jobs/
│   │   │   ├── CreateJob/
│   │   │   ├── UploadResume/
│   │   │   ├── Candidates/
│   │   │   └── CandidateDetails/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── .env.example
└── README.md

🗄️ Database Design

User
 │
 └── Job Description
          │
          └── Resume
                │
                └── Screening Result

User

id
full_name
email
password
created_at

Job Description

id
title
description
location
user_id
created_at

Resume

id
filename
file_path
resume_text
candidate_name
email
phone
status
job_description_id
created_at

Resume statuses:

Uploaded
Parsing
Screening
Completed
Failed

Screening Result

id
overall_score
technical_score
experience_score
education_score
domain_score
recommendation
executive_summary
strengths
weaknesses
interview_questions
category_analysis
resume_id
created_at

The category_analysis field stores detailed Match Evaluator output as structured JSON.

🔄 Resume Processing Flow

Resume Upload
      │
      ▼
Status = Uploaded
      │
      ▼
Status = Parsing
      │
      ▼
Extract Resume Text
      │
      ▼
Store Resume Text
      │
      ▼
Status = Screening
      │
      ▼
Run LangGraph
      │
      ├── JD Extraction
      ├── Resume Parsing
      ├── Match Evaluation
      └── Final Scoring
      │
      ▼
Save Screening Result
      │
      ▼
Status = Completed

If an error occurs:

Error
  │
  ▼
Status = Failed

⚙️ Backend API

Authentication

POST /register
POST /login

Jobs

GET    /jobs
POST   /jobs
GET    /jobs/{job_id}
PUT    /jobs/{job_id}
DELETE /jobs/{job_id}

Resume Upload

POST /resumes/upload/{job_id}

Screening

GET /screening/{resume_id}
GET /screening/jobs/{job_id}/ranking
GET /screening/candidates

🖥️ Frontend

Main pages:

Login
Register
Dashboard
Jobs
Create Job
Upload Resumes
Candidates
Candidate Details

The dashboard provides:

Total jobs

Total candidates

Recent job descriptions

Top-ranked candidates

Candidate scores

Resume preview

The candidate details page provides:

Candidate Information
        │
        ▼
Overall Score
        │
        ▼
Category Scores
        │
        ├── Technical Skills
        ├── Experience
        ├── Education
        └── Domain Fit
        │
        ▼
Executive Summary
        │
        ▼
Top Strengths
        │
        ▼
Risk Factors
        │
        ▼
Interview Questions

🚀 Installation

Prerequisites

Python 3.x

Node.js

npm

PostgreSQL

Git

Clone Repository

git clone https://github.com/YOUR_USERNAME/resume-screening-system.git
cd resume-screening-system

Backend Setup

cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

Windows:

.venv\Scriptsctivate

PostgreSQL Setup

Create a database, for example:

resume_screening

Environment Variables

Create backend/.env:

DATABASE_URL=postgresql://username:password@localhost:5432/resume_screening
SECRET_KEY=your_secret_key
LLM_API_KEY=your_api_key

Use the appropriate LLM/API variable required by your configured model provider.

⚠️ Security Note

Never commit:

.env
.venv/
node_modules/
uploaded resumes
database files
API credentials
private keys

Keep a safe template in:

.env.example

▶️ Running the Application

Backend

cd backend
uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

🧪 Testing the Application

1. Register HR account
        ↓
2. Login
        ↓
3. Create Job Description
        ↓
4. Upload Resume
        ↓
5. Wait for AI screening
        ↓
6. Open Candidates
        ↓
7. View Candidate
        ↓
8. Review score
        ↓
9. Review detailed analysis
        ↓
10. Review interview questions

📐 Precision, Recall and Skill Matching

For set-based skill evaluation:

intersection = actual_set & expected_set

Precision:

precision = len(intersection) / len(actual_set)

Recall:

recall = len(intersection) / len(expected_set)

These metrics can help evaluate how candidate skills overlap with expected requirements.

🔐 Security Considerations

Never commit:

.env
.venv/
node_modules/
uploaded resumes
database files
API credentials
private keys

Use .gitignore to prevent accidental commits.

📈 Future Enhancements

AI Improvements

Better skill normalization

Semantic skill matching

Embedding-based candidate matching

Vector database integration

RAG-based recruitment knowledge system

Improved hallucination control

Explainable AI scoring

Candidate comparison

Automated resume improvement suggestions

Recruitment Features

Candidate filtering

Advanced candidate search

Candidate ranking

Job-specific candidate pools

Interview scheduling

HR feedback system

Candidate status management

Email notifications

Application tracking

Analytics

Average candidate score

Skill gap distribution

Candidates by recommendation

Job-wise candidate statistics

Screening success rate

Most common missing skills


🛠️ Troubleshooting

Backend does not start

python --version
pip install -r requirements.txt
uvicorn app.main:app --reload

Database connection error

Verify DATABASE_URL in .env and make sure PostgreSQL is running.

Frontend dependency error

npm install
npm run dev

Resume screening fails

Check:

Resume file format

Resume file path

LLM API configuration

Database connection

Backend logs

LangGraph execution logs

📊 Project Status

HR Registration

HR Login

Job Creation

Job Editing

Job Deletion

Resume Upload

Multiple Resume Upload

Resume Text Extraction

Resume Parsing

JD Extraction

Candidate Match Evaluation

Final Candidate Scoring

Candidate Ranking

Executive Summary

Candidate Strengths

Candidate Risk Factors

Interview Question Generation

Candidate Details Page

Resume Preview

Dashboard

Screening Status Tracking

🗺️ Roadmap

Phase 1 — Core System

Resume upload

JD management

AI screening

Candidate scoring

Phase 2 — Explainable Screening

Detailed skill comparison

Experience comparison

Education comparison

Domain comparison

Explainable scoring

Phase 3 — Advanced AI

Semantic skill matching

Embeddings

RAG

Vector database

Advanced agentic workflows

Phase 4 — Production

Docker

Cloud deployment

Monitoring

Logging

Security hardening

CI/CD

🤝 Contributing

Clone the repository:

git clone https://github.com/YOUR_USERNAME/resume-screening-system.git

Create a branch:

git checkout -b feature/new-feature

Commit changes:

git add .
git commit -m "Add new feature"

Push:

git push origin feature/new-feature

Then create a Pull Request.

👨‍💻 Author

Mohan Kumar

M.E. Computer Science Engineering

Areas of Interest

Artificial Intelligence

Agentic AI

Large Language Models

RAG Systems

LangChain

LangGraph

FastAPI

Full-Stack AI Applications

Machine Learning


⭐ Acknowledgements

This project uses technologies and concepts from:

Python

FastAPI

React

PostgreSQL

SQLAlchemy

LangChain

LangGraph

Large Language Models

Prompt Engineering

Agentic AI
