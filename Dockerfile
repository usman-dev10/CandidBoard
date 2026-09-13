FROM python:3.12-slim-bookworm
WORKDIR /app
ENV PYTHONUNBUFFERED=1
COPY Backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt
COPY Backend/ /app/
CMD uvicorn src.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
