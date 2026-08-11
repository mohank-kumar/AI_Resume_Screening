import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AnalyticsCard from "../../components/AnalyticsCard/AnalyticsCard";

import {
    getRecentJobs,
    getScreeningStatus,
    getTopCandidates,
    getAverageScore
} from "../../api/dashboardApi";

function Dashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [topCandidates, setTopCandidates] = useState([]);
    const [averageScore, setAverageScore] = useState(0);

    const [previewResume, setPreviewResume] = useState(null);

    const [status, setStatus] = useState({
        completed: 0,
        screening: 0,
        parsing: 0,
        uploaded: 0,
        failed: 0
    });


    useEffect(() => {

        loadJobs();
        loadStatus();
        loadTopCandidates();
        loadAverageScore();

    }, []);


    const loadJobs = async () => {

        try {

            const data = await getRecentJobs();

            setJobs(data);

        } catch (error) {

            console.log(error);

        }

    };


    const loadAverageScore = async () => {

        try {

            const data = await getAverageScore();

            setAverageScore(data.average_score);

        } catch (error) {

            console.log(error);

        }

    };


    const loadTopCandidates = async () => {

        try {

            const data = await getTopCandidates();

            setTopCandidates(data);

        } catch (error) {

            console.log(error);

        }

    };


    const loadStatus = async () => {

        try {

            const data = await getScreeningStatus();

            setStatus(data);

        } catch (error) {

            console.log(error);

        }

    };


    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );


    const totalCandidates = jobs.reduce(
        (total, job) =>
            total + (job.resume_count || 0),
        0
    );


    return (

        <div className="dashboard-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-eyebrow">
                        AI RECRUITMENT DASHBOARD
                    </p>

                    <h1>
                        Welcome back,{" "}
                        {user?.full_name || "HR Admin"} 👋
                    </h1>

                    <p className="dashboard-subtitle">
                        Monitor your recruitment pipeline and
                        review AI-powered candidate screening.
                    </p>

                </div>


                <button
                    className="create-job-header-btn"
                    onClick={() =>
                        navigate("/jobs/create")
                    }
                >
                    <span>+</span>
                    Create Job
                </button>

            </div>


            {/* =================================================
                KPI CARDS
            ================================================= */}

            <div className="dashboard-cards">

                <AnalyticsCard
                    title="Total Jobs"
                    value={jobs.length}
                    color="#3B82F6"
                />

                <AnalyticsCard
                    title="Total Candidates"
                    value={totalCandidates}
                    color="#10B981"
                />

            </div>



            {/* =================================================
                RECENT JOBS
            ================================================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <p className="section-eyebrow">
                            JOB MANAGEMENT
                        </p>

                        <h2>
                            Recent Job Descriptions
                        </h2>

                    </div>


                    <button
                        className="section-action-btn"
                        onClick={() =>
                            navigate("/jobs")
                        }
                    >
                        View All Jobs →
                    </button>

                </div>


                <div className="table-wrapper">

                    <table className="dashboard-table">

                        <thead>

                            <tr>

                                <th>Job Title</th>

                                <th>Candidates</th>

                                <th>Action</th>

                            </tr>

                        </thead>


                        <tbody>

                            {jobs.map((job) => (

                                <tr key={job.id}>

                                    <td>

                                        <div className="job-title-cell">

                                            <div className="job-icon">
                                                JD
                                            </div>

                                            <div>

                                                <strong>
                                                    {job.title ||
                                                        "Untitled Job"}
                                                </strong>

                                                <span>
                                                    Job ID #{job.id}
                                                </span>

                                            </div>

                                        </div>

                                    </td>


                                    <td>

                                        <span className="candidate-count">

                                            {job.resume_count ?? 0}

                                            <small>
                                                candidates
                                            </small>

                                        </span>

                                    </td>


                                    <td>

                                        <button
                                            className="table-view-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/jobs/${job.id}/candidates`
                                                )
                                            }
                                        >
                                            View Candidates
                                        </button>

                                    </td>

                                </tr>

                            ))}


                            {jobs.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="empty-table"
                                    >

                                        <div className="empty-icon">
                                            📄
                                        </div>

                                        <strong>
                                            No jobs found
                                        </strong>

                                        <span>
                                            Create your first Job
                                            Description to start
                                            screening candidates.
                                        </span>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/jobs/create"
                                                )
                                            }
                                        >
                                            + Create Job
                                        </button>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                TOP CANDIDATES
            ================================================= */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <p className="section-eyebrow">
                            AI RANKING
                        </p>

                        <h2>
                            Top Ranked Candidates
                        </h2>

                    </div>


                    <button
                        className="section-action-btn"
                        onClick={() =>
                            navigate("/candidates")
                        }
                    >
                        View All Candidates →
                    </button>

                </div>


                <div className="table-wrapper">

                    <table className="dashboard-table">

                        <thead>

                            <tr>

                                <th>Rank</th>

                                <th>Candidate</th>

                                <th>Job</th>

                                <th>Resume</th>

                                <th>Match Score</th>

                            </tr>

                        </thead>


                        <tbody>

                            {topCandidates.map(
                                (candidate) => (

                                    <tr
                                        key={
                                            candidate.resume_id
                                        }
                                    >

                                        <td>

                                            <div
                                                className={
                                                    candidate.rank <= 3
                                                        ? "rank-badge top-rank"
                                                        : "rank-badge"
                                                }
                                            >
                                                #{candidate.rank}
                                            </div>

                                        </td>


                                        <td>

                                            <div className="candidate-table-cell">

                                                <div className="mini-avatar">
                                                    {(candidate.candidate_name ||
                                                        "C")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <strong>
                                                    {candidate.candidate_name ||
                                                        "Unknown Candidate"}
                                                </strong>

                                            </div>

                                        </td>


                                        <td>

                                            <span className="job-name">
                                                {candidate.job_title ||
                                                    "N/A"}
                                            </span>

                                        </td>


                                        <td>

                                            <button
                                                className="resume-link-btn"
                                                onClick={() =>
                                                    setPreviewResume(
                                                        candidate
                                                    )
                                                }
                                            >
                                                📄{" "}
                                                {candidate.filename ||
                                                    "View Resume"}
                                            </button>

                                        </td>


                                        <td>

                                            <span
                                                className={`score-pill ${
                                                    candidate.score >= 85
                                                        ? "score-excellent"
                                                        : candidate.score >= 70
                                                        ? "score-good"
                                                        : candidate.score >= 55
                                                        ? "score-average"
                                                        : "score-low"
                                                }`}
                                            >
                                                {candidate.score}%
                                            </span>

                                        </td>

                                    </tr>

                                )
                            )}


                            {topCandidates.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="empty-table"
                                    >

                                        <div className="empty-icon">
                                            👥
                                        </div>

                                        <strong>
                                            No screened candidates
                                        </strong>

                                        <span>
                                            Candidate rankings will
                                            appear here after screening.
                                        </span>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                RESUME PREVIEW MODAL
            ================================================= */}

            {previewResume && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setPreviewResume(null)
                    }
                >

                    <div
                        className="resume-modal-container"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="resume-modal-header">

                            <div>

                                <p>
                                    RESUME PREVIEW
                                </p>

                                <h3>
                                    {previewResume.candidate_name ||
                                        previewResume.filename}
                                </h3>

                                <span>
                                    📄{" "}
                                    {previewResume.filename}
                                </span>

                            </div>


                            <button
                                className="close-modal-btn"
                                onClick={() =>
                                    setPreviewResume(null)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div className="resume-modal-body">

                            <iframe
                                src={`http://127.0.0.1:8000/resumes/${previewResume.resume_id}/view`}
                                title={
                                    previewResume.filename
                                }
                                width="100%"
                                height="100%"
                            />

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Dashboard;