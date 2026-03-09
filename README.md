# Clinical Data Ingress Fabric (CDIF)

[![Tests](https://img.shields.io/badge/tests-58%2F58%20passing-brightgreen)](test_cdif.py)
[![Python](https://img.shields.io/badge/python-3.11--slim-blue)](Dockerfile)

A Five-Vector ETL schema demonstration for high-velocity clinical telemetry ingress.
Sample data only — no PHI, no live systems.

---

## Architecture: Five-Vector Schema

| Vector | Tag | Responsibility |
|--------|-----|----------------|
| Logic | `[Lo]` | Pydantic `ClinicalTelemetry` schema enforcement at ingress boundary |
| Transformer | `[T]` | Urgency indexing, ISO-8601 enrichment, `BRONZE_SAMPLE` fabric-layer annotation |
| Actuator | `[Ac]` | FastAPI HTTP surface: `POST /etl/clinical/sample`, `GET /health` |
| Storage | `[St]` | Append-only `sample_clinical_vault.jsonl` persistence with UUID ingress IDs |
| Resonance | `[η]` | Structured `stdout` logging for all ingress events: OK, FAIL, VALIDATION_FAIL |

---

## Validation Invariants `[Lo]`

```
patient_id  : ^[A-Z0-9]{6,12}$
heart_rate  : int,   30-220 bpm
spo2        : float, 70-100 %
temp_c      : float, 34-43 C
status      : CRITICAL | WARNING | STABLE
notes       : Optional[str], max 500 chars
```

All inputs are treated as hostile until validated. No record is persisted before passing all constraints.

---

## Urgency Scoring `[T]`

```python
urgency_index = 1.0 if (status == CRITICAL or heart_rate > 120) else 0.5
```

Priority tier 1.0 records flagged for downstream triage routing without re-parsing raw fields.

---

## Quick Start

```bash
# Build
docker build -t cdif-demo .

# Run
docker run -d -p 8080:8000 --name cdif-instance cdif-demo

# Health check
curl http://localhost:8080/health

# Sample ingest
curl -X POST http://localhost:8080/etl/clinical/sample \
  -H 'Content-Type: application/json' \
  -d '{"patient_id":"PT001A","heart_rate":145,"spo2":94.5,"temp_c":37.8,"status":"CRITICAL"}'
```

---

## Test Coverage

```bash
pip install -r requirements.txt
pytest test_cdif.py -v
# 58/58 passing
```

Coverage: boundary values, payload injection (SQL, null byte, unicode),
urgency scoring assertions, vault integrity, and validation failure paths.

---

## Security Model

- Non-root container user (`USER cdif`)
- No PHI. No live clinical systems. Sample data only.
- Zero-trust invariant: all inputs validated before transformation or persistence
- Validation failures return `422 REJECTED` — no internal stack trace leakage

---

## Dashboard

Interactive Five-Vector architecture showcase deployed to GitHub Pages.

```bash
cd dashboard && npm install
npm run dev      # local dev server
npm run build    # production build
npm run deploy   # publish to gh-pages
```
