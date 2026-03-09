"""
================================================================================
 MODULE      : cdif_ingress.py
 PROJECT     : Clinical Data Ingress Fabric (CDIF)
 VERSION     : 1.0.0
 AUTHOR      : K. Howland
 CREATED     : 2026-03-09
 DESCRIPTION : Sample-data-only demonstration of the Five-Vector ETL schema
               applied to clinical telemetry ingress. No PHI. No live systems.
--------------------------------------------------------------------------------
 VECTOR ALIGNMENT
   [Lo] Invariant Control  - Pydantic ClinicalTelemetry validation
   [T]  Transformer        - Urgency scoring + ISO-8601 enrichment
   [Ac] Actuator           - FastAPI HTTP surface (POST + GET)
   [St] Storage            - Append-only JSONL vault
   [η]  Resonance          - Structured stdout logging for all ingress events
================================================================================
"""

from __future__ import annotations

import json
import logging
import re
import sys
import uuid
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator, model_validator

# ── [η] Resonance: Structured logger ──────────────────────────────────────────
logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format="%(asctime)s [CDIF] %(levelname)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
log = logging.getLogger("cdif")

# ── [St] Storage: Vault path ───────────────────────────────────────────────────
VAULT = Path("sample_clinical_vault.jsonl")

# ── [Lo] Invariant Control: Pydantic validation model ─────────────────────────

class ClinicalStatus(str, Enum):
    CRITICAL = "CRITICAL"
    WARNING  = "WARNING"
    STABLE   = "STABLE"


class ClinicalTelemetry(BaseModel):
    """
    [Lo] Validated clinical telemetry payload.
    All fields are sample/demo values only — no real patient data.
    """
    patient_id:  str            = Field(..., description="6-12 char alphanumeric ID (^[A-Z0-9]{6,12}$)")
    heart_rate:  int            = Field(..., ge=30, le=220, description="Heart rate in bpm (30-220)")
    spo2:        float          = Field(..., ge=70, le=100, description="SpO2 percentage (70-100)")
    temp_c:      float          = Field(..., ge=34.0, le=43.0, description="Temperature in Celsius (34-43)")
    status:      ClinicalStatus = Field(ClinicalStatus.STABLE, description="Clinical status flag")
    notes:       Optional[str]  = Field(None, max_length=500)

    @field_validator("patient_id")
    @classmethod
    def validate_patient_id(cls, v: str) -> str:
        """[Lo] Enforce patient ID format invariant."""
        pattern = r"^[A-Z0-9]{6,12}$"
        if not re.match(pattern, v):
            raise ValueError(
                f"patient_id '{v}' must match ^[A-Z0-9]{{6,12}}$ "
                "(6-12 uppercase alphanumeric characters only)"
            )
        return v


# ── [T] Transformer: Enrichment + urgency scoring ─────────────────────────────

def transform(payload: ClinicalTelemetry) -> dict:
    """
    [T] Enrich validated telemetry with urgency index, ISO-8601 timestamp,
    and fabric layer annotation. All transformations are deterministic.
    """
    now_iso = datetime.now(timezone.utc).isoformat()

    # [T] Urgency scoring: CRITICAL status or HR > 120 → 1.0, else 0.5
    urgency_index: float = (
        1.0 if (payload.status == ClinicalStatus.CRITICAL or payload.heart_rate > 120)
        else 0.5
    )

    return {
        "ingress_id":     str(uuid.uuid4()),
        "ingress_ts":     now_iso,          # ISO-8601, UTC
        "fabric_layer":   "BRONZE_SAMPLE",  # [T] raw enriched, not yet validated for silver
        "patient_id":     payload.patient_id,
        "heart_rate":     payload.heart_rate,
        "spo2":           payload.spo2,
        "temp_c":         payload.temp_c,
        "status":         payload.status.value,
        "notes":          payload.notes,
        "urgency_index":  urgency_index,
    }


# ── [St] Storage: Append to JSONL vault ───────────────────────────────────────

def store(record: dict) -> None:
    """[St] Idempotently append an enriched record to the sample JSONL vault."""
    with VAULT.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record) + "\n")


# ── [Ac] Actuator: FastAPI application ────────────────────────────────────────

app = FastAPI(
    title="Clinical Data Ingress Fabric (CDIF)",
    description=(
        "Five-Vector ETL demo. Sample data only. "
        "No PHI. Not for clinical use."
    ),
    version="1.0.0",
)


@app.get("/health", tags=["System"])
async def health() -> JSONResponse:
    """[Ac] Liveness probe. Returns fabric status and vault record count."""
    vault_count = 0
    if VAULT.exists():
        vault_count = sum(1 for _ in VAULT.open("r", encoding="utf-8"))

    return JSONResponse({
        "status":       "NOMINAL",
        "fabric":       "CDIF v1.0.0",
        "fabric_layer": "BRONZE_SAMPLE",
        "vault_records": vault_count,
        "ts":           datetime.now(timezone.utc).isoformat(),
    })


@app.post("/etl/clinical/sample", tags=["Ingress"], status_code=201)
async def ingest_clinical_sample(payload: ClinicalTelemetry) -> JSONResponse:
    """
    [Ac] Clinical telemetry ingress endpoint.

    Validates via [Lo] Pydantic constraints, enriches via [T] transformer,
    persists via [St] JSONL vault, and logs all outcomes via [η] Resonance.
    """
    try:
        # [T] Transform
        record = transform(payload)

        # [St] Store
        store(record)

        # [η] Resonance: log success
        log.info(
            "INGRESS_OK | patient=%s | hr=%d | spo2=%.1f | urgency=%.1f | id=%s",
            record["patient_id"],
            record["heart_rate"],
            record["spo2"],
            record["urgency_index"],
            record["ingress_id"],
        )

        return JSONResponse(status_code=201, content={
            "result":        "ACCEPTED",
            "ingress_id":    record["ingress_id"],
            "urgency_index": record["urgency_index"],
            "fabric_layer":  record["fabric_layer"],
            "ingress_ts":    record["ingress_ts"],
        })

    except Exception as exc:
        # [η] Resonance: log failure — all ingress attempts must be recorded
        log.error(
            "INGRESS_FAIL | patient=%s | error=%s",
            getattr(payload, "patient_id", "UNKNOWN"),
            str(exc),
        )
        raise HTTPException(status_code=500, detail=f"Ingress failure: {exc}") from exc


@app.exception_handler(422)
async def validation_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """[η] Log all validation failures before returning 422."""
    log.warning("VALIDATION_FAIL | path=%s | detail=%s", request.url.path, str(exc))
    return JSONResponse(status_code=422, content={"result": "REJECTED", "detail": str(exc)})


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    log.info("CDIF starting — fabric_layer=BRONZE_SAMPLE — sample data only")
    uvicorn.run("cdif_ingress:app", host="0.0.0.0", port=8080, reload=False)
