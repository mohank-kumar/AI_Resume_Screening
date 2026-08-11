import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getCandidate } from "../../api/screeningApi";

import "./CandidateDetails.css";

function CandidateDetails() {
    const { resumeId } = useParams();

    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        loadCandidate();
    }, []);

    const loadCandidate = async () => {
        try {
            const data = await getCandidate(resumeId);
            setCandidate(data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!candidate) {
        return (
            <div className="candidate-loading">
                <div className="loading-spinner"></div>
                <p>Loading candidate report...</p>
            </div>
        );
    }

    const analysis = candidate.category_analysis || {};
    const technical = analysis.technical_skills || {};
    const experience = analysis.experience || {};
    const education = analysis.education || {};
    const domain = analysis.domain_fit || {};

    const getScoreClass = (score) => {
        if (score >= 85) return "score-excellent";
        if (score >= 70) return "score-good";
        if (score >= 50) return "score-average";
        return "score-low";
    };

    const getRecommendationClass = (recommendation = "") => {
        const value = recommendation.toLowerCase();

        if (value.includes("strong")) return "recommendation-strong";
        if (value.includes("hire") || value.includes("recommend"))
            return "recommendation-good";
        if (value.includes("shortlist")) return "recommendation-shortlist";
        if (value.includes("consider")) return "recommendation-consider";

        return "recommendation-reject";
    };

    const ScoreCard = ({ title, score, icon }) => (
        <div className="score-item-card">
            <div className="score-item-top">
                <span className="score-icon">{icon}</span>
                <span className="score-label">{title}</span>
            </div>

            <div className={`score-number ${getScoreClass(score)}`}>
                {score}%
            </div>

            <div className="score-progress">
                <div
                    className={`score-progress-fill ${getScoreClass(score)}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );

    const SkillBadge = ({ children, type = "neutral" }) => (
        <span className={`skill-badge skill-${type}`}>
            {children}
        </span>
    );

    const EmptyState = ({ text = "No information available" }) => (
        <span className="empty-text">{text}</span>
    );

    return (
        <div className="candidate-details">

            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <div className="report-header">

                <div className="candidate-identity">

                    <div className="candidate-avatar">
                        {(candidate.candidate_name ||
                            candidate.filename ||
                            "C"
                        )
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <p className="report-label">
                            AI CANDIDATE SCREENING REPORT
                        </p>

                        <h1>
                            {candidate.candidate_name ||
                                candidate.filename ||
                                "Candidate Details"}
                        </h1>

                        <p className="candidate-file">
                            {candidate.filename || "Resume"}
                        </p>
                    </div>

                </div>

                <div
                    className={`recommendation-badge ${getRecommendationClass(
                        candidate.recommendation
                    )}`}
                >
                    <span className="recommendation-dot"></span>
                    {candidate.recommendation}
                </div>

            </div>


            {/* ================================================= */}
            {/* CONTACT */}
            {/* ================================================= */}

            <div className="contact-card">

                <div className="contact-item">
                    <div className="contact-icon">✉</div>

                    <div>
                        <span>Email</span>
                        <strong>
                            {candidate.email || "Not Provided"}
                        </strong>
                    </div>
                </div>

                <div className="contact-divider"></div>

                <div className="contact-item">
                    <div className="contact-icon">☎</div>

                    <div>
                        <span>Phone</span>
                        <strong>
                            {candidate.phone || "Not Provided"}
                        </strong>
                    </div>
                </div>

            </div>


            {/* ================================================= */}
            {/* OVERALL SCORE */}
            {/* ================================================= */}

            <div className="overall-card">

                <div className="overall-score-section">

                    <div
                        className={`score-circle ${getScoreClass(
                            candidate.overall_score
                        )}`}
                        style={{
                            "--score": `${candidate.overall_score}%`
                        }}
                    >
                        <div className="score-circle-inner">
                            <strong>
                                {candidate.overall_score}
                            </strong>
                            <span>/ 100</span>
                        </div>
                    </div>

                    <div className="overall-text">
                        <p className="report-label">
                            OVERALL MATCH
                        </p>

                        <h2>
                            Candidate Suitability
                        </h2>

                        <p>
                            AI-generated assessment based on technical
                            skills, experience, education and domain fit.
                        </p>
                    </div>

                </div>

                <div className="overall-summary">

                    <div>
                        <span>Overall Score</span>
                        <strong>
                            {candidate.overall_score}%
                        </strong>
                    </div>

                    <div>
                        <span>Recommendation</span>
                        <strong>
                            {candidate.recommendation}
                        </strong>
                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* CATEGORY SCORES */}
            {/* ================================================= */}

            <section className="report-section">

                <div className="section-heading">
                    <div>
                        <p className="report-label">EVALUATION</p>
                        <h2>Category Scores</h2>
                    </div>
                </div>

                <div className="score-grid">

                    <ScoreCard
                        title="Technical Skills"
                        score={candidate.technical_score}
                        icon="⚙"
                    />

                    <ScoreCard
                        title="Experience"
                        score={candidate.experience_score}
                        icon="◷"
                    />

                    <ScoreCard
                        title="Education"
                        score={candidate.education_score}
                        icon="◆"
                    />

                    <ScoreCard
                        title="Domain Fit"
                        score={candidate.domain_score}
                        icon="◎"
                    />

                </div>

            </section>


            {/* ================================================= */}
            {/* TECHNICAL SKILLS */}
            {/* ================================================= */}

            <section className="analysis-card">

                <div className="analysis-header">

                    <div className="analysis-title">

                        <div className="analysis-icon technical-icon">
                            ⚙
                        </div>

                        <div>
                            <p className="report-label">
                                CATEGORY ANALYSIS
                            </p>

                            <h2>Technical Skills</h2>
                        </div>

                    </div>

                    <div
                        className={`analysis-score ${getScoreClass(
                            technical.score ??
                            candidate.technical_score
                        )}`}
                    >
                        {technical.score ??
                            candidate.technical_score}%
                    </div>

                </div>


                <div className="comparison-grid">

                    <div className="comparison-panel">

                        <h3>JD Required Skills</h3>

                        <div className="badge-container">

                            {technical.jd_required_skills?.length ? (
                                technical.jd_required_skills.map(
                                    (skill, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="required"
                                        >
                                            {skill}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState />
                            )}

                        </div>

                    </div>


                    <div className="comparison-panel">

                        <h3>Candidate Skills</h3>

                        <div className="badge-container">

                            {technical.candidate_skills?.length ? (
                                technical.candidate_skills.map(
                                    (skill, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="candidate"
                                        >
                                            {skill}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState />
                            )}

                        </div>

                    </div>

                </div>


                <div className="match-grid">

                    <div className="match-box matched-box">

                        <h3>
                            <span>✓</span>
                            Matched Mandatory Skills
                        </h3>

                        <div className="badge-container">

                            {technical.matched_mandatory_skills?.length ? (
                                technical.matched_mandatory_skills.map(
                                    (skill, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="matched"
                                        >
                                            {skill}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="No mandatory skills matched" />
                            )}

                        </div>

                    </div>


                    <div className="match-box missing-box">

                        <h3>
                            <span>×</span>
                            Missing Mandatory Skills
                        </h3>

                        <div className="badge-container">

                            {technical.missing_mandatory_skills?.length ? (
                                technical.missing_mandatory_skills.map(
                                    (skill, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="missing"
                                        >
                                            {skill}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="No missing mandatory skills" />
                            )}

                        </div>

                    </div>

                </div>


                <div className="match-grid">

                    <div className="match-box preferred-box">

                        <h3>
                            <span>✓</span>
                            Matched Preferred Skills
                        </h3>

                        <div className="badge-container">

                            {technical.matched_preferred_skills?.length ? (
                                technical.matched_preferred_skills.map(
                                    (skill, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="matched"
                                        >
                                            {skill}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="No preferred skills matched" />
                            )}

                        </div>

                    </div>


                    <div className="match-box missing-box">

                        <h3>
                            <span>×</span>
                            Missing Preferred Skills
                        </h3>

                        <div className="badge-container">

                            {technical.missing_preferred_skills?.length ? (
                                technical.missing_preferred_skills.map(
                                    (skill, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="missing"
                                        >
                                            {skill}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="No missing preferred skills" />
                            )}

                        </div>

                    </div>

                </div>


                {technical.additional_candidate_skills?.length > 0 && (

                    <div className="additional-skills">

                        <h3>Additional Candidate Skills</h3>

                        <div className="badge-container">

                            {technical.additional_candidate_skills.map(
                                (skill, index) => (
                                    <SkillBadge
                                        key={index}
                                        type="additional"
                                    >
                                        {skill}
                                    </SkillBadge>
                                )
                            )}

                        </div>

                    </div>

                )}


                <div className="ai-analysis">

                    <div className="ai-analysis-icon">✦</div>

                    <div>
                        <h3>AI Analysis</h3>

                        <p>
                            {technical.explanation ||
                                "No technical skills analysis available."}
                        </p>
                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* EXPERIENCE */}
            {/* ================================================= */}

            <section className="analysis-card">

                <div className="analysis-header">

                    <div className="analysis-title">

                        <div className="analysis-icon experience-icon">
                            ◷
                        </div>

                        <div>
                            <p className="report-label">
                                CATEGORY ANALYSIS
                            </p>

                            <h2>Experience</h2>
                        </div>

                    </div>

                    <div
                        className={`analysis-score ${getScoreClass(
                            experience.score ??
                            candidate.experience_score
                        )}`}
                    >
                        {experience.score ??
                            candidate.experience_score}%
                    </div>

                </div>


                <div className="experience-comparison">

                    <div className="experience-column">

                        <span>JD Requirement</span>

                        <strong>
                            {experience.jd_required_years ??
                                "Not specified"}
                            {" "}
                            years
                        </strong>

                    </div>

                    <div className="experience-arrow">
                        →
                    </div>

                    <div className="experience-column">

                        <span>Candidate Experience</span>

                        <strong>
                            {experience.candidate_total_years ??
                                "Not specified"}
                            {" "}
                            years
                        </strong>

                    </div>

                </div>


                <div className="status-row">

                    <div>
                        <span>Experience Status</span>

                        <strong className="status-value">
                            {experience.experience_match_status ||
                                "Not available"}
                        </strong>
                    </div>

                    <div>
                        <span>Seniority Fit</span>

                        <strong className="status-value">
                            {experience.seniority_fit ||
                                "Not available"}
                        </strong>
                    </div>

                </div>


                {experience.candidate_roles?.length > 0 && (

                    <div className="info-list">

                        <h3>Candidate Roles</h3>

                        {experience.candidate_roles.map(
                            (role, index) => (
                                <div
                                    className="info-list-item"
                                    key={index}
                                >
                                    <span>●</span>
                                    {role}
                                </div>
                            )
                        )}

                    </div>

                )}


                {experience.relevant_responsibilities?.length > 0 && (

                    <div className="info-list">

                        <h3>Relevant Responsibilities</h3>

                        {experience.relevant_responsibilities.map(
                            (responsibility, index) => (
                                <div
                                    className="info-list-item"
                                    key={index}
                                >
                                    <span>●</span>
                                    {responsibility}
                                </div>
                            )
                        )}

                    </div>

                )}


                <div className="ai-analysis">

                    <div className="ai-analysis-icon">✦</div>

                    <div>
                        <h3>AI Analysis</h3>

                        <p>
                            {experience.explanation ||
                                "No experience analysis available."}
                        </p>
                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* EDUCATION */}
            {/* ================================================= */}

            <section className="analysis-card">

                <div className="analysis-header">

                    <div className="analysis-title">

                        <div className="analysis-icon education-icon">
                            ◆
                        </div>

                        <div>
                            <p className="report-label">
                                CATEGORY ANALYSIS
                            </p>

                            <h2>Education</h2>
                        </div>

                    </div>

                    <div
                        className={`analysis-score ${getScoreClass(
                            education.score ??
                            candidate.education_score
                        )}`}
                    >
                        {education.score ??
                            candidate.education_score}%
                    </div>

                </div>


                <div className="education-grid">

                    <div className="education-column">

                        <span>JD Requirement</span>

                        <strong>
                            {education.jd_required_degree ||
                                "Not specified"}
                        </strong>

                        <small>
                            {education.jd_required_field_of_study ||
                                "Field not specified"}
                        </small>

                    </div>


                    <div className="education-column">

                        <span>Candidate</span>

                        <strong>
                            {education.candidate_degree ||
                                "Not specified"}
                        </strong>

                        <small>
                            {education.candidate_field_of_study ||
                                "Field not specified"}
                        </small>

                    </div>

                </div>


                <div className="education-status">

                    <span>Education Status</span>

                    <strong>
                        {education.education_match_status ||
                            "Not available"}
                    </strong>

                </div>


                <div className="certification-grid">

                    <div>

                        <h3>Required Certifications</h3>

                        <div className="badge-container">

                            {education.certifications_required?.length ? (
                                education.certifications_required.map(
                                    (cert, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="required"
                                        >
                                            {cert}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="None specified" />
                            )}

                        </div>

                    </div>


                    <div>

                        <h3>Candidate Certifications</h3>

                        <div className="badge-container">

                            {education.candidate_certifications?.length ? (
                                education.candidate_certifications.map(
                                    (cert, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="candidate"
                                        >
                                            {cert}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="None specified" />
                            )}

                        </div>

                    </div>

                </div>


                <div className="ai-analysis">

                    <div className="ai-analysis-icon">✦</div>

                    <div>
                        <h3>AI Analysis</h3>

                        <p>
                            {education.explanation ||
                                "No education analysis available."}
                        </p>
                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* DOMAIN FIT */}
            {/* ================================================= */}

            <section className="analysis-card">

                <div className="analysis-header">

                    <div className="analysis-title">

                        <div className="analysis-icon domain-icon">
                            ◎
                        </div>

                        <div>
                            <p className="report-label">
                                CATEGORY ANALYSIS
                            </p>

                            <h2>Domain Fit</h2>
                        </div>

                    </div>

                    <div
                        className={`analysis-score ${getScoreClass(
                            domain.score ??
                            candidate.domain_score
                        )}`}
                    >
                        {domain.score ??
                            candidate.domain_score}%
                    </div>

                </div>


                <div className="comparison-grid">

                    <div className="comparison-panel">

                        <h3>JD Target Domains</h3>

                        <div className="badge-container">

                            {domain.jd_target_domains?.length ? (
                                domain.jd_target_domains.map(
                                    (item, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="required"
                                        >
                                            {item}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState />
                            )}

                        </div>

                    </div>


                    <div className="comparison-panel">

                        <h3>Candidate Domains</h3>

                        <div className="badge-container">

                            {domain.candidate_domains?.length ? (
                                domain.candidate_domains.map(
                                    (item, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="candidate"
                                        >
                                            {item}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState />
                            )}

                        </div>

                    </div>

                </div>


                <div className="match-grid">

                    <div className="match-box matched-box">

                        <h3>
                            <span>✓</span>
                            Matched Domains
                        </h3>

                        <div className="badge-container">

                            {domain.matched_domains?.length ? (
                                domain.matched_domains.map(
                                    (item, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="matched"
                                        >
                                            {item}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="No matched domains" />
                            )}

                        </div>

                    </div>


                    <div className="match-box missing-box">

                        <h3>
                            <span>×</span>
                            Missing Domains
                        </h3>

                        <div className="badge-container">

                            {domain.missing_domains?.length ? (
                                domain.missing_domains.map(
                                    (item, index) => (
                                        <SkillBadge
                                            key={index}
                                            type="missing"
                                        >
                                            {item}
                                        </SkillBadge>
                                    )
                                )
                            ) : (
                                <EmptyState text="No missing domains" />
                            )}

                        </div>

                    </div>

                </div>


                <div className="ai-analysis">

                    <div className="ai-analysis-icon">✦</div>

                    <div>
                        <h3>AI Analysis</h3>

                        <p>
                            {domain.explanation ||
                                "No domain analysis available."}
                        </p>
                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* EXECUTIVE SUMMARY */}
            {/* ================================================= */}

            <section className="content-card">

                <div className="content-card-header">
                    <div className="section-icon">✦</div>

                    <div>
                        <p className="report-label">
                            HIRING MANAGER VIEW
                        </p>

                        <h2>Executive Summary</h2>
                    </div>
                </div>

                <p className="summary-text">
                    {candidate.executive_summary}
                </p>

            </section>


            {/* ================================================= */}
            {/* STRENGTHS + RISKS */}
            {/* ================================================= */}

            <div className="two-column-sections">

                <section className="content-card strength-card">

                    <div className="content-card-header">

                        <div className="section-icon success-icon">
                            ✓
                        </div>

                        <div>
                            <p className="report-label">
                                POSITIVE SIGNALS
                            </p>

                            <h2>Top Strengths</h2>
                        </div>

                    </div>

                    <div className="bullet-list">

                        {candidate.strengths?.length ? (
                            candidate.strengths.map(
                                (item, index) => (
                                    <div
                                        className="bullet-item"
                                        key={index}
                                    >
                                        <span>✓</span>
                                        <p>{item}</p>
                                    </div>
                                )
                            )
                        ) : (
                            <EmptyState />
                        )}

                    </div>

                </section>


                <section className="content-card risk-card">

                    <div className="content-card-header">

                        <div className="section-icon risk-icon">
                            !
                        </div>

                        <div>
                            <p className="report-label">
                                AREAS TO WATCH
                            </p>

                            <h2>Key Risks & Gaps</h2>
                        </div>

                    </div>

                    <div className="bullet-list">

                        {candidate.weaknesses?.length ? (
                            candidate.weaknesses.map(
                                (item, index) => (
                                    <div
                                        className="bullet-item"
                                        key={index}
                                    >
                                        <span>!</span>
                                        <p>{item}</p>
                                    </div>
                                )
                            )
                        ) : (
                            <EmptyState text="No significant risks identified" />
                        )}

                    </div>

                </section>

            </div>


            {/* ================================================= */}
            {/* INTERVIEW QUESTIONS */}
            {/* ================================================= */}

            <section className="content-card">

                <div className="content-card-header">

                    <div className="section-icon interview-icon">
                        ?
                    </div>

                    <div>
                        <p className="report-label">
                            INTERVIEW PREPARATION
                        </p>

                        <h2>Recommended Interview Questions</h2>
                    </div>

                </div>


                <div className="questions-list">

                    {candidate.interview_questions?.length ? (
                        candidate.interview_questions.map(
                            (question, index) => (

                                <div
                                    className="interview-card"
                                    key={index}
                                >

                                    <div className="question-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div className="question-content">

                                        <span className="question-focus">
                                            {question.focus_area}
                                        </span>

                                        <h3>
                                            {question.question}
                                        </h3>

                                        <div className="look-for">

                                            <strong>
                                                What to look for
                                            </strong>

                                            <p>
                                                {question.what_to_look_for}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )
                        )
                    ) : (
                        <EmptyState text="No interview questions available" />
                    )}

                </div>

            </section>

        </div>
    );
}

export default CandidateDetails;