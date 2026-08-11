import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getJobs,
    deleteJob
} from "../../api/jobApi";

import "./Jobs.css";

function Jobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
   


    useEffect(() => {

        loadJobs();

    }, []);


    const loadJobs = async () => {

        try {

            const data = await getJobs();

            setJobs(data);

        } catch (error) {

            console.log(error);

        }

    };


    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Job?")) return;

        try {

            await deleteJob(id);

            loadJobs();

        } catch (error) {

            console.log(error);

        }

    };


    const filteredJobs = jobs.filter((job) =>
        job.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


    return (

        <div className="jobs-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="jobs-header">

                <div>

                    <p className="jobs-eyebrow">
                        JOB MANAGEMENT
                    </p>

                    <h1>
                        Job Descriptions
                    </h1>

                    <p className="jobs-subtitle">
                        Create, manage and screen candidates
                        against your job requirements.
                    </p>

                </div>


                <button
                    className="create-job-btn"
                    onClick={() =>
                        navigate("/jobs/create")
                    }
                >
                    <span>+</span>
                    Create Job
                </button>

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="jobs-toolbar">

                <div className="search-wrapper">

                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        className="search"
                        placeholder="Search job title..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                </div>


                <div className="jobs-count">

                    <strong>
                        {filteredJobs.length}
                    </strong>

                    <span>
                        {filteredJobs.length === 1
                            ? "Job"
                            : "Jobs"}
                    </span>

                </div>

            </div>


            {/* =================================================
                JOB LIST
            ================================================= */}

            <div className="jobs-list">

                {filteredJobs.map((job) => (

                    <div
                        className="job-card"
                        key={job.id}
                    >

                        {/* Job Information */}

                        <div className="job-card-info">

                            <div className="job-card-icon">
                                JD
                            </div>


                            <div className="job-card-details">

                                <h2>
                                    {job.title ||
                                        "Untitled Job"}
                                </h2>

                                <div className="job-meta">

                                    <span>
                                        Job ID #{job.id}
                                    </span>

                                    <span className="meta-divider">
                                        •
                                    </span>

                                    <span>
                                        📄{" "}
                                        {job.resume_count ?? 0}
                                        {" "}
                                        {job.resume_count === 1
                                            ? "Resume"
                                            : "Resumes"}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* Actions */}

                        <div className="actions">

                            <button
                                className="view-jd-btn"
                                onClick={() =>
                                    setSelectedJob(job)
                                }
                            >
                                View JD
                            </button>


                            <button
                                className="upload-btn"
                                onClick={() =>
                                    navigate(
                                        `/jobs/${job.id}/upload`
                                    )
                                }
                            >
                                Upload
                            </button>


                            <button
                                className="candidates-btn"
                                onClick={() =>
                                    navigate(
                                        `/jobs/${job.id}/candidates`
                                    )
                                }
                            >
                                Candidates
                            </button>


                            <button
                                className="edit-btn"
                                onClick={() =>
                                    navigate(
                                        `/jobs/edit/${job.id}`
                                    )
                                }
                            >
                                Edit
                            </button>


                            <button
                                className="delete-btn"
                                onClick={() =>
                                    handleDelete(job.id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}


                {/* Empty State */}

                {filteredJobs.length === 0 && (

                    <div className="no-jobs-msg">

                        <div className="empty-job-icon">
                            📄
                        </div>

                        <h3>
                            No job descriptions found
                        </h3>

                        <p>
                            {searchTerm
                                ? "Try searching with a different job title."
                                : "Create your first job description to start screening candidates."}
                        </p>

                        {!searchTerm && (

                            <button
                                onClick={() =>
                                    navigate(
                                        "/jobs/create"
                                    )
                                }
                            >
                                + Create Job
                                
                            </button>

                            

                        )}

                    </div>

                )}

            </div>
            <div className="jd-modal-footer">
                <button onClick={() => navigate(-1)} className="back-btn">← Back
                </button>
            </div>

            {/* =================================================
                JD DETAILS MODAL
            ================================================= */}

            {selectedJob && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedJob(null)
                    }
                >

                    <div
                        className="jd-modal-content"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Modal Header */}

                        <div className="jd-modal-header">

                            <div>

                                <p className="modal-eyebrow">
                                    JOB DESCRIPTION
                                </p>

                                <h2>
                                    {selectedJob.title}
                                </h2>


                                <div className="jd-meta">

                                    {selectedJob.location && (

                                        <span className="jd-badge location">
                                            📍{" "}
                                            {selectedJob.location}
                                        </span>

                                    )}


                                    <span className="jd-badge resumes">
                                        📄{" "}
                                        {selectedJob.resume_count ?? 0}
                                        {" "}
                                        Resumes
                                    </span>

                                </div>

                            </div>


                            <button
                                className="close-btn"
                                onClick={() =>
                                    setSelectedJob(null)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        {/* Modal Body */}

                        <div className="jd-modal-body">

                            <h3>
                                Job Description
                            </h3>

                            <div className="jd-text">

                                {selectedJob.description}

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div className="jd-modal-footer">

                            <button
                                className="modal-action-btn edit"
                                onClick={() => {

                                    const id =
                                        selectedJob.id;

                                    setSelectedJob(null);

                                    navigate(
                                        `/jobs/edit/${id}`
                                    );

                                }}
                            >
                                Edit JD
                            </button>


                            <button
                                className="modal-action-btn upload"
                                onClick={() => {

                                    const id =
                                        selectedJob.id;

                                    setSelectedJob(null);

                                    navigate(
                                        `/jobs/${id}/upload`
                                    );

                                }}
                            >
                                Upload Resumes
                            </button>


                            <button
                                className="modal-action-btn candidates"
                                onClick={() => {

                                    const id =
                                        selectedJob.id;

                                    setSelectedJob(null);

                                    navigate(
                                        `/jobs/${id}/candidates`
                                    );

                                }}
                            >
                                View Candidates
                            </button>


                            <button
                                className="modal-action-btn close"
                                onClick={() =>
                                    setSelectedJob(null)
                                }
                            >
                                Close
                            </button>

                        </div>
                        
                    </div>

                </div>

            )}

        </div>

    );
}

export default Jobs;