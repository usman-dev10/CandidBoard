try:
    from langgraph.checkpoint.memory import MemorySaver
    from langgraph.graph import END, START, StateGraph
except ImportError:  # Python 3.14+ may lack langgraph wheels
    from src.app.AI.Agent.langgraph_lite import END, START, MemorySaver, StateGraph

from src.app.AI.Agent.a1_resume import run_a1
from src.app.AI.Agent.a2_job_fit import run_a2
from src.app.AI.Agent.a3_technical import run_a3
from src.app.AI.Agent.a4_culture import run_a4
from src.app.AI.Agent.a5_orchestrator import run_a5
from src.app.AI.Schema.graph_state import GraphState

_checkpointer = MemorySaver()


def _route_after_a2(state: GraphState) -> str:
    score = int((state.get("job_fit") or {}).get("overall_score") or 0)
    return "skip" if score < 60 else "deep"


def build_graph():
    graph = StateGraph(GraphState)
    graph.add_node("A1", run_a1)
    graph.add_node("A2", run_a2)
    graph.add_node("A3", run_a3)
    graph.add_node("A4", run_a4)
    graph.add_node("A5", run_a5)
    graph.add_edge(START, "A1")
    graph.add_edge("A1", "A2")
    graph.add_conditional_edges("A2", _route_after_a2, {"deep": "A3", "skip": "A5"})
    graph.add_edge("A3", "A4")
    graph.add_edge("A4", "A5")
    graph.add_edge("A5", END)
    return graph.compile(checkpointer=_checkpointer)


PANEL = build_graph()


def run_panel(state: dict) -> dict:
    return PANEL.invoke(state, config={"configurable": {"thread_id": state["thread_id"]}})
