from langsmith.schemas import Run, Example


def skills_evaluator(run: Run, example: Example):

    actual_skills = (
        run.outputs
        .get("parsed_resume", {})
        .get("skills", {})
        .get("technical_skills", [])
    )

    expected_skills = (
        example.outputs
        .get("skills", {})
        .get("technical_skills", [])
    )

    actual = {
        skill.strip().lower()
        for skill in actual_skills
        if isinstance(skill, str)
    }

    expected = {
        skill.strip().lower()
        for skill in expected_skills
        if isinstance(skill, str)
    }

    matched = actual & expected
    missing = expected - actual
    extra = actual - expected

    precision = (
        len(matched) / len(actual)
        if actual else 0
    )

    recall = (
        len(matched) / len(expected)
        if expected else 0
    )

    f1 = (
        2 * precision * recall / (precision + recall)
        if precision + recall > 0 else 0
    )

    return {
        "key": "technical_skills_match",
        "score": f1,
        "comment": (
            f"Matched={sorted(matched)} | "
            f"Missing={sorted(missing)} | "
            f"Extra={sorted(extra)} | "
            f"Precision={precision:.2f}, "
            f"Recall={recall:.2f}, "
            f"F1={f1:.2f}"
        )
    }