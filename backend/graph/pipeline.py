from langgraph.graph import StateGraph, END
from .state import HealthBridgeState
from .nodes import (
    normalise_input,
    triage_node, 
    fetch_hospitals_node,
    hospital_finder_node,
    cost_estimator_node,
    followup_node
)

def should_skip_cost(state: HealthBridgeState) -> str:
    if state.get("urgency_level") == 5:
        return "emergency"
    return "normal"

def build_graph() -> StateGraph:
    graph = StateGraph(HealthBridgeState)
    
    graph.add_node("normalise_input", normalise_input)
    graph.add_node("triage", triage_node)
    graph.add_node("fetch_hospitals", fetch_hospitals_node)
    graph.add_node("hospital_finder", hospital_finder_node)
    graph.add_node("cost_estimator", cost_estimator_node)
    graph.add_node("followup", followup_node)
    
    graph.set_entry_point("normalise_input")
    graph.add_edge("normalise_input", "triage")
    graph.add_edge("triage", "fetch_hospitals")
    graph.add_edge("fetch_hospitals", "hospital_finder")
    
    graph.add_conditional_edges(
        "hospital_finder",
        should_skip_cost,
        {
            "emergency": "followup",
            "normal": "cost_estimator"
        }
    )
    
    graph.add_edge("cost_estimator", "followup")
    graph.add_edge("followup", END)
    
    return graph.compile()

pipeline = build_graph()
