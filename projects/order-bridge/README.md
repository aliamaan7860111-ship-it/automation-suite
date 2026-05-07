# Order Bridge

Sits between Notion (CRM), Telegram (operators), WhatChimp (WhatsApp), and Filex (courier API). When an order's status changes in Notion, this bridge orchestrates the rest of the fulfillment pipeline.

## What it does

1. Polls the Notion Orders DB every 5 seconds for status changes.
2. **Confirmed** → posts order details + product images to the Telegram **Sourcing** group, then fires the brand-specific WhatsApp confirmation template via WhatChimp.
3. **Sourcing replies `#ready ORDERID`** → cross-posts to the **Fulfillment** group with a one-tap label-printing button.
4. **`/print ORDERID` in Telegram** → builds the Filex shipping payload, calls the Filex API, attaches the AWB back to Notion, and uploads the printable label PDF.
5. **Filex webhook (delivery status)** → maps to a Notion status field via [filex_status_mapper.py](filex_status_mapper.py).

## Files

- [order_bridge.py](order_bridge.py) — main loop, Telegram command dispatch, `/print` and `/printall` handlers
- [filex_client.py](filex_client.py) — auth + create-shipment + label-PDF API client
- [filex_payload_builder.py](filex_payload_builder.py) — Notion order → Filex shipment payload
- [filex_city_normalizer.py](filex_city_normalizer.py) — UAE city normalization (10+ aliases per city)
- [filex_status_mapper.py](filex_status_mapper.py) — Filex tracking status → Notion status enum
- [filex_reconcile.py](filex_reconcile.py) — periodic reconciliation job for orphaned shipments
- [whatchimp_client.py](whatchimp_client.py) — WhatsApp template sender + subscriber lookup

## Stack

Python 3.12 · `python-telegram-bot` · `httpx` · `python-dotenv` · Notion REST API · Filex Shipper API · WhatChimp REST API.

## Run

```bash
pip install -r ../../requirements.txt
cp ../../.env.example ../../.env  # fill credentials
python order_bridge.py
```

Tests for this module live in [../../tests/](../../tests/).
