"""
================================================================================
 MODULE      : test_cdif.py
 PROJECT     : Clinical Data Ingress Fabric (CDIF) - Red Team Validation Suite
 VERSION     : 1.0.0
 AUTHOR      : K. Howland
 CREATED     : 2026-03-09
 DESCRIPTION : Adversarial + boundary test suite for the Five-Vector CDIF.
               Tests [Lo] invariant enforcement, [T] transformer correctness,
               [Ac] surface behavior, and [St] vault integrity.
               All data is synthetic/sample only.
================================================================================
"""

import json
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Isolate vault to a temp file for tests
TEST_VAULT = Path("test_vault.jsonl")
os.environ.setdefault("CDIF_VAULT", str(TEST_VAULT))

from cdif_ingress import app, VAULT, transform, ClinicalTelemetry, ClinicalStatus

client = TestClient(app, raise_server_exceptions=False)

# ── Fixtures ───────────────────────────────────────────────────────────────────

@pytest.fixture(autouse=True)
def clean_vault(tmp_path, monkeypatch):
    """Redirect JSONL vault to a temp path for test isolation."""
    import cdif_ingress
    vault = tmp_path / "test_vault.jsonl"
    monkeypatch.setattr(cdif_ingress, "VAULT", vault)
    yield vault


# ==============================================================================
# [Ac] SURFACE TESTS
# ==============================================================================

class TestHealthEndpoint:
    def test_health_returns_200(self):
        r = client.get("/health")
        assert r.status_code == 200

    def test_health_contains_nominal(self):
        r = client.get("/health")
        assert r.json()["status"] == "NOMINAL"

    def test_health_contains_fabric_layer(self):
        r = client.get("/health")
        assert r.json()["fabric_layer"] == "BRONZE_SAMPLE"

    def test_health_contains_iso_timestamp(self):
        r = client.get("/health")
        ts = r.json().get("ts", "")
        assert "T" in ts and "+" in ts or "Z" in ts, "Timestamp must be ISO-8601 with timezone"


# ==============================================================================
# [Lo] HAPPY PATH — valid payloads
# ==============================================================================

class TestValidIngress:
    VALID = {
        "patient_id": "PT001A",
        "heart_rate": 72,
        "spo2": 98.0,
        "temp_c": 37.0,
        "status": "STABLE",
    }

    def test_valid_payload_returns_201(self):
        r = client.post("/etl/clinical/sample", json=self.VALID)
        assert r.status_code == 201

    def test_valid_payload_result_accepted(self):
        r = client.post("/etl/clinical/sample", json=self.VALID)
        assert r.json()["result"] == "ACCEPTED"

    def test_valid_payload_has_ingress_id(self):
        r = client.post("/etl/clinical/sample", json=self.VALID)
        assert "ingress_id" in r.json()

    def test_valid_payload_fabric_layer(self):
        r = client.post("/etl/clinical/sample", json=self.VALID)
        assert r.json()["fabric_layer"] == "BRONZE_SAMPLE"

    def test_valid_stable_urgency_is_half(self):
        """[T] STABLE + HR <= 120 must produce urgency 0.5."""
        r = client.post("/etl/clinical/sample", json=self.VALID)
        assert r.json()["urgency_index"] == 0.5


# ==============================================================================
# [T] TRANSFORMER TESTS — urgency scoring
# ==============================================================================

class TestUrgencyScoring:
    def _post(self, overrides: dict):
        payload = {
            "patient_id": "RTAM00",
            "heart_rate": 72,
            "spo2": 98.0,
            "temp_c": 37.0,
            "status": "STABLE",
            **overrides,
        }
        return client.post("/etl/clinical/sample", json=payload)

    def test_critical_status_urgency_1(self):
        """[T] CRITICAL status must set urgency_index = 1.0."""
        r = self._post({"status": "CRITICAL"})
        assert r.status_code == 201
        assert r.json()["urgency_index"] == 1.0

    def test_hr_above_120_urgency_1(self):
        """[T] HR > 120 must set urgency_index = 1.0 regardless of status."""
        r = self._post({"heart_rate": 121, "status": "STABLE"})
        assert r.status_code == 201
        assert r.json()["urgency_index"] == 1.0

    def test_hr_exactly_120_urgency_half(self):
        """[T] HR == 120 is NOT > 120, urgency must be 0.5 for STABLE."""
        r = self._post({"heart_rate": 120, "status": "STABLE"})
        assert r.status_code == 201
        assert r.json()["urgency_index"] == 0.5

    def test_warning_status_not_critical_urgency(self):
        """[T] WARNING (non-CRITICAL, HR <= 120) must produce 0.5."""
        r = self._post({"status": "WARNING", "heart_rate": 100})
        assert r.status_code == 201
        assert r.json()["urgency_index"] == 0.5

    def test_critical_and_high_hr_urgency_1(self):
        """[T] CRITICAL + HR > 120 must still produce 1.0 (not double)."""
        r = self._post({"status": "CRITICAL", "heart_rate": 180})
        assert r.status_code == 201
        assert r.json()["urgency_index"] == 1.0


# ==============================================================================
# [Lo] BOUNDARY TESTS — valid extremes
# ==============================================================================

class TestBoundaryValues:
    def _post(self, overrides: dict):
        payload = {
            "patient_id": "BOUND1",
            "heart_rate": 72,
            "spo2": 98.0,
            "temp_c": 37.0,
            "status": "STABLE",
            **overrides,
        }
        return client.post("/etl/clinical/sample", json=payload)

    # Heart rate boundaries
    def test_hr_minimum_30(self):
        assert self._post({"heart_rate": 30}).status_code == 201

    def test_hr_maximum_220(self):
        assert self._post({"heart_rate": 220}).status_code == 201

    # SpO2 boundaries
    def test_spo2_minimum_70(self):
        assert self._post({"spo2": 70.0}).status_code == 201

    def test_spo2_maximum_100(self):
        assert self._post({"spo2": 100.0}).status_code == 201

    # Temperature boundaries
    def test_temp_minimum_34(self):
        assert self._post({"temp_c": 34.0}).status_code == 201

    def test_temp_maximum_43(self):
        assert self._post({"temp_c": 43.0}).status_code == 201

    # Patient ID boundaries
    def test_patient_id_min_length_6(self):
        assert self._post({"patient_id": "ABCD12"}).status_code == 201

    def test_patient_id_max_length_12(self):
        assert self._post({"patient_id": "ABCDE12345XY"}).status_code == 201


# ==============================================================================
# [Lo] RED TEAM — out-of-range attacks
# ==============================================================================

class TestOutOfRangeAttacks:
    def _post(self, overrides: dict):
        payload = {
            "patient_id": "RTAM00",
            "heart_rate": 72,
            "spo2": 98.0,
            "temp_c": 37.0,
            "status": "STABLE",
            **overrides,
        }
        return client.post("/etl/clinical/sample", json=payload)

    def test_hr_below_min_rejected(self):
        assert self._post({"heart_rate": 29}).status_code == 422

    def test_hr_above_max_rejected(self):
        assert self._post({"heart_rate": 221}).status_code == 422

    def test_spo2_below_min_rejected(self):
        assert self._post({"spo2": 69.9}).status_code == 422

    def test_spo2_above_max_rejected(self):
        assert self._post({"spo2": 100.1}).status_code == 422

    def test_temp_below_min_rejected(self):
        assert self._post({"temp_c": 33.9}).status_code == 422

    def test_temp_above_max_rejected(self):
        assert self._post({"temp_c": 43.1}).status_code == 422

    def test_hr_zero_rejected(self):
        assert self._post({"heart_rate": 0}).status_code == 422

    def test_hr_negative_rejected(self):
        assert self._post({"heart_rate": -1}).status_code == 422

    def test_spo2_zero_rejected(self):
        assert self._post({"spo2": 0}).status_code == 422

    def test_temp_extreme_low_rejected(self):
        assert self._post({"temp_c": -40}).status_code == 422

    def test_temp_extreme_high_rejected(self):
        assert self._post({"temp_c": 999}).status_code == 422


# ==============================================================================
# [Lo] RED TEAM — patient_id format attacks
# ==============================================================================

class TestPatientIdAttacks:
    def _post(self, patient_id: str):
        return client.post("/etl/clinical/sample", json={
            "patient_id": patient_id,
            "heart_rate": 72,
            "spo2": 98.0,
            "temp_c": 37.0,
        })

    def test_too_short_rejected(self):
        """5 chars — below minimum of 6."""
        assert self._post("AB123").status_code == 422

    def test_too_long_rejected(self):
        """13 chars — above maximum of 12."""
        assert self._post("ABCDE1234567X").status_code == 422

    def test_lowercase_rejected(self):
        """Lowercase letters violate ^[A-Z0-9]+ invariant."""
        assert self._post("patient").status_code == 422

    def test_hyphen_injection_rejected(self):
        assert self._post("PT-001").status_code == 422

    def test_space_injection_rejected(self):
        assert self._post("PT 001A").status_code == 422

    def test_sql_injection_rejected(self):
        assert self._post("'; DROP").status_code == 422

    def test_special_chars_rejected(self):
        assert self._post("PT@001A").status_code == 422

    def test_empty_string_rejected(self):
        assert self._post("").status_code == 422

    def test_unicode_injection_rejected(self):
        assert self._post("PT001\u0041\u0300").status_code == 422  # A + combining grave

    def test_null_byte_rejected(self):
        assert self._post("PT001\x00A").status_code == 422

    def test_path_traversal_rejected(self):
        assert self._post("../etc/p").status_code == 422


# ==============================================================================
# [Lo] RED TEAM — missing required fields
# ==============================================================================

class TestMissingFields:
    BASE = {"patient_id": "RTAM00", "heart_rate": 72, "spo2": 98.0, "temp_c": 37.0}

    def _post_without(self, key: str):
        payload = {k: v for k, v in self.BASE.items() if k != key}
        return client.post("/etl/clinical/sample", json=payload)

    def test_missing_patient_id_rejected(self):
        assert self._post_without("patient_id").status_code == 422

    def test_missing_heart_rate_rejected(self):
        assert self._post_without("heart_rate").status_code == 422

    def test_missing_spo2_rejected(self):
        assert self._post_without("spo2").status_code == 422

    def test_missing_temp_c_rejected(self):
        assert self._post_without("temp_c").status_code == 422

    def test_empty_body_rejected(self):
        assert client.post("/etl/clinical/sample", json={}).status_code == 422

    def test_wrong_content_type_rejected(self):
        r = client.post(
            "/etl/clinical/sample",
            data="not json",
            headers={"Content-Type": "text/plain"},
        )
        assert r.status_code == 422


# ==============================================================================
# [St] VAULT INTEGRITY TESTS
# ==============================================================================

class TestVaultIntegrity:
    VALID = {
        "patient_id": "VLT001",
        "heart_rate": 72,
        "spo2": 98.0,
        "temp_c": 37.0,
        "status": "STABLE",
    }

    def test_successful_ingest_writes_to_vault(self, clean_vault):
        import cdif_ingress
        # Ensure vault attribute is patched
        client.post("/etl/clinical/sample", json=self.VALID)
        # Read directly from vault path used by module
        vault_path = cdif_ingress.VAULT
        assert vault_path.exists(), "Vault file must be created on first ingest"

    def test_vault_record_is_valid_json(self, clean_vault):
        import cdif_ingress
        client.post("/etl/clinical/sample", json=self.VALID)
        vault_path = cdif_ingress.VAULT
        if vault_path.exists():
            lines = vault_path.read_text().strip().splitlines()
            for line in lines:
                record = json.loads(line)  # must parse cleanly
                assert "ingress_id" in record
                assert "fabric_layer" in record
                assert record["fabric_layer"] == "BRONZE_SAMPLE"

    def test_rejected_record_not_written_to_vault(self, clean_vault):
        import cdif_ingress
        client.post("/etl/clinical/sample", json={"patient_id": "bad!", "heart_rate": 9999})
        vault_path = cdif_ingress.VAULT
        # Vault should not exist or be empty
        assert not vault_path.exists() or vault_path.stat().st_size == 0


# ==============================================================================
# [T] UNIT TESTS — transform function directly
# ==============================================================================

class TestTransformUnit:
    def _make(self, **kwargs):
        defaults = {
            "patient_id": "UNIT01",
            "heart_rate": 72,
            "spo2": 98.0,
            "temp_c": 37.0,
            "status": ClinicalStatus.STABLE,
        }
        defaults.update(kwargs)
        return ClinicalTelemetry(**defaults)

    def test_transform_has_iso_timestamp(self):
        result = transform(self._make())
        ts = result["ingress_ts"]
        assert "T" in ts

    def test_transform_has_uuid_ingress_id(self):
        result = transform(self._make())
        import uuid
        uuid.UUID(result["ingress_id"])  # raises if invalid

    def test_transform_bronze_sample_layer(self):
        result = transform(self._make())
        assert result["fabric_layer"] == "BRONZE_SAMPLE"

    def test_transform_urgency_critical(self):
        result = transform(self._make(status=ClinicalStatus.CRITICAL))
        assert result["urgency_index"] == 1.0

    def test_transform_urgency_hr_boundary(self):
        assert transform(self._make(heart_rate=120))["urgency_index"] == 0.5
        assert transform(self._make(heart_rate=121))["urgency_index"] == 1.0
