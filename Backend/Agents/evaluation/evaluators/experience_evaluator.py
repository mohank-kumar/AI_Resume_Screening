from langsmith.schemas import Run, Example


def experience_evaluator(run: Run, example: Example):

    actual = (
        run.outputs
        .get("parsed_resume", {})
        .get("work_history", [])
    )

    expected = (
        example.outputs
        .get("experience", [])
    )

    actual_titles = {
        e.get("job_title", "").lower()
        for e in actual
    }

    expected_titles = {
        e.get("job_title", "").lower()
        for e in expected
    }

    score = float(actual_titles == expected_titles)

    return {
        "key": "experience_match",
        "score": score,
        "comment": (
            f"Expected={expected_titles}, "
            f"Actual={actual_titles}"
        )
    }