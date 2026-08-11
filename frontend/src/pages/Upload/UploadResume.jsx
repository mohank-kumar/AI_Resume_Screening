import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
    uploadResumes,
    getResumeStatus,
    deleteResume
} from "../../api/resumeApi";

import "./UploadResume.css";

function UploadResume() {

    const { jobId } = useParams();

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [statusList, setStatusList] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");


    const handleRemoveFailed = async (resumeId) => {

        try {

            await deleteResume(resumeId);

            setStatusList((prev) =>
                prev.filter(
                    (resume) => resume.id !== resumeId
                )
            );

        } catch (error) {

            console.log(error);

        }

    };


    const handleChange = (e) => {

        const newFiles = Array.from(e.target.files);

        setFiles((previousFiles) => {

            const allFiles = [
                ...previousFiles,
                ...newFiles
            ];

            return allFiles.filter(
                (file, index, self) =>
                    index ===
                    self.findIndex(
                        (f) => f.name === file.name
                    )
            );

        });

        e.target.value = "";

        setErrorMsg("");
        setSuccessMsg("");

    };


    const removeSelectedFile = (fileName) => {

        setFiles((previousFiles) =>
            previousFiles.filter(
                (file) => file.name !== fileName
            )
        );

    };


    const handleUpload = async () => {

        if (files.length === 0) {

            setErrorMsg(
                "Please select at least one resume."
            );

            return;

        }

        try {

            setUploading(true);

            setErrorMsg("");
            setSuccessMsg("");

            await uploadResumes(
                jobId,
                files
            );

            setSuccessMsg(
                "Resumes uploaded successfully. AI screening has started."
            );

        } catch (error) {

            console.log(error);

            const errorMessage =
                error.response?.data?.detail ||
                "Upload failed. Please check the file format.";

            setErrorMsg(errorMessage);

            setUploading(false);

        }

    };


    useEffect(() => {

        if (!uploading) return;

        const interval = setInterval(async () => {

            try {

                const data =
                    await getResumeStatus(jobId);

                setStatusList(data);

                const completed =
                    data.length > 0 &&
                    data.every(
                        (resume) =>
                            resume.status === "Completed" ||
                            resume.status === "Failed"
                    );

                if (completed) {

                    clearInterval(interval);

                    setUploading(false);

                    setSuccessMsg(
                        "All resumes have finished processing."
                    );

                }

            } catch (error) {

                console.log(error);

            }

        }, 2000);


        return () =>
            clearInterval(interval);

    }, [uploading, jobId]);


    const getStatusClass = (status) => {

        switch (status) {

            case "Uploaded":
                return "status-uploaded";

            case "Parsing":
                return "status-parsing";

            case "Screening":
                return "status-screening";

            case "Completed":
                return "status-completed";

            case "Failed":
                return "status-failed";

            default:
                return "";

        }

    };


    return (

        <div className="upload-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="upload-header">

                <p className="upload-eyebrow">
                    RESUME SCREENING
                </p>

                <h1>
                    Upload Resumes
                </h1>

                <p>
                    Upload candidate resumes and let the AI
                    screening pipeline evaluate them automatically.
                </p>

            </div>


            {/* =================================================
                UPLOAD CARD
            ================================================= */}

            <div className="upload-card">

                <div className="upload-card-header">

                    <div>

                        <h2>
                            Candidate Resumes
                        </h2>

                        <p>
                            Supported formats: PDF, DOC, DOCX
                        </p>

                    </div>

                    <span className="file-count">
                        {files.length}{" "}
                        {files.length === 1
                            ? "file"
                            : "files"}
                    </span>

                </div>


                {/* Upload Area */}

                <label
                    className="drop-zone"
                    htmlFor="resume-upload"
                >

                    <div className="upload-icon">
                        ↑
                    </div>

                    <h3>
                        Select Resumes
                    </h3>

                    <p>
                        Click here to choose multiple
                        candidate resumes
                    </p>

                    <span>
                        PDF, DOC or DOCX
                    </span>

                    <input
                        id="resume-upload"
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc"
                        onChange={handleChange}
                    />

                </label>


                {/* Error */}

                {errorMsg && (

                    <div className="upload-alert error">

                        <span className="alert-icon">
                            !
                        </span>

                        {errorMsg}

                    </div>

                )}


                {/* Success */}

                {successMsg && (

                    <div className="upload-alert success">

                        <span className="alert-icon">
                            ✓
                        </span>

                        {successMsg}

                    </div>

                )}


                {/* Selected Files */}

                {files.length > 0 && (

                    <div className="selected-files-section">

                        <div className="section-title-row">

                            <h3>
                                Selected Resumes
                            </h3>

                            <span>
                                {files.length} selected
                            </span>

                        </div>


                        <div className="selected-files">

                            {files.map((file) => (

                                <div
                                    key={file.name}
                                    className="selected-file"
                                >

                                    <div className="file-info">

                                        <div className="file-icon">
                                            PDF
                                        </div>

                                        <div>

                                            <strong>
                                                {file.name}
                                            </strong>

                                            <span>
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}
                                                {" MB"}
                                            </span>

                                        </div>

                                    </div>


                                    {!uploading && (

                                        <button
                                            className="remove-file-btn"
                                            onClick={() =>
                                                removeSelectedFile(
                                                    file.name
                                                )
                                            }
                                        >
                                            ✕
                                        </button>

                                    )}

                                </div>

                            ))}

                        </div>

                    </div>

                )}


                {/* Upload Button */}

                <div className="upload-actions">

                    <button
                        className="start-screening-btn"
                        onClick={handleUpload}
                        disabled={uploading}
                    >

                        {uploading ? (

                            <>
                                <span className="button-spinner"></span>
                                Screening in progress...
                            </>

                        ) : (

                            <>
                                ↑
                                Upload & Start Screening
                            </>

                        )}

                    </button>

                </div>

            </div>


            {/* =================================================
                LIVE SCREENING STATUS
            ================================================= */}

            {statusList.length > 0 && (

                <div className="status-section">

                    <div className="status-header">

                        <div>

                            <p className="status-eyebrow">
                                AI PIPELINE
                            </p>

                            <h2>
                                Live Screening Status
                            </h2>

                        </div>

                        <span className="live-badge">
                            <span></span>
                            {uploading
                                ? "Processing"
                                : "Completed"}
                        </span>

                    </div>


                    <div className="status-list">

                        {statusList.map((resume) => (

                            <div
                                key={resume.id}
                                className="status-card"
                            >

                                <div className="status-file-info">

                                    <div className="status-file-icon">
                                        📄
                                    </div>

                                    <div>

                                        <strong>
                                            {resume.filename}
                                        </strong>

                                        <span>
                                            Resume #{resume.id}
                                        </span>

                                    </div>

                                </div>


                                <div className="status-right">

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            resume.status
                                        )}`}
                                    >

                                        <span></span>

                                        {resume.status}

                                    </span>


                                    {resume.status ===
                                        "Failed" && (

                                        <button
                                            className="remove-failed-btn"
                                            onClick={() =>
                                                handleRemoveFailed(
                                                    resume.id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    );

}

export default UploadResume;