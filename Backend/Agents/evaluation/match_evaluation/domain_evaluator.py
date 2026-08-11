import json
from langsmith.schemas import Run, Example


def domain_evaluator(run: Run, example: Example):

    outputs = run.outputs or {}

    if isinstance(outputs, dict):
        match_eval = outputs.get("match_evaluation", {})
    else:
        match_eval = {}

    if isinstance(match_eval, str):
        try:
            match_eval = json.loads(match_eval)
        except Exception:
            match_eval = {}

    actual = (
        match_eval
        .get("domain_fit_analysis", {})
    )

    expected = (
        (example.outputs or {})
        .get("domain_fit_analysis", {})
    )

    actual_jd = set(
        d.strip().lower()
        for d in actual.get("jd_target_domains", [])
        if isinstance(d, str)
    )

    expected_jd = set(
        d.strip().lower()
        for d in expected.get("jd_target_domains", [])
        if isinstance(d, str)
    )

    actual_candidate = set(
        d.strip().lower()
        for d in actual.get("candidate_domains", [])
        if isinstance(d, str)
    )

    expected_candidate = set(
        d.strip().lower()
        for d in expected.get("candidate_domains", [])
        if isinstance(d, str)
    )

    score = 0
    total = 3

    comments = []

    # JD Domains
    if actual_jd == expected_jd:
        score += 1
    else:
        comments.append(
            f"JD Domains Expected={list(expected_jd)} "
            f"Actual={list(actual_jd)}"
        )

    # Candidate Domains
    if actual_candidate == expected_candidate:
        score += 1
    else:
        comments.append(
            f"Candidate Domains Expected={list(expected_candidate)} "
            f"Actual={list(actual_candidate)}"
        )

    # Domain Match Status
    if (
        str(actual.get("domain_match_status", "")).lower()
        ==
        str(expected.get("domain_match_status", "")).lower()
    ):
        score += 1
    else:
        comments.append(
            f"Status Expected={expected.get('domain_match_status')} "
            f"Actual={actual.get('domain_match_status')}"
        )

    final_score = score / total

    return {
        "key": "domain_match",
        "score": final_score,
        "comment": (
            "Perfect Match"
            if final_score == 1
            else " | ".join(comments)
        )
    }