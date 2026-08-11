from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(env_path)

from langchain_google_genai import ChatGoogleGenerativeAI

import os

print("Project:", os.getenv("LANGSMITH_PROJECT"))
print("Tracing:", os.getenv("LANGSMITH_TRACING"))
print("API Key Exists:", os.getenv("LANGSMITH_API_KEY") is not None)


llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    temperature=0,
)

response = llm.invoke("Say hello in one sentence.")

print(response.content)