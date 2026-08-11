from langsmith.schemas import Run, Example


def projects_evaluator(run: Run, example: Example):

    actual = (
        run.outputs
        .get("parsed_resume", {})
        .get("projects", [])
    )

    expected = (
        example.outputs
        .get("projects", [])
    )

    actual_titles = {
        p.get("title", "").lower()
        for p in actual
    }

    expected_titles = {
        p.get("title", "").lower()
        for p in expected
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