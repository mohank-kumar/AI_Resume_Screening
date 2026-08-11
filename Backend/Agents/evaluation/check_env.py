from pathlib import Path
from dotenv import load_dotenv
import os

print("Current File:", Path(__file__).resolve())

# Correct path to .env
env_path = Path(__file__).resolve().parents[3] / ".env"

print("Loading .env from:", env_path)
print("Exists:", env_path.exists())

load_dotenv(env_path)

print("\nLANGSMITH_API_KEY:", os.getenv("LANGSMITH_API_KEY"))
print("LANGSMITH_PROJECT:", os.getenv("LANGSMITH_PROJECT"))
print("LANGSMITH_TRACING:", os.getenv("LANGSMITH_TRACING"))