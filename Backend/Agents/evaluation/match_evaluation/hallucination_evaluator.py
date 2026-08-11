import json
from langsmith.schemas import Run, Example


def hallucination_evaluator(run: Run, example: Example):

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

    # -----------------------------
    # Original Inputs
    # -----------------------------

    jd = (
        json.dumps(
            example.inputs.get("extracted_jd", {})
        ).lower()
    )

    resume = (
        json.dumps(
            example.inputs.get("parsed_resume", {})
        ).lower()
    )

    source = jd + "\n" + resume

    # -----------------------------
    # Predictions
    # -----------------------------

    predicted = []

    skills = match_eval.get(
        "skills_analysis",
        {}
    )

    predicted.extend(
        skills.get(
            "matched_mandatory_skills",
            []
        )
    )

    predicted.extend(
        skills.get(
            "missing_mandatory_skills",
            []
        )
    )

    predicted.extend(
        skills.get(
            "matched_preferred_skills",
            []
        )
    )

    predicted.extend(
        skills.get(
            "missing_preferred_skills",
            []
        )
    )

    domain = match_eval.get(
        "domain_fit_analysis",
        {}
    )

    predicted.extend(
        domain.get(
            "jd_target_domains",
            []
        )
    )

    predicted.extend(
        domain.get(
            "candidate_domains",
            []
        )
    )

    # -----------------------------
    # Hallucination Check
    # -----------------------------

    hallucinated = []

    for item in predicted:

        if (
            isinstance(item, str)
            and item.lower() not in source
        ):
            hallucinated.append(item)

    if predicted:

        score = (
            1 -
            (
                len(hallucinated)
                /
                len(predicted)
            )
        )

    else:

        score = 1

    return {

        "key": "hallucination_score",

        "score": round(score, 3),

        "comment":
            f"Hallucinated: {hallucinated}"

    }