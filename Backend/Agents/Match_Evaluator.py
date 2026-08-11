from langgraph.prebuilt import create_react_agent
try:
    from Agents.llm import llm
    from Agents.Prompts import MATCH_EVALUATOR_PROMPT
except ImportError:
    from llm import llm
    from Prompts import MATCH_EVALUATOR_PROMPT

Match_evaluator_agent = create_react_agent(
    model=llm,
    tools=[],
    prompt=MATCH_EVALUATOR_PROMPT,
)