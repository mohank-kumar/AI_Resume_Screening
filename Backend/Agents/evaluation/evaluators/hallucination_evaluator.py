from langsmith.schemas import Run, Example


def hallucination_evaluator(run: Run, example: Example):
    """
    Checks whether the Extractor/Parser produced skills or items
    that never appeared in the original input text (JD or Resume).
    """
    ex_inputs = example.inputs or {}
    source_text = str(ex_inputs.get("job_description") or ex_inputs.get("resume") or "").lower()

    run_outputs = run.outputs or {}
    output = run_outputs.get("extracted_jd") or run_outputs.get("parsed_resume") or run_outputs
    if not isinstance(output, dict):
        output = {}

    all_predictions = []

    skills_dict = output.get("skills", {})
    if isinstance(skills_dict, dict):
        for key in ["mandatory_technical_skills", "preferred_technical_skills", "tools_and_technologies", "technical_skills", "tools"]:
            skills_list = skills_dict.get(key, [])
            if isinstance(skills_list, list):
                all_predictions.extend([str(item) for item in skills_list if item])

    hallucinated = []
    for item in all_predictions:
        if item.lower() not in source_text:
            hallucinated.append(item)

    score = 1.0
    if len(all_predictions) > 0:
        score = 1.0 - (len(hallucinated) / len(all_predictions))

    return {
        "key": "hallucination_score",
        "score": score,
        "comment": f"Hallucinated Items: {hallucinated}"
    }