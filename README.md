# 🤖 AI Resume Screening System

An AI-powered resume screening and candidate evaluation platform designed to help HR teams efficiently analyze, compare, rank, and shortlist candidates against job descriptions.

The system uses **Large Language Models (LLMs)**, **LangGraph-based AI workflows**, **FastAPI**, **React**, and **PostgreSQL** to automate the resume screening process.

Instead of manually reviewing every resume, HR users can create job descriptions, upload multiple resumes, and allow the AI pipeline to analyze each candidate based on technical skills, experience, education, certifications, and domain fit.

---

# 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [System Workflow](#-system-workflow)
- [AI Screening Pipeline](#-ai-screening-pipeline)
- [Architecture](#-architecture)
- [AI Agents](#-ai-agents)
- [Scoring System](#-scoring-system)
- [Detailed Candidate Analysis](#-detailed-candidate-analysis)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [Backend API](#-backend-api)
- [Frontend](#-frontend)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Candidate Screening Flow](#-candidate-screening-flow)
- [API Examples](#-api-examples)
- [Security](#-security)
- [Future Enhancements](#-future-enhancements)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

# 📖 Overview

The **AI Resume Screening System** is a web-based recruitment assistance platform.

The system allows HR users to:

1. Register and log in.
2. Create and manage job descriptions.
3. Upload multiple candidate resumes.
4. Extract text from resumes.
5. Parse candidate information using an LLM.
6. Extract structured requirements from job descriptions.
7. Compare job requirements against candidate profiles.
8. Calculate category-level match scores.
9. Generate an overall candidate score.
10. Generate hiring recommendations.
11. Identify candidate strengths and weaknesses.
12. Generate targeted interview questions.
13. Rank candidates based on their screening scores.
14. View detailed candidate analysis through a web dashboard.

---

# 🎯 Problem Statement

Traditional resume screening is often:

- Time-consuming
- Manual
- Repetitive
- Difficult to scale
- Subject to inconsistent evaluation
- Difficult to compare candidates objectively

For example, an HR professional may need to review hundreds of resumes for a single job opening.

The system addresses this problem by creating an automated AI-assisted screening pipeline.

Instead of manually comparing:

```text
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
