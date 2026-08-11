from langgraph.prebuilt import create_react_agent
try:
    from Agents.llm import llm
    from Agents.Prompts import JD_EXTRACTOR_PROMPT
except ImportError:
    from llm import llm
    from Prompts import JD_EXTRACTOR_PROMPT

JD_extractor_agent = create_react_agent(
    model=llm,
    tools=[],
    prompt=JD_EXTRACTOR_PROMPT,
)
