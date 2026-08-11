from Agents.state import ResumeScreeningState
from langgraph.graph import StateGraph, START, END
from Agents.node import jd_extract, resume_parse, match_evaluate, review, final_score
from dotenv import load_dotenv

load_dotenv()
graph = StateGraph(ResumeScreeningState)

# nodes
graph.add_node("jd_extract", jd_extract)
graph.add_node("resume_parse", resume_parse)
graph.add_node("match_evaluate", match_evaluate)
graph.add_node("review", review)
graph.add_node("final_score", final_score)

# Edges
graph.add_edge(START, "jd_extract")
graph.add_edge("jd_extract", "resume_parse")
graph.add_edge("resume_parse", "match_evaluate")
graph.add_edge("match_evaluate", "review")
graph.add_edge("review", "final_score")
graph.add_edge("final_score", END)

graphs = graph.compile()

