import { WebSocket } from "ws"; 
import pgpkg from "pg"; const { Client } = pgpkg;
const WS = process.env.INDEXER_RPC_WS || "ws://node:26657/websocket";
const DB = process.env.INDEXER_DB_URL || "postgresql://socialblock:socialblock@db:5432/socialblock";
const pg = new Client({ connectionString: DB });
async function ensure(){ await pg.query(`create table if not exists blocks(height bigint primary key, time text)`); }
async function run(){
  await pg.connect(); await ensure();
  const ws = new WebSocket(WS);
  ws.on("open", ()=> ws.send(JSON.stringify({jsonrpc:"2.0",method:"subscribe",id:"1",params:{query:"tm.event='NewBlock'"}})));
  ws.on("message", async (raw)=>{ try{ const msg = JSON.parse(raw.toString()); const d = msg.result?.data; if(!d) return;
    if(d.type==="tendermint/event/NewBlock"){ const h=Number(d.value.block.header.height), t=d.value.block.header.time; 
      await pg.query("insert into blocks(height,time) values($1,$2) on conflict do nothing",[h,t]); console.log("block",h); }
  }catch(e){ console.error(e); }});
}
run().catch(e=>{console.error(e);process.exit(1)});
