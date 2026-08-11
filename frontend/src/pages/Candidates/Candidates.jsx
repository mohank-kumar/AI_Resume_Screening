import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getRanking,
    getAllCandidates
} from "../../api/screeningApi";

import {
    getJobById,
    getJobs
} from "../../api/jobApi";

import {
    deleteResume
} from "../../api/resumeApi";

import "./Candidates.css";

function Candidates() {

    const navigate = useNavigate();

    const { jobId } = useParams();

    const [ranking, setRanking] = useState([]);
    const [jobTitle, setJobTitle] = useState("");

    const [jobsList, setJobsList] = useState([]);

    const [selectedJobFilter, setSelectedJobFilter] =
        useState("ALL");

    const [searchTerm, setSearchTerm] = useState("");

    const [previewResume, setPreviewResume] =
        useState(null);


    useEffect(() => {

        loadCandidates();
        loadJobsList();

    }, [jobId]);


    const loadJobsList = async () => {

        try {

            const jobsData = await getJobs();

            setJobsList(jobsData || []);

        } catch (error) {

            console.log(
                "Could not load jobs list",
                error
            );

        }

    };


    const loadCandidates = async () => {

        try {

            let data;

            if (jobId) {

                data = await getRanking(jobId);

                try {

                    const jobData =
                        await getJobById(jobId);

                    if (
                        jobData &&
                        jobData.title
                    ) {

                        setJobTitle(
                            jobData.title
                        );

                    }

                } catch (error) {

                    console.log(
                        "Could not fetch job title",
                        error
                    );

                }

            } else {

                data =
                    await getAllCandidates();

                setJobTitle("");

            }

            setRanking(data || []);

        } catch (error) {

            console.log(error);

        }

    };


    const filteredRanking = ranking.filter(
        (candidate) => {

            const titleOfCandidate =
                candidate.job_title ||
                jobTitle ||
                "";

            const matchesJob =
                selectedJobFilter === "ALL" ||
                titleOfCandidate
                    .toLowerCase()
                    .includes(
                        selectedJobFilter.toLowerCase()
                    );

            const matchesSearch =
                !searchTerm ||
                (
                    candidate.candidate_name &&
                    candidate.candidate_name
                        .toLowerCase()
                        .includes(
                            searchTerm.toLowerCase()
                        )
                ) ||
                (
                    titleOfCandidate &&
                    titleOfCandidate
                        .toLowerCase()
                        .includes(
                            searchTerm.toLowerCase()
                        )
                );

            return (
                matchesJob &&
                matchesSearch
            );

        }
    );


    const handleDeleteCandidate =
        async (resumeId) => {

            if (
                !window.confirm(
                    "Are you sure you want to delete this candidate?"
                )
            ) {
                return;
            }

            try {

                await deleteResume(
                    resumeId
                );

                setRanking(
                    (previous) =>
                        previous.filter(
                            (candidate) =>
                                candidate.resume_id !==
                                resumeId
                        )
                );

            } catch (error) {

                console.error(
                    "Could not delete candidate",
                    error
                );

                alert(
                    "Failed to delete candidate. Please try again."
                );

            }

        };


    const getRecommendationClass =
        (recommendation) => {

            if (!recommendation) {
                return "recommendation-default";
            }

            return recommendation
                .toLowerCase()
                .replace(/\s+/g, "-");

        };


    return (

        <div className="candidates-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="candidates-header">

                <div>

                    <p className="candidates-eyebrow">
                        TALENT SCREENING
                    </p>

                    <h1>

                        {jobId && jobTitle
                            ? `Screened Candidates - ${jobTitle}`
                            : "All Screened Candidates"}

                    </h1>

                    <p>

                        {jobId && jobTitle
                            ? `Review candidates screened for ${jobTitle}.`
                            : "Review and compare candidates across all job descriptions."}

                    </p>

                </div>

                <div className="candidate-count">

                    <strong>
                        {filteredRanking.length}
                    </strong>

                    <span>
                        Candidates
                    </span>

                </div>

            </div>


            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div className="candidates-filter-bar">

                <div className="filter-item">

                    <label>
                        JOB TITLE
                    </label>

                    <select
                        value={
                            selectedJobFilter
                        }
                        onChange={(e) =>
                            setSelectedJobFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Job Titles
                        </option>

                        {jobsList.map((job) => (

                            <option
                                key={job.id}
                                value={job.title}
                            >
                                {job.title}
                            </option>

                        ))}

                    </select>

                </div>


                <div className="filter-item search-filter">

                    <label>
                        SEARCH CANDIDATE
                    </label>

                    <div className="search-wrapper">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search candidate or job..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                CANDIDATE TABLE
            ================================================= */}

            <div className="candidates-table-card">

                <div className="table-top">

                    <div>

                        <h2>
                            Candidate Ranking
                        </h2>

                        <p>
                            Candidates are ranked based
                            on their AI screening score.
                        </p>

                    </div>

                    <span className="result-count">

                        {filteredRanking.length} results

                    </span>

                </div>


                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    CANDIDATE
                                </th>

                                <th>
                                    JOB TITLE
                                </th>

                                <th>
                                    RESUME
                                </th>

                                <th>
                                    SCORE
                                </th>

                                <th>
                                    RECOMMENDATION
                                </th>

                                <th>
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredRanking.length > 0 ? (

                                filteredRanking.map(
                                    (candidate, index) => (

                                        <tr
                                            key={
                                                candidate.resume_id
                                            }
                                        >

                                            <td>

                                                <span className="rank-number">

                                                    {candidate.rank ||
                                                        index + 1}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="candidate-name-cell">

                                                    <div className="candidate-avatar">

                                                        {(
                                                            candidate.candidate_name ||
                                                            candidate.filename ||
                                                            "C"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <strong>

                                                            {
                                                                candidate.candidate_name ||
                                                                candidate.filename ||
                                                                `Candidate #${candidate.resume_id}`
                                                            }

                                                        </strong>

                                                        <span>

                                                            Candidate #{candidate.resume_id}

                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="job-title-cell">

                                                    {
                                                        candidate.job_title ||
                                                        jobTitle ||
                                                        "N/A"
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <button
                                                    className="resume-button"
                                                    onClick={() =>
                                                        setPreviewResume(
                                                            candidate
                                                        )
                                                    }
                                                >

                                                    <span>
                                                        📄
                                                    </span>

                                                    <span>
                                                        {candidate.filename ||
                                                            "View Resume"}
                                                    </span>

                                                </button>

                                            </td>


                                            <td>

                                                <div className="score-cell">

                                                    <strong>
                                                        {
                                                            candidate.overall_score
                                                        }%
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>

                                                <span
                                                    className={`recommendation-badge ${getRecommendationClass(
                                                        candidate.recommendation
                                                    )}`}
                                                >

                                                    {
                                                        candidate.recommendation ||
                                                        "N/A"
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <div className="candidate-actions">

                                                    <button
                                                        className="view-report-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/candidate/${candidate.resume_id}`
                                                            )
                                                        }
                                                    >
                                                        View Report
                                                    </button>

                                                    <button
                                                        className="delete-candidate-btn"
                                                        onClick={() =>
                                                            handleDeleteCandidate(
                                                                candidate.resume_id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="empty-candidates"
                                    >

                                        <div>

                                            <div className="empty-icon">
                                                👥
                                            </div>

                                            <h3>
                                                No candidates found
                                            </h3>

                                            <p>
                                                Try changing your
                                                search or job filter.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
            <div className="jd-modal-footer">
                <button onClick={() => navigate(-1)} className="back-btn">← Back
                </button>
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

                                <h3>

                                    {
                                        previewResume.candidate_name ||
                                        previewResume.filename
                                    }

                                </h3>

                                <p>

                                    📄{" "}
                                    {
                                        previewResume.filename
                                    }

                                </p>

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

export default Candidates;