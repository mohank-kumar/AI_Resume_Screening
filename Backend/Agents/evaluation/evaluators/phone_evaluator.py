from langsmith.schemas import Run, Example


def phone_evaluator(run: Run, example: Example):

    actual = (
        run.outputs
        .get("parsed_resume", {})
        .get("candidate_info", {})
        .get("phone", "")
        .strip()
    )

    expected = (
        example.outputs
        .get("candidate_info", {})
        .get("phone", "")
        .strip()
    )

    return {
        "key": "candidate_phone_match",
        "score": float(actual == expected),
        "comment": f"Expected='{expected}', Actual='{actual}'"
    }