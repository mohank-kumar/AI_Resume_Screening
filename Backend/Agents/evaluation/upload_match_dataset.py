import json
from pathlib import Path
from dotenv import load_dotenv
from langsmith import Client

# -------------------------------------------------------
# Load .env
# -------------------------------------------------------

for parent in Path(__file__).resolve().parents:
    env_file = parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        break

client = Client()

DATASET_NAME = "Match Benchmark v2"

# -------------------------------------------------------
# Create / Read Dataset
# -------------------------------------------------------

existing = None

for ds in client.list_datasets():

    if ds.name == DATASET_NAME:
        existing = ds
        break

if existing:

    dataset = existing

    print(f"Using existing dataset: {dataset.name}")

else:

    dataset = client.create_dataset(
        dataset_name=DATASET_NAME,
        description="Benchmark dataset for Match Evaluator"
    )

    print(f"Created dataset: {dataset.name}")

# -------------------------------------------------------
# Folder Paths
# -------------------------------------------------------

root = Path(__file__).parent / "datasets" / "Match_Benchmark_v1_Filled"
if not root.exists():
    root = Path(__file__).parent / "Match_Benchmark_v1_Filled"

jd_folder = root / "parsed_jd"
resume_folder = root / "parsed_resume"
reference_folder = root / "reference_outputs"

# -------------------------------------------------------
# Existing Examples
# -------------------------------------------------------

existing_examples = {

    ex.inputs["id"]

    for ex in client.list_examples(dataset_id=dataset.id)

    if "id" in ex.inputs

}

uploaded = 0

# -------------------------------------------------------
# Upload
# -------------------------------------------------------

for jd_file in sorted(jd_folder.glob("*.json")):

    match_id = jd_file.stem.replace("_JD", "")

    if match_id in existing_examples:

        print(f"Skipping {match_id}")

        continue

    resume_file = resume_folder / f"{match_id}_RESUME.json"

    reference_file = reference_folder / f"{match_id}.json"

    with open(jd_file) as f:

        jd = json.load(f)

    with open(resume_file) as f:

        resume = json.load(f)

    with open(reference_file) as f:

        reference = json.load(f)

    client.create_example(

        dataset_id=dataset.id,

        inputs={

            "id": match_id,

            "extracted_jd": jd,

            "parsed_resume": resume

        },

        outputs=reference

    )

    uploaded += 1

    print(f"Uploaded {match_id}")

print()

print(f"Finished. Uploaded {uploaded} examples.")