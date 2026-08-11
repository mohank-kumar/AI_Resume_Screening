import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# ----------------------------------------------------
# Load .env first
# ----------------------------------------------------
load_dotenv()
for parent in Path(__file__).resolve().parents:
    env_file = parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        break

print("API KEY :", "FOUND" if os.getenv("LANGSMITH_API_KEY") else "None")
print("PROJECT :", os.getenv("LANGSMITH_PROJECT"))

# ----------------------------------------------------
# Add Backend, Agents & Evaluation folders to sys.path
# ----------------------------------------------------
backend_dir = Path(__file__).resolve().parents[2]
agents_dir = Path(__file__).resolve().parents[1]
evaluation_dir = Path(__file__).resolve().parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

if str(agents_dir) not in sys.path:
    sys.path.insert(0, str(agents_dir))

if str(evaluation_dir) not in sys.path:
    sys.path.insert(0, str(evaluation_dir))

# ----------------------------------------------------
# LangSmith
# ----------------------------------------------------
from langsmith import Client
from langsmith.evaluation import evaluate

# ----------------------------------------------------
# Resume Parser Node
# ----------------------------------------------------
from Agents.node import resume_parse

# ----------------------------------------------------
# Evaluators
# ----------------------------------------------------
from evaluation.evaluators.name_evaluator import name_evaluator
from evaluation.evaluators.email_evaluator import email_evaluator
from evaluation.resume_evaluation.skills_evaluator import skills_evaluator
from evaluation.resume_evaluation.resume_projects_evaluator import projects_evaluator
from evaluation.resume_evaluation.resume_certifications_evaluator import certifications_evaluator
from evaluation.evaluators.phone_evaluator import phone_evaluator
from evaluation.evaluators.education_evaluator import education_evaluator
from evaluation.evaluators.hallucination_evaluator import hallucination_evaluator
from evaluation.evaluators.experience_evaluator import experience_evaluator

client = Client()


def run_resume(inputs):

    state = {
        "resume": inputs["resume"]
    }

    try:
        return resume_parse(state)

    except Exception as e:

        print(e)

        return {
            "parsed_resume": {}
        }


if __name__ == "__main__":

    dataset = client.read_dataset(
        dataset_name="Resume Benchmark v1"
    )

    examples = list(
        client.list_examples(
            dataset_id=dataset.id
        )
    )

    print("=" * 60)
    print("Dataset :", dataset.name)
    print("Examples:", len(examples))
    print("=" * 60)

    results = evaluate(
        run_resume,
        data=dataset,
        evaluators=[
            email_evaluator,
            name_evaluator,
            skills_evaluator,
            experience_evaluator,
            education_evaluator,
            phone_evaluator,
            projects_evaluator,
            certifications_evaluator,
            hallucination_evaluator

        ],
        experiment_prefix="resume-parser-v1"
    )

    print(results)