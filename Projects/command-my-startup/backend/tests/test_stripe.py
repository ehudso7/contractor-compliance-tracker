from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_stripe_webhook_no_signature():
    response = client.post("/api/stripe/webhook", json={})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid payload or signature"

