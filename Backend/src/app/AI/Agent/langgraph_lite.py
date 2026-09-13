"""Minimal LangGraph-compatible graph (used when langgraph wheels are unavailable)."""

START = "__start__"
END = "__end__"


class MemorySaver:
    def __init__(self):
        self.store: dict = {}


class Compiled:
    def __init__(self, nodes, edges, cond, checkpointer):
        self.nodes = nodes
        self.edges = edges
        self.cond = cond
        self.checkpointer = checkpointer

    def invoke(self, state: dict, config: dict | None = None) -> dict:
        thread = (config or {}).get("configurable", {}).get("thread_id")
        current = START
        data = dict(state)
        while True:
            if current in self.cond:
                nxt = self.cond[current]["map"][self.cond[current]["fn"](data)]
            else:
                nxt = self.edges.get(current)
            if nxt is None or nxt == END:
                break
            if nxt in self.nodes:
                data.update(self.nodes[nxt](data) or {})
                if thread is not None:
                    self.checkpointer.store[thread] = dict(data)
            current = nxt
        return data


class StateGraph:
    def __init__(self, _schema=None):
        self.nodes = {}
        self.edges = {}
        self.cond = {}

    def add_node(self, name, fn):
        self.nodes[name] = fn

    def add_edge(self, src, dst):
        self.edges[src] = dst

    def add_conditional_edges(self, src, fn, mapping: dict):
        self.cond[src] = {"fn": fn, "map": mapping}

    def compile(self, checkpointer=None):
        return Compiled(self.nodes, self.edges, self.cond, checkpointer or MemorySaver())
