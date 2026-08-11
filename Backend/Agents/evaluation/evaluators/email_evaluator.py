from langsmith.schemas import Run, Example


def email_evaluator(run: Run, example: Example):

    actual = (
        run.outputs
        .get("parsed_resume", {})
        .get("candidate_info", {})
        .get("email", "")
        .strip()
        .lower()
    )

    expected = (
        example.outputs
        .get("candidate_info", {})
        .get("email", "")
        .strip()
        .lower()
    )

    return {
        "key": "candidate_email_match",
        "score": float(actual == expected),
        "comment": f"Expected='{expected}', Actual='{actual}'"
    }