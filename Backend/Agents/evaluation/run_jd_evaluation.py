import sys
from pathlib import Path
from dotenv import load_dotenv
import inspect
from langsmith.evaluation import evaluate

print(inspect.signature(evaluate))
# ------------------------------------------------------------------
# Add Backend, Agents, and evaluation folders to Python path
# ------------------------------------------------------------------
backend_dir = Path(__file__).resolve().parents[2]
agents_dir = Path(__file__).resolve().parents[1]
evaluation_dir = Path(__file__).resolve().parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

if str(agents_dir) not in sys.path:
    sys.path.insert(0, str(agents_dir))

if str(evaluation_dir) not in sys.path:
    sys.path.insert(0, str(evaluation_dir))

# ------------------------------------------------------------------
# Load .env
# ------------------------------------------------------------------
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(env_path)

# ------------------------------------------------------------------
# LangSmith
# ------------------------------------------------------------------
from langsmith import Client
from langsmith.evaluation import evaluate

# ------------------------------------------------------------------
# Import your JD extractor
# ------------------------------------------------------------------
from Agents.node import jd_extract

# ------------------------------------------------------------------
# Import Evaluators
# ------------------------------------------------------------------
from evaluators.title_evaluator import title_evaluator
from evaluators.mandatory_skills_evaluator import mandatory_skills_evaluator
from evaluators.hallucination_evaluator import hallucination_evaluator
from evaluators.email_evaluator import email_evaluator
from evaluators.experience_evaluator import experience_evaluator
from evaluators.phone_evaluator import phone_evaluator


client = Client()


# ------------------------------------------------------------------
# Target Function
# LangSmith executes this function for every dataset example
# ------------------------------------------------------------------
def run_jd(inputs):

    state = {
        "job_description": inputs["job_description"]
    }

    try:
        return jd_extract(state)

    except Exception as e:

        print(f"Error: {e}")

        return {
            "error": str(e),
            "extracted_jd": {}
        }


# ------------------------------------------------------------------
# Run Evaluation
# ------------------------------------------------------------------
# ------------------------------------------------------------------
# Run Evaluation
# ------------------------------------------------------------------
if __name__ == "__main__":

    # Read dataset
    dataset = client.read_dataset(dataset_name="JD Benchmark v1")

    # Fetch all examples
    examples = list(client.list_examples(dataset_id=dataset.id))

    print("=" * 60)
    print("Dataset Name :", dataset.name)
    print("Dataset ID   :", dataset.id)
    print("Examples     :", len(examples))
    print("=" * 60)

    # Show first few examples
    for i, ex in enumerate(examples[:3], start=1):
        print(f"\nExample {i}")
        print("Inputs:", ex.inputs)
        print("Outputs:", ex.outputs.keys() if ex.outputs else None)

    print("\nStarting evaluation...\n")

    results = evaluate(
        run_jd, 
        data=dataset,
        evaluators=[
            title_evaluator,
            mandatory_skills_evaluator,
            hallucination_evaluator,
            email_evaluator,
            experience_evaluator,
            phone_evaluator
        ],
        experiment_prefix="jd-extraction-v1",
    )

    print("\nEvaluation Completed Successfully!\n")
    print(results)