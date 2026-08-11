from Agents.JD_Extractor import JD_extractor_agent
from Agents.Match_Evaluator import Match_evaluator_agent
from Agents.Resume_Parser import Resume_parser_agent
from Agents.Final_Scorer import Final_scorer_agent
from Agents.Review_Agent import Review_agent
from langsmith import traceable
import json

def _extract_text(content) -> str:
    """Helper to safely convert agent output content (string, dict, or list of dicts/blocks) to a string."""
    if isinstance(content, str):
        return content
    if isinstance(content, dict):
        return json.dumps(content)
    if isinstance(content, list):
        parts = []
        for part in content:
            if isinstance(part, dict):
                parts.append(part.get("text", json.dumps(part)))
            elif hasattr(part, "text"):
                parts.append(getattr(part, "text"))
            else:
                parts.append(str(part))
        return "\n".join(parts)
    return str(content)

@traceable(name="JD Extractor")
def jd_extract(state):
    response = JD_extractor_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": state['job_description']
                }
            ]
        } 
    )
    content = response["messages"][-1].content

    parsed = json.loads(_extract_text(content))

    return {
        "extracted_jd": parsed
    }



@traceable(name="Resume Parser")
def resume_parse(state):

    response = Resume_parser_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": state["resume"]
                }
            ]
        }
    )

    content = response["messages"][-1].content

    try:
        parsed_resume = json.loads(_extract_text(content))
    except json.JSONDecodeError:
        parsed_resume = {}

    return {
        "parsed_resume": parsed_resume
    }

@traceable(name="Match Evaluator")
def match_evaluate(state):

    extracted_jd = _extract_text(
        state["extracted_jd"]
    )

    parsed_resume = _extract_text(
        state["parsed_resume"]
    )

    response = Match_evaluator_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": (
                        extracted_jd
                        + "\n\n"
                        + parsed_resume
                    )
                }
            ]
        }
    )

    content = response["messages"][-1].content

    raw_text = _extract_text(content)

    try:

        clean_text = raw_text.strip()

        if clean_text.startswith("```"):

            lines = clean_text.splitlines()

            if lines[0].startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]

            clean_text = "\n".join(lines).strip()

        parsed_match = json.loads(clean_text)

    except Exception:

        parsed_match = raw_text


    if isinstance(parsed_match, dict):

        overall_evaluation = parsed_match.get(
            "overall_evaluation",
            {}
        )

        if not isinstance(overall_evaluation, dict):
            overall_evaluation = {}

        overall_score = overall_evaluation.get(
            "overall_match_score",
            0
        )

        try:
            overall_score = float(overall_score)
        except (TypeError, ValueError):
            overall_score = 0


        if overall_score >= 85:
            recommendation = "Strong Hire"

        elif overall_score >= 70:
            recommendation = "Hire"

        elif overall_score >= 55:
            recommendation = "Shortlist"

        elif overall_score >= 40:
            recommendation = "Consider"

        else:
            recommendation = "Reject"


    overall_evaluation["overall_match_score"] = overall_score
    overall_evaluation["recommendation"] = recommendation

    parsed_match["overall_evaluation"] = (
        overall_evaluation
    )


    return {
        "match_evaluation": parsed_match
    }

@traceable(name="Review")
def review(state):
    extracted_jd = _extract_text(state['extracted_jd'])
    parsed_resume = _extract_text(state['parsed_resume'])
    match_eval = _extract_text(state['match_evaluation'])
    
    input_text = f"JOB DESCRIPTION:\n{extracted_jd}\n\nRESUME:\n{parsed_resume}\n\nMATCH EVALUATION REPORT:\n{match_eval}"
    
    response = Review_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": input_text
                }
            ]
        }
    )
    content = response["messages"][-1].content
    return {
        "review": _extract_text(content)
    }


@traceable(name="Final Scorer")
def final_score(state):
    match_eval = _extract_text(state['match_evaluation'])
    review_text = _extract_text(state.get('review', ''))
    
    input_text = f"MATCH EVALUATION REPORT:\n{match_eval}"
    if review_text:
        input_text += f"\n\nAUDIT REVIEW REPORT:\n{review_text}"
        
    response = Final_scorer_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": input_text
                }
            ]
        }
    )
    content = response["messages"][-1].content
    return {
        "final_score": _extract_text(content)
    }
