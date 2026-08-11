import json
from langsmith.schemas import Run, Example


def education_evaluator(run: Run, example: Example):

    outputs = run.outputs or {}

    # --------------------------------------------------
    # Get Match Evaluator output
    # --------------------------------------------------

    if isinstance(outputs, dict):
        match_eval = outputs.get("match_evaluation", {})
    else:
        match_eval = {}

    # --------------------------------------------------
    # Handle JSON string
    # --------------------------------------------------

    if isinstance(match_eval, str):
        try:
            match_eval = json.loads(match_eval)
        except Exception:
            match_eval = {}

    # --------------------------------------------------
    # Actual Education Result
    # --------------------------------------------------

    actual = (
        match_eval
        .get("education_and_certifications_analysis", {})
        .get("education_match_status", "")
    )

    # --------------------------------------------------
    # Expected Education Result
    # --------------------------------------------------

    expected = (
        (example.outputs or {})
        .get("education_and_certifications_analysis", {})
        .get("education_match_status", "")
    )

    actual = str(actual).strip().lower()
    expected = str(expected).strip().lower()

    # --------------------------------------------------
    # Score
    # --------------------------------------------------

    score = 1.0 if actual == expected else 0.0

    return {
        "key": "education_match",
        "score": score,
        "comment": (
            f"Expected='{expected}', "
            f"Actual='{actual}'"
        )
    }