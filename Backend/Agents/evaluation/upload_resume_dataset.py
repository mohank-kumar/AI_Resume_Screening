import json
from pathlib import Path
from dotenv import load_dotenv
from langsmith import Client

# ---------------------------------------
# Load .env
# ---------------------------------------
for parent in Path(__file__).resolve().parents:
    env_file = parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        break

client = Client()

DATASET_NAME = "Resume Benchmark v1"

# ---------------------------------------
# Dataset folders (support both evaluation/ and evaluation/datasets/)
# ---------------------------------------
if (Path(__file__).parent / "datasets" / "resumes").exists():
    BASE_DIR = Path(__file__).parent / "datasets"
else:
    BASE_DIR = Path(__file__).parent

RESUME_DIR = BASE_DIR / "resumes"
REFERENCE_DIR = BASE_DIR / "reference_outputs"

# ---------------------------------------
# Create dataset if needed
# ---------------------------------------
existing = None

for ds in client.list_datasets():
    if ds.name == DATASET_NAME:
        existing = ds
        break

if existing is None:
    dataset = client.create_dataset(
        dataset_name=DATASET_NAME,
        description="Benchmark dataset for Resume Parser"
    )
    print(f"Created dataset: {dataset.name}")
else:
    dataset = existing
    print(f"Using existing dataset: {dataset.name}")

# ---------------------------------------
# Avoid duplicate uploads
# ---------------------------------------
existing_examples = list(client.list_examples(dataset_id=dataset.id))

existing_ids = set()
for ex in existing_examples:
    if ex.inputs and "resume" in ex.inputs:
        first_line = ex.inputs["resume"].split("\n")[0].strip()
        existing_ids.add(first_line)

# ---------------------------------------
# Upload examples
# ---------------------------------------
uploaded_count = 0
for resume_file in sorted(RESUME_DIR.glob("*.txt")):
    ref_file = REFERENCE_DIR / f"{resume_file.stem}.json"
    if not ref_file.exists():
        print(f"Skipping {resume_file.name}: Reference output file not found ({ref_file.name})")
        continue

    with open(resume_file, "r", encoding="utf-8") as f:
        resume_text = f.read()

    with open(ref_file, "r", encoding="utf-8") as f:
        reference_output = json.load(f)

    first_line = resume_text.split("\n")[0].strip()
    if first_line in existing_ids:
        print(f"Skipping {resume_file.name}: Already uploaded")
        continue

    print(f"Uploading {resume_file.name}...")
    client.create_example(
        dataset_id=dataset.id,
        inputs={"resume": resume_text},
        outputs=reference_output
    )
    uploaded_count += 1

print(f"\nUpload finished. Total newly uploaded: {uploaded_count}")
