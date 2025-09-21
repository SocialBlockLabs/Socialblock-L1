from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
import os, time, json
import psycopg2
import psycopg2.extras

API_KEY = os.getenv("ARP_AGENT_API_KEY", "dev-key")
DB_URL = os.getenv("ARP_AGENT_DB_URL", "postgresql://socialblock:socialblock@db:5432/socialblock")

app = FastAPI(title="SocialBlock ARP Agent")

class Attestation(BaseModel):
    address: str
    timestamp: int = int(time.time())
    score: float
    factors: Dict[str, float] = {}
    explanation: Optional[str] = None

def auth(x_api_key: Optional[str]):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="invalid api key")

def db():
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    return conn

@app.on_event("startup")
def init():
    conn = db()
    with conn.cursor() as cur:
        cur.execute("""
        create table if not exists arp_attestations (
          address text primary key,
          timestamp bigint not null,
          score double precision not null,
          factors jsonb not null,
          explanation text
        )
        """)
    conn.close()

@app.get("/healthz")
def health():
    try:
        conn = db(); conn.close()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/attestations")
def post_attestation(att: Attestation, x_api_key: Optional[str] = Header(None)):
    auth(x_api_key)
    conn = db()
    with conn.cursor() as cur:
        cur.execute(
            "insert into arp_attestations(address, timestamp, score, factors, explanation) values (%s,%s,%s,%s,%s) "
            "on conflict (address) do update set timestamp=excluded.timestamp, score=excluded.score, factors=excluded.factors, explanation=excluded.explanation",
            (att.address, att.timestamp, att.score, json.dumps(att.factors), att.explanation)
        )
    conn.close()
    return {"ok": True, "address": att.address, "timestamp": att.timestamp}

@app.get("/v1/attestations/{addr}")
def get_attestation(addr: str, x_api_key: Optional[str] = Header(None)):
    auth(x_api_key)
    conn = db()
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("select address, timestamp, score, factors, explanation from arp_attestations where address=%s", (addr,))
        row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return row
