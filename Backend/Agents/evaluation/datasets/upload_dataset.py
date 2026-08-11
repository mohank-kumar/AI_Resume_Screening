import json
import os
from pathlib import Path
from dotenv import load_dotenv
from langsmith import Client

# Load .env file from root project directories
load_dotenv()
for parent in Path(__file__).resolve().parents:
    env_file = Path(__file__).resolve().parents[3] / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        break

client = Client()

print("API URL:", client.api_url)

DATASET_NAME = "JD Benchmark v1"

# Read local dataset
dataset_path = Path(__file__).parent / "datasets" / "jd_benchmark_v1_batch1.json"
if not dataset_path.exists():
    dataset_path = Path(__file__).parent / "jd_benchmark_v1_batch1.json"

with open(dataset_path, "r") as f:
    dataset = json.load(f)

# Check whether dataset already exists
existing = None

for ds in client.list_datasets():
    if ds.name == DATASET_NAME:
        existing = ds
        break

# Create if it doesn't exist
if existing is None:
    dataset_obj = client.create_dataset(
        dataset_name=DATASET_NAME,
        description="Evaluation dataset for JD Extractor"
    )
    print(f"Created dataset: {dataset_obj.name}")
else:
    dataset_obj = existing
    print(f"Using existing dataset: {dataset_obj.name}")


print(f"Total examples in JSON: {len(dataset)}")
# Upload examples
for i, example in enumerate(dataset, start=1):
    print(f"Uploading {i}: {example['id']}")
    client.create_example(
        dataset_id=dataset_obj.id,
        inputs=example["inputs"],
        outputs=example["reference_outputs"]
    )

print("Dataset uploaded successfully!")

