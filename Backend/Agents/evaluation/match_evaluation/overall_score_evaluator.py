import json
from langsmith.schemas import Run, Example


def overall_score_evaluator(run: Run, example: Example):

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
        .get("overall_evaluation", {})
        .get("overall_match_score")
    )

    expected = (
        (example.outputs or {})
        .get("overall_evaluation", {})
        .get("overall_match_score")
    )

    if actual is None or expected is None:
        return {
            "key": "overall_match_score",
            "score": 0,
            "comment": "Missing score."
        }

    difference = abs(actual - expected)

    score = max(
        0,
        1 - (difference / 100)
    )

    return {
        "key": "overall_match_score",
        "score": round(score, 3),
        "comment": (
            f"Expected={expected}, "
            f"Actual={actual}, "
            f"Difference={difference}"
        )
    }