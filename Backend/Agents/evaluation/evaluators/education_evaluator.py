from langsmith.schemas import Run, Example


def education_evaluator(run: Run, example: Example):

    actual = (
        run.outputs
        .get("parsed_resume", {})
        .get("education", [])
    )

    expected = (
        example.outputs
        .get("education", [])
    )

    actual_degrees = {
        e.get("degree", "").lower()
        for e in actual
        if isinstance(e, dict)
    }

    expected_degrees = {
        e.get("degree", "").lower()
        for e in expected
        if isinstance(e, dict)
    }

    score = float(actual_degrees == expected_degrees)

    return {
        "key": "education_match",
        "score": score,
        "comment": (
            f"Expected={expected_degrees}, "
            f"Actual={actual_degrees}"
        )
    }