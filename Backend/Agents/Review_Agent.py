from langgraph.prebuilt import create_react_agent
try:
    from Agents.llm import llm
    from Agents.Prompts import REVIEW_AGENT_PROMPT
except ImportError:
    from llm import llm
    from Prompts import REVIEW_AGENT_PROMPT

Review_agent = create_react_agent(
    model=llm,
    tools=[],
    prompt=REVIEW_AGENT_PROMPT,
)
