import json
from langsmith.schemas import Run, Example


def experience_evaluator(run: Run, example: Example):

    outputs = run.outputs or {}

    if isinstance(outputs, dict):
        match_eval = outputs.get("match_evaluation", {})
    else:
        match_eval = {}

    if isinstance(match_eval, str):
        try:
            match_eval = json.loads(match_eval)
        except Exception:
            match_eval = {}

    actual = (
        match_eval
        .get("experience_analysis", {})
    )

    expected = (
        (example.outputs or {})
        .get("experience_analysis", {})
    )

    score = 0
    total = 4

    comments = []

    # Required Years
    if actual.get("jd_required_years") == expected.get("jd_required_years"):
        score += 1
    else:
        comments.append(
            f"JD Years Expected={expected.get('jd_required_years')} "
            f"Actual={actual.get('jd_required_years')}"
        )

    # Candidate Years
    if actual.get("candidate_total_years") == expected.get("candidate_total_years"):
        score += 1
    else:
        comments.append(
            f"Candidate Years Expected={expected.get('candidate_total_years')} "
            f"Actual={actual.get('candidate_total_years')}"
        )

    # Experience Status
    if (
        str(actual.get("experience_match_status", "")).lower()
        ==
        str(expected.get("experience_match_status", "")).lower()
    ):
        score += 1
    else:
        comments.append(
            f"Status Expected={expected.get('experience_match_status')} "
            f"Actual={actual.get('experience_match_status')}"
        )

    # Seniority
    if (
        str(actual.get("seniority_fit", "")).lower()
        ==
        str(expected.get("seniority_fit", "")).lower()
    ):
        score += 1
    else:
        comments.append(
            f"Seniority Expected={expected.get('seniority_fit')} "
            f"Actual={actual.get('seniority_fit')}"
        )

    final_score = score / total

    return {
        "key": "experience_match",
        "score": final_score,
        "comment": (
            "Perfect Match"
            if final_score == 1
            else " | ".join(comments)
        )
    }

