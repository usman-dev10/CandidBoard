from sqlalchemy.orm import Session

from src.app.db.trace import AgentRunRow, HandoffRow, ReportRow, ToolCallRow


def persist_run(db: Session, evaluation_id: str, result: dict) -> None:
    for hop in result.get("handoffs") or []:
        db.add(
            HandoffRow(
                evaluation_id=evaluation_id,
                from_agent=hop.get("from_agent", ""),
                to_agent=hop.get("to_agent", ""),
                condition=hop.get("condition", "")[:80],
                payload_keys=hop.get("payload_keys") or [],
            )
        )
    for tool in result.get("tool_trace") or []:
        db.add(
            ToolCallRow(
                evaluation_id=evaluation_id,
                agent_id=tool.get("agent_id", ""),
                tool_name=tool.get("tool_name", ""),
                arguments=tool.get("arguments") or {},
                result=tool.get("result"),
            )
        )
    for item in (result.get("final_report") or {}).get("agent_trace") or []:
        status = item.get("status") or "succeeded"
        db.add(
            AgentRunRow(
                evaluation_id=evaluation_id,
                agent_id=item.get("agent_id", ""),
                input_snapshot={"evaluation_id": evaluation_id},
                output_snapshot={"status": status},
                status=status,
            )
        )
    report = result.get("final_report")
    if report:
        db.add(ReportRow(evaluation_id=evaluation_id, report=report, schema_version="1.0"))
