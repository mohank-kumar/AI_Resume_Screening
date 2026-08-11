import json
from langsmith.schemas import Run, Example


def recommendation_evaluator(run: Run, example: Example):

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
            clean_text = match_eval.strip()

            if clean_text.startswith("```"):
                lines = clean_text.splitlines()

                if lines[0].startswith("```"):
                    lines = lines[1:]

                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]

                clean_text = "\n".join(lines).strip()

            match_eval = json.loads(clean_text)

        except Exception:
            match_eval = {}

    if not isinstance(match_eval, dict):
        match_eval = {}

    # --------------------------------------------------
    # Get actual overall score
    # --------------------------------------------------

    overall_evaluation = match_eval.get(
        "overall_evaluation",
        {}
    )

    if not isinstance(overall_evaluation, dict):
        overall_evaluation = {}

    actual_score = overall_evaluation.get(
        "overall_match_score",
        None
    )

    actual_recommendation = overall_evaluation.get(
        "recommendation",
        ""
    )

    if not isinstance(actual_recommendation, str):
        actual_recommendation = ""

    actual_recommendation = (
        actual_recommendation.strip().lower()
    )

    # --------------------------------------------------
    # Validate score
    # --------------------------------------------------

    try:
        actual_score = float(actual_score)
    except (TypeError, ValueError):
        actual_score = None

    # --------------------------------------------------
    # Convert score → expected recommendation
    # --------------------------------------------------

    def recommendation_from_score(score):

        if score is None:
            return None

        if 85 <= score <= 100:
            return "strong hire"

        elif 70 <= score < 85:
            return "hire"

        elif 55 <= score < 70:
            return "shortlist"

        elif 40 <= score < 55:
            return "consider"

        elif 0 <= score < 40:
            return "reject"

        return None

    expected_recommendation = recommendation_from_score(
        actual_score
    )

    # --------------------------------------------------
    # Calculate score
    # --------------------------------------------------

    if expected_recommendation is None:

        score = 0.0

        comment = (
            f"Invalid overall_match_score="
            f"'{actual_score}'"
        )

    elif actual_recommendation == expected_recommendation:

        score = 1.0

        comment = (
            f"Score={actual_score}, "
            f"Expected Recommendation="
            f"'{expected_recommendation}', "
            f"Actual Recommendation="
            f"'{actual_recommendation}'"
        )

    else:

        score = 0.0

        comment = (
            f"Score={actual_score}, "
            f"Expected Recommendation="
            f"'{expected_recommendation}', "
            f"Actual Recommendation="
            f"'{actual_recommendation}'"
        )

    # --------------------------------------------------
    # Return LangSmith Evaluation
    # --------------------------------------------------

    return {
        "key": "recommendation_match",
        "score": score,
        "comment": comment
    }