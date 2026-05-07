# RPGRQ Leads Bot

Webhook-driven CRM for 5 WhatsApp numbers. Every inbound customer message becomes a Notion ticket; every outbound reply gets attributed to the agent who sent it. Round-robin assigns new leads to whichever agents are on shift.

## v2 (current — event-driven, FastAPI)

[rpgrq_webhook_server.py](rpgrq_webhook_server.py) listens on two endpoints:

- `POST /rpgrq/incoming` — fires when a customer messages one of the 5 brand WhatsApp numbers.
- `POST /rpgrq/outgoing` — fires when our team replies.

Flow:
- Inbound message → look up Notion ticket by (phone, brand). Create if missing, assign next agent in rotation, mirror that assignment to WhatChimp's chat-assignment endpoint.
- Outbound message → fetch last conversation entry from WhatChimp to read the agent name, stamp the ticket, compute response time.

## v1 (legacy — polling)

[legacy/agent_tracking_bot.py](legacy/) polled WhatChimp every 15s for new conversations. Replaced by v2 because (a) cheaper, (b) no missed events, (c) sub-second response latency.

## Files

- [rpgrq_webhook_server.py](rpgrq_webhook_server.py) — FastAPI app
- [rpgrq_notion.py](rpgrq_notion.py) — async Notion client (Leads DB + Roster DB)
- [rpgrq_round_robin.py](rpgrq_round_robin.py) — pulls active roster, returns next agent based on assignment count
- [rpgrq_whatchimp.py](rpgrq_whatchimp.py) — WhatChimp API: assign-to-team-member + get-conversation
- [legacy/](legacy/) — v1 polling implementation, kept for reference

## Stack

Python 3.12 · FastAPI · uvicorn · `httpx` (async) · Notion REST API · WhatChimp REST API.

## Run

```bash
pip install -r ../../requirements.txt
cp ../../.env.example ../../.env  # fill credentials, including LEADS_DB_ID, ROSTER_DB_ID, BRAND_PHONE_MAP_JSON
uvicorn rpgrq_webhook_server:app --host 0.0.0.0 --port 8082
```

Then point WhatChimp's webhook config at `<your-host>:8082/rpgrq/incoming` and `/rpgrq/outgoing`.
