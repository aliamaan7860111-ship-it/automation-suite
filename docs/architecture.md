# Architecture

The automation suite is designed around a single source of truth (Notion) with multiple message-bus integrations (Telegram, WhatsApp via WhatChimp, Slack) and one courier integration (Filex).

## Data layer — Notion

Four databases:

| DB | Used by | Purpose |
|---|---|---|
| **Orders** | order-bridge, whatsapp-confirmation | One row per Shopify order. Status field drives the entire fulfillment pipeline. |
| **Leads** | rpgrq-leads-bot | One row per (phone, brand). Tracks every customer conversation. |
| **Roster** | rpgrq-leads-bot | Active agents, their WhatChimp team-member IDs, shift windows. |
| **Reports** | rpgrq-leads-bot legacy | Daily aggregate stats, written by `daily_report.py`. |

Why Notion (and not Postgres):
- Operators already live in Notion every day — kanban views, filters, comments are free.
- No admin UI to build.
- We pay the latency cost of hitting Notion's REST API for every lookup; in exchange we get real-time visibility for non-technical staff without writing a single dashboard.

## Compute

All Python services run on a single GCE VM under systemd. Unit files (template versions, with secrets stripped) live in the live private repo; this public repo doesn't include them since paths and account specifics aren't useful for a showcase.

The careers site runs separately on a managed Next.js host.

## Message bus

- **Telegram** for internal operator workflow (sourcing → fulfillment → label printing). Push-based via webhook + python-telegram-bot.
- **WhatsApp via WhatChimp** for customer-facing messaging. Templates for outbound, webhooks for inbound. Per-brand routing keyed by 2-char order-ID prefix.
- **Slack** for the internal ad-generation workflow. Bolt SDK, modal-driven UX.

## Trust boundary

There are two trust boundaries:
1. **Filex webhooks** — verified via `FILEX_WEBHOOK_TOKEN` shared secret on every inbound delivery-status update.
2. **WhatChimp webhooks** — currently unauthenticated; mitigated by parsing `wa_message_id` and short-circuiting if the message isn't in our expected shape.

## Why event-driven (rpgrq v2 vs v1)

v1 polled WhatChimp every 15 seconds — 5,760 hits per day per brand × 5 brands = 28,800 hits. WhatChimp throttled this. v2 listens for webhooks: zero ambient load, sub-second response time, no missed events. Only cost: one always-on FastAPI process.

## Why polling (order-bridge)

Notion doesn't expose webhooks for property changes on database rows. Polling at 5s is the only option. Cost is low — one query per cycle, filtered to only newly-updated rows since the last cycle's checkpoint.
