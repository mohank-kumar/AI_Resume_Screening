from langsmith.schemas import Run, Example


def name_evaluator(run: Run, example: Example):

    actual = (
        run.outputs
        .get("parsed_resume", {})
        .get("candidate_info", {})
        .get("full_name", "")      # Parser output
        .strip()
        .lower()
    )

    ex_info = (example.outputs or {}).get("candidate_info", {})
    if isinstance(ex_info, dict):
        expected_val = ex_info.get("full_name") or ex_info.get("name") or ""
    else:
        expected_val = ""

    expected = str(expected_val).strip().lower()

    return {
        "key": "candidate_name_match",
        "score": float(actual == expected),
        "comment": f"Expected='{expected}', Actual='{actual}'"
    }