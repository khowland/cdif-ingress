# =============================================================================
# Clinical Data Ingress Fabric (CDIF) — Dockerfile
# Five-Vector ETL demo. Sample data only. Not for clinical use.
# =============================================================================
# Build:  docker build -t cdif:latest .
# Run:    docker run -p 8080:8080 cdif:latest
# Health: curl http://localhost:8080/health
# =============================================================================

FROM python:3.11-slim

# Labels
LABEL maintainer="K. Howland" \
      project="CDIF" \
      version="1.0.0" \
      description="Clinical Data Ingress Fabric — Sample Demo"

# [Lo] Deterministic, non-root execution
RUN groupadd --gid 1001 cdif \
 && useradd  --uid 1001 --gid cdif --shell /bin/false --create-home cdif

WORKDIR /app

# [St] Install dependencies first (layer cache optimisation)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY cdif_ingress.py .

# [St] Vault directory owned by non-root user
RUN mkdir -p /app/vault \
 && chown -R cdif:cdif /app

USER cdif

# [η] Expose port and declare healthcheck
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

# [Ac] Launch — single worker for demo, scale via orchestrator in production
CMD ["uvicorn", "cdif_ingress:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
