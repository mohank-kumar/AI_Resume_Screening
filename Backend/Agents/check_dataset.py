import os
from pathlib import Path
from dotenv import load_dotenv
from langsmith import Client

# Load .env file
load_dotenv()
for parent in Path(__file__).resolve().parents:
    env_file = parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        break

import os

print("API KEY :", os.getenv("LANGSMITH_API_KEY"))
print("PROJECT :", os.getenv("LANGSMITH_PROJECT"))

client = Client()

print("=" * 60)
print("LANGSMITH DATASETS SUMMARY")
print("=" * 60)

datasets = list(client.list_datasets())
if not datasets:
    print("No datasets found in LangSmith.")
else:
    for ds in datasets:
        examples = list(client.list_examples(dataset_id=ds.id))
        print(f"\nDataset: {ds.name}")
        print(f"  ID: {ds.id}")
        print(f"  Total Examples: {len(examples)}")
        for i, ex in enumerate(examples[:3], start=1):
            input_summary = str(ex.inputs)[:50].replace("\n", " ")
            print(f"    {i}. {input_summary}...")
print("=" * 60)
