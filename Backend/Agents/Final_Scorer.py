from langgraph.prebuilt import create_react_agent
try:
    from Agents.llm import llm
    from Agents.Prompts import FINAL_SCORER_PROMPT
except ImportError:
    from llm import llm
    from Prompts import FINAL_SCORER_PROMPT

Final_scorer_agent = create_react_agent(
    model=llm,
    tools=[],
    prompt=FINAL_SCORER_PROMPT,
)