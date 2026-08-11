from langsmith.schemas import Run, Example


def title_evaluator(run: Run, example: Example):
    """
    Compare expected title with extracted title.
    """

    actual = (
        run.outputs["extracted_jd"]
        .get("job_metadata", {})
        .get("title", "")
        .strip()
        .lower()
    )

    expected = (
        example.outputs["job_metadata"]
        .get("title", "")
        .strip()
        .lower()
    )

    return {
        "key": "job_title_match",
        "score": actual == expected,
        "comment": f"Expected='{expected}', Actual='{actual}'"
    }