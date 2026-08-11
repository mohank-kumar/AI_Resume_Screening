import sys
from pathlib import Path
from dotenv import load_dotenv

# ----------------------------------------------------
# Add Backend, Agents & Evaluation folders to sys.path
# ----------------------------------------------------

backend_dir = Path(__file__).resolve().parents[2]
agents_dir = Path(__file__).resolve().parents[1]
evaluation_dir = Path(__file__).resolve().parent

for path in [backend_dir, agents_dir, evaluation_dir]:
    if str(path) not in sys.path:
        sys.path.insert(0, str(path))

# ----------------------------------------------------
# Load .env
# ----------------------------------------------------

for parent in Path(__file__).resolve().parents:
    env_file = parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        break

# ----------------------------------------------------
# LangSmith
# ----------------------------------------------------

from langsmith import Client
from langsmith.evaluation import evaluate

# ----------------------------------------------------
# Match Evaluator Node
# ----------------------------------------------------

from Agents.node import match_evaluate

# ----------------------------------------------------
# Evaluators
# ----------------------------------------------------

from evaluation.match_evaluation.mandatory_skill_evaluator import (
    mandatory_skill_evaluator,
)

from evaluation.match_evaluation.experience_evaluator import (
    experience_evaluator,
)

from evaluation.match_evaluation.education_evaluator import (
    education_evaluator,
)

from evaluation.match_evaluation.domain_evaluator import (
    domain_evaluator,
)

from evaluation.match_evaluation.overall_score_evaluator import (
    overall_score_evaluator,
)

from evaluation.match_evaluation.recommendation_evaluator import (
    recommendation_evaluator,
)

from evaluation.match_evaluation.hallucination_evaluator import (
    hallucination_evaluator,
)

client = Client()


def run_match(inputs):

    state = {
        "extracted_jd": inputs["extracted_jd"],
        "parsed_resume": inputs["parsed_resume"]
    }

    try:
        return match_evaluate(state)

    except Exception as e:

        print(e)

        return {
            "match_evaluation": {}
        }


if __name__ == "__main__":

    dataset = client.read_dataset(
        dataset_name="Match Benchmark v2"
    )

    examples = list(
        client.list_examples(
            dataset_id=dataset.id
        )
    )


    results = evaluate(
        run_match,
        data=dataset,
        evaluators=[
            mandatory_skill_evaluator,
            experience_evaluator,
            education_evaluator,
            domain_evaluator, 
            overall_score_evaluator,
            recommendation_evaluator,
            hallucination_evaluator
        ],
        experiment_prefix="match-evaluator-v2"
    )

    print(results)