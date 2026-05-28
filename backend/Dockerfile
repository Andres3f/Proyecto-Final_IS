FROM python:3.11-slim AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN python -m pip install --upgrade pip && python -m pip install --prefix=/install --no-cache-dir -r requirements.txt

COPY . .

FROM python:3.11-slim AS runner
WORKDIR /app
COPY --from=builder /install /install
COPY --from=builder /app /app
ENV PATH="/install/bin:$PATH"
ENV PYTHONPATH="/install/lib/python3.11/site-packages:$PYTHONPATH"
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
