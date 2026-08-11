from langsmith.schemas import Run, Example


def certifications_evaluator(run: Run, example: Example):

    actual = (
        run.outputs
        .get("parsed_resume", {})
        .get("certifications", [])
    )

    expected = (
        example.outputs
        .get("certifications", [])
    )

    actual = {
        c["title"].lower()
        if isinstance(c, dict)
        else str(c).lower()
        for c in actual
    }

    expected = {
        str(c).lower()
        for c in expected
    }

    score = float(actual == expected)

    return {
        "key": "certifications_match",
        "score": score,
        "comment": (
            f"Expected={expected}, "
            f"Actual={actual}"
        )
    }