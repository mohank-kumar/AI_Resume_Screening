from langsmith.schemas import Run, Example


def mandatory_skills_evaluator(run: Run, example: Example):

    actual_skills = (run.outputs or {}).get("extracted_jd", {}).get("skills", {}).get("mandatory_technical_skills", [])
    expected_skills = (example.outputs or {}).get("skills", {}).get("mandatory_technical_skills", [])

    actual = set(skill.strip().lower() for skill in actual_skills if isinstance(skill, str))
    expected = set(skill.strip().lower() for skill in expected_skills if isinstance(skill, str))

    missing = expected - actual
    extra = actual - expected   

    precision = (
        len(actual & expected) / len(actual)
        if actual else 0
    )

    recall = (
        len(actual & expected) / len(expected)
        if expected else 0
    )

    return {
        "key": "mandatory_skills",
        "score": recall,
        "comment": (
            f"Missing: {list(missing)} | "
            f"Extra: {list(extra)} | "
            f"Precision={precision:.2f}, Recall={recall:.2f}"
        )
    }