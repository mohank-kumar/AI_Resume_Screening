from langgraph.prebuilt import create_react_agent
try:
    from Agents.llm import llm
    from Agents.Prompts import RESUME_PARSER_PROMPT
except ImportError:
    from llm import llm
    from Prompts import RESUME_PARSER_PROMPT

Resume_parser_agent = create_react_agent(
    model=llm,
    tools=[],
    prompt=RESUME_PARSER_PROMPT,
)
