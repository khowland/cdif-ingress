# Clinical Data Ingress Fabric (CDIF) - Technical Demonstration

## Overview
A Zero-Trust ETL ingress microservice designed to sanitize and enrich clinical telemetry. This demonstration showcases the 'Gatekeeper' pattern for high-stakes data environments (Sample Data Only).

## Architectural Vectors
* **[St] Storage:** Append-only JSONL landing zone (sample_clinical_vault.jsonl).
* **[Lo] Logic:** Pydantic-enforced clinical invariants (Heart Rate, SpO2, Temp).
* **[T] Transformer:** Metadata enrichment and Urgency Indexing (0.0 - 1.0).
* **[Ac] Actuator:** Containerized FastAPI REST interface.
* **[?] Resonance:** Real-time validation telemetry and HIPAA-aligned tagging.

## Quick Start
1. **Build:** docker build -t cdif-demo .
2. **Run:** docker run -d -p 8080:8000 --name cdif-instance cdif-demo
3. **Test:** Use the provided curl scripts to simulate 'Stable' vs 'Critical' patient telemetry.

---
*Note: This project is a standalone technical showcase for Rackner interview context. No PII/PHI is used.*
