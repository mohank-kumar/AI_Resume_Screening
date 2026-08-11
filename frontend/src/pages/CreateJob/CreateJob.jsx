import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createJob,
    getJobById,
    updateJob
} from "../../api/jobApi";

import "./CreateJob.css";

function CreateJob() {

    const navigate = useNavigate();
    const { jobId } = useParams();

    const isEditMode = Boolean(jobId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");


    useEffect(() => {

        if (!isEditMode) return;

        const loadJobDetails = async () => {

            try {

                setFetching(true);

                const data = await getJobById(jobId);

                setTitle(data.title || "");
                setDescription(data.description || "");

            } catch (error) {

                console.log(error);

                setErrorMsg(
                    "Failed to load job details."
                );

            } finally {

                setFetching(false);

            }

        };

        loadJobDetails();

    }, [jobId, isEditMode]);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setErrorMsg("");

        try {

            if (isEditMode) {

                await updateJob(jobId, {
                    title,
                    description
                });

            } else {

                await createJob({
                    title,
                    description
                });

            }

            setLoading(false);
            setShowSuccessModal(true);

        } catch (error) {

            console.log(error);

            setErrorMsg(
                isEditMode
                    ? "Failed to update job. Please try again."
                    : "Failed to create job. Please try again."
            );

            setLoading(false);

        }

    };


    const handleSuccessConfirm = () => {

        setShowSuccessModal(false);

        navigate("/jobs");

    };


    if (fetching) {

        return (

            <div className="create-job-page">

                <div className="create-job-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading job details...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="create-job-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="create-job-header">

                <div>

                    <p className="create-job-eyebrow">
                        JOB MANAGEMENT
                    </p>

                    <h1>
                        {isEditMode
                            ? "Edit Job Description"
                            : "Create Job Description"}
                    </h1>

                    <p className="create-job-subtitle">

                        {isEditMode
                            ? "Update the job requirements used for resume screening."
                            : "Create a new job opening and define the requirements for resume screening."}

                    </p>

                </div>

            </div>


            {/* =================================================
                FORM CARD
            ================================================= */}

            <div className="create-job-card">

                {errorMsg && (

                    <div className="error-alert">

                        <span className="error-icon">
                            !
                        </span>

                        <span>
                            {errorMsg}
                        </span>

                    </div>

                )}


                <form onSubmit={handleSubmit}>

                    {/* Job Title */}

                    <div className="form-group">

                        <label htmlFor="job-title">
                            Job Title
                        </label>

                        <span className="field-description">
                            Enter the position you are hiring for.
                        </span>

                        <input
                            id="job-title"
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="e.g. Python Developer"
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Job Description */}

                    <div className="form-group">

                        <div className="description-label-row">

                            <div>

                                <label htmlFor="job-description">
                                    Job Description
                                </label>

                                <span className="field-description">
                                    Include responsibilities,
                                    requirements, skills and
                                    qualifications.
                                </span>

                            </div>

                            <span className="required-badge">
                                Required
                            </span>

                        </div>


                        <textarea
                            id="job-description"
                            rows="14"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Paste the complete Job Description here..."
                            required
                            disabled={loading}
                        />

                        <div className="character-info">

                            {description.length} characters

                        </div>

                    </div>


                    {/* Buttons */}

                    <div className="button-group">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/jobs")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >

                            {loading
                                ? (
                                    <>
                                        <span className="button-spinner"></span>

                                        {isEditMode
                                            ? "Updating..."
                                            : "Saving..."
                                        }
                                    </>
                                )
                                : (
                                    isEditMode
                                        ? "Update Job"
                                        : "Save Job"
                                )
                            }

                        </button>

                    </div>

                </form>

            </div>


            {/* =================================================
                SUCCESS MODAL
            ================================================= */}

            {showSuccessModal && (

                <div className="modal-overlay">

                    <div className="modal-content">

                        <div className="modal-icon">
                            ✓
                        </div>

                        <h2>
                            {isEditMode
                                ? "Job Updated Successfully!"
                                : "Job Created Successfully!"
                            }
                        </h2>

                        <p>

                            {isEditMode
                                ? "Your job description has been updated."
                                : "Your new job description has been saved."
                            }

                        </p>

                        <button
                            className="modal-ok-btn"
                            onClick={
                                handleSuccessConfirm
                            }
                        >
                            Continue
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}

export default CreateJob;