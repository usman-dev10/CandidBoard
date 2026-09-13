from collections import defaultdict

EVENTS: dict[str, list[dict]] = defaultdict(list)


def emit(evaluation_id: str, event: str, data: dict) -> None:
    EVENTS[evaluation_id].append({"event": event, "data": data})


def snapshot(evaluation_id: str) -> list[dict]:
    return list(EVENTS.get(evaluation_id, []))


def clear(evaluation_id: str) -> None:
    EVENTS.pop(evaluation_id, None)
