import json
from langsmith.schemas import Run, Example



def mandatory_skill_evaluator(run: Run, example: Example):
    outputs = run.outputs or {}

    print("=" * 100)
    print(outputs)
    print("=" * 100)

    if isinstance(outputs, str):
        match_eval = outputs
    elif isinstance(outputs, dict):
        match_eval = outputs.get("match_evaluation", {})
    else:
        match_eval = {}

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

    skills_analysis = match_eval.get("skills_analysis", {})
    if not isinstance(skills_analysis, dict):
        skills_analysis = {}

    actual = skills_analysis.get("matched_mandatory_skills", [])
    if not isinstance(actual, list):
        actual = []

    ex_outputs = example.outputs or {}
    if isinstance(ex_outputs, str):
        try:
            ex_outputs = json.loads(ex_outputs)
        except Exception:
            ex_outputs = {}

    if not isinstance(ex_outputs, dict):
        ex_outputs = {}

    ex_skills_analysis = ex_outputs.get("skills_analysis", {})
    if not isinstance(ex_skills_analysis, dict):
        ex_skills_analysis = {}

    expected = ex_skills_analysis.get("matched_mandatory_skills", [])
    if not isinstance(expected, list):
        expected = []

    actual_set = {
        skill.strip().lower()
        for skill in actual
        if isinstance(skill, str)
    }

    expected_set = {
        skill.strip().lower()
        for skill in expected
        if isinstance(skill, str)
    }

    intersection = actual_set & expected_set

    precision = (
        len(intersection) / len(actual_set)
        if actual_set else 0
    )

    recall = (
        len(intersection) / len(expected_set)
        if expected_set else 0
    )

    if precision + recall == 0:
        f1 = 0
    else:
        f1 = (
            2 * precision * recall
        ) / (
            precision + recall
        )

    return {
        "key": "mandatory_skill_match",
        "score": f1,
        "comment": (
            f"Expected={list(expected_set)} | "
            f"Actual={list(actual_set)} | "
            f"Precision={precision:.2f} | "
            f"Recall={recall:.2f}"
        )
    }