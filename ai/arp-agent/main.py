from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
import os, time
API_KEY = os.getenv("ARP_AGENT_API_KEY", "dev-key")
app = FastAPI(title="SocialBlock ARP Agent")
class Attestation(BaseModel):
    address: str
    timestamp: int = int(time.time())
    score: float
    factors: Dict[str, float] = {}
    explanation: Optional[str] = None
DB: Dict[str, Attestation] = {}
def auth(x_api_key: Optional[str]):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="invalid api key")
@app.post("/v1/attestations")
def post_attestation(att: Attestation, x_api_key: Optional[str] = Header(None)):
    auth(x_api_key); DB[att.address] = att; return {"ok": True, "address": att.address, "timestamp": att.timestamp}
@app.get("/v1/attestations/{addr}")
def get_attestation(addr: str, x_api_key: Optional[str] = Header(None)):
    auth(x_api_key); att = DB.get(addr); 
    if not att: raise HTTPException(status_code=404, detail="not found")
    return att
