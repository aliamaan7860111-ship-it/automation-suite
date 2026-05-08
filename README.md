# Automation Suite

A collection of production automation tools running across 5 e-commerce stores. Each project solves a specific operational problem — order fulfillment, customer routing, ad generation, hiring — and they share a common stack: Python, Notion as a database, Telegram + WhatsApp for human-in-the-loop, Claude + Fal.ai + Gemini for AI tasks.

> Identifiers (Notion DB IDs, WhatChimp phone IDs, brand names) are redacted in this public repo. The live deployment runs from a private mirror.

## Projects

| Project | Stack | What it does |
|---|---|---|
| [order-bridge](projects/order-bridge/) | Python · Notion · Telegram · WhatChimp · Filex API | When an order hits "Confirmed" in Notion, push it to a Telegram sourcing group, build the Filex shipping payload, send the WhatsApp confirmation template, and reconcile delivery status back to Notion. |
| [rpgrq-leads-bot](projects/rpgrq-leads-bot/) | Python · FastAPI · Notion · WhatChimp | Webhook-driven CRM for 5 WhatsApp brands. Round-robin assigns inbound leads to on-shift agents, syncs labels, tracks response times. v2 is event-driven; `legacy/` contains the v1 polling implementation. |
| [sales-bot](projects/sales-bot/) | Python · FastAPI · Claude (Sonnet + Haiku Vision) · Supabase · WhatChimp | Multi-store WhatsApp AI sales bot. Talks to customers like a street-smart luxury operator: 4-second message batching, fuzzy brand search (25+ luxury brands), vision-based image identification, label-driven human takeover, intent/archetype tagging fed back into a conversation-outcomes experience layer. |
| [static-ads-bot](projects/static-ads-bot/) | Python · Slack Bolt · Claude · Fal.ai · Gemini | Slack bot that turns a product image + brand brief into a finished static ad. Claude writes the concept, Fal.ai composites, Gemini upscales. |
| [whatsapp-confirmation](projects/whatsapp-confirmation/) | Python · WhatChimp | Standalone bot that fires a per-brand WhatsApp confirmation template for newly-confirmed orders. |
| [clean-media](projects/clean-media/) | Python · Pillow · Flask | Removes EXIF metadata from product images and exposes a small web UI for manual cleanup. |
| [careers-site](projects/careers-site/) | Next.js 15 · Tailwind v4 · Framer Motion · Notion API | Public careers site for the holding company. Notion-backed job listings, custom hero with WebGL globe, 3-stage application flow, operator portal. |

## Architecture

```
                                ┌──────────────────────────────┐
                                │            Notion             │
                                │  Orders DB · Leads DB         │
                                │  Roster DB · Reports DB       │
                                └──────────┬──────────┬─────────┘
                                           │          │
              ┌─────────────────┐  ┌───────▼─────┐  ┌─▼──────────────┐
              │ Static Ads Bot  │  │ Order       │  │ RPGRQ Leads    │
              │  (Slack)        │  │ Bridge      │  │ Bot (FastAPI)  │
              └─────┬───────────┘  └─┬─────┬─────┘  └────┬───────────┘
                    │                │     │             │
              ┌─────▼─────┐  ┌───────▼─┐ ┌─▼──────┐  ┌───▼────────┐
              │ Claude    │  │ Telegram │ │ Filex  │  │ WhatChimp  │
              │ Fal.ai    │  │ Groups   │ │ API    │  │ (5 WA #'s) │
              │ Gemini    │  └──────────┘ └────────┘  └────────────┘
              └───────────┘
```

## Running locally

Each project has its own `README.md` and runs independently. Most Python projects share a virtualenv:

```bash
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in credentials
python projects/order-bridge/order_bridge.py
```

The careers site:

```bash
cd projects/careers-site
npm install
npm run dev
```

## Repo layout

```
automation-suite/
├── projects/         # one folder per service (see table above)
├── shared/           # notion_client.py, telegram_client.py
├── directives/       # internal design specs for each bot
├── tests/            # pytest suite (Filex client, payload builder, print dispatch)
├── docs/             # architecture notes
├── .env.example      # template — copy to .env, fill in credentials
└── requirements.txt  # shared Python deps
```

## Deployment

Live versions run on a GCE VM under systemd (one unit per service). This public repo is a sanitized snapshot — production runs from a separate private mirror so deployments and showcase don't drift.

## License

MIT — see [LICENSE](LICENSE).
