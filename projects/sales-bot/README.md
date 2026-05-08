# Sales Bot — WhatsApp AI Sales Operator

A multi-store WhatsApp sales bot that talks to customers like a street-smart luxury-accessories operator. Claude does the reasoning; Supabase holds state; WhatChimp handles the WhatsApp delivery.

## What it does

Customer messages your store's WhatsApp number → bot reads the message, looks up the customer, searches the catalog, and replies in 2–4 short WhatsApp lines. If the customer sends an image, Claude Haiku 4.5 identifies the product and the bot searches for it. If anything unusual happens, the bot tags the chat with a "Human" label inside WhatChimp and goes silent until that label is removed.

## Capabilities

- **Multi-store routing.** A single bot serves N stores, routed by WhatChimp `phone_number_id`. Add a new store by adding a row to `STORE_CONFIG` — no code changes elsewhere.
- **Message batching (4s window).** When a customer fires off 5 quick messages, the bot waits 4 seconds, batches them into one prompt, and replies once. Avoids the "ghost typer" problem.
- **Smart conversation history.** Sends Claude the *first 2* + *last 8* messages — preserves opening context (who is this customer) without burning tokens on the middle.
- **Multi-strategy product search.** Extracts brand/color/category from (a) recent messages, (b) older history, (c) Claude Vision output on inbound images. Fuzzy alias map covers 25+ luxury brands and their typo/abbreviation variants (`lv`, `vuitton`, `luis vuitton` → `Louis Vuitton`).
- **Vision escalation.** If Claude Haiku can't identify an inbound product image, the bot escalates to a human instead of guessing.
- **Human takeover via WhatChimp labels.** Operator adds a "Human" label inside WhatChimp → bot goes silent on every subsequent message. Remove the label → bot resumes. No flows, no reset endpoint, no DB writes from operators — it just works.
- **Intent + archetype tagging.** Every Claude reply ends with `[INTENT:price_inquiry] [ARCHETYPE:speed_buyer]` tags. The system strips them before sending and writes them to a `conversation_outcomes` table. Used to feed back winning examples (the "experience layer").
- **Funnel stage tracking.** Customers move through `new → interested → ...` based on what they engaged with.
- **Follow-up queue.** Cancellable scheduled messages — automatically cancelled when the customer sends a new message (active conversation).
- **Rate limiting.** 20 msg/min/phone. Drops messages above the cap.
- **Message deduplication.** Uses WhatChimp's `wa_message_id` to avoid double-processing webhook retries.
- **Retry decorator.** Async-aware retry wrapper for any flaky external call. Falls back gracefully when Claude / Supabase / WhatChimp are unreachable.
- **Structured JSON logging.** Every event is one line of JSON — easy to ship to Loki / Cloud Logging.

## Files

- [webhook_server.py](webhook_server.py) — FastAPI app, single `POST /webhook` endpoint, message batching loop, dedup + rate-limit checks
- [brain.py](brain.py) — main reasoning loop, vision identification, search-term extraction, Claude call, tag parsing
- [whatchimp_client.py](whatchimp_client.py) — WhatChimp REST client (send / labels / subscriber lookup)
- [supabase_client.py](supabase_client.py) — DB operations across 4 tables: `customers`, `conversations`, `products`, `follow_up_queue`, `conversation_outcomes`
- [config.py](config.py) — `STORE_CONFIG` map, `JSONFormatter` logger, `RateLimiter`, `@retry` decorator
- [test_label_webhook.py](test_label_webhook.py) — manual test script for label-change behavior
- [../../directives/sales_brain.md](../../directives/sales_brain.md) — the sales playbook fed into Claude's system prompt (~530 lines: identity, anchoring ladder, customer archetypes, objection handling, closing protocols)

## Stack

Python 3.12 · FastAPI · uvicorn · `httpx` (async) · Anthropic SDK (Sonnet 4 + Haiku 4.5 vision) · Supabase Python SDK · WhatChimp REST API.

## Schema

```
customers              conversations            products
─────────              ─────────────            ────────
phone (PK)             id (PK)                  id (PK)
name                   customer_phone (FK)      title
store                  role                     brand
funnel_stage           content                  color
human_takeover         message_type             category
last_message_at        image_url                price
                       wa_message_id            currency
                       products_mentioned       compare_at_price
                                                stock_status
follow_up_queue        conversation_outcomes    studio_images
───────────────        ─────────────────────    searchable_name
id (PK)                id (PK)                  store
customer_phone (FK)    customer_phone (FK)
stage                  store
scheduled_at           intent_detected
template_name          archetype_detected
sent                   objection_type
                       outcome
                       products_discussed
                       message_count
```

## Run

```bash
pip install -r requirements.txt
cp ../../.env.example ../../.env  # fill ANTHROPIC_API_KEY, WHATCHIMP_API_TOKEN, WHATCHIMP_PHONE_NUMBER_ID, SUPABASE_URL, SUPABASE_SERVICE_KEY
uvicorn webhook_server:app --host 0.0.0.0 --port 8000
```

Then point WhatChimp's incoming-message webhook at `<your-host>:8000/webhook`.

## Status

Hardened, deployed, currently in active use. Several iterations of brain rewrites, multi-store support, resilience layer, and experience layer. The directive at [`../../directives/sales_brain.md`](../../directives/sales_brain.md) is the distilled product of a 100+ page sales playbook.
