from langsmith.schemas import Run, Example


def projects_evaluator(run: Run, example: Example):
    actual = (
        (run.outputs or {})
        .get("parsed_resume", {})
        .get("projects", [])
    )

    expected = (
        (example.outputs or {})
        .get("projects", [])
    )

    actual_titles = {
        p.get("title", "").lower()
        for p in actual
        if isinstance(p, dict)
    }

    expected_titles = {
        p.get("title", "").lower()
        for p in expected
        if isinstance(p, dict)
    }

    score = float(actual_titles == expected_titles)

    return {
        "key": "projects_match",
        "score": score,
        "comment": (
            f"Expected={expected_titles}, "
            f"Actual={actual_titles}"
        )
    }
