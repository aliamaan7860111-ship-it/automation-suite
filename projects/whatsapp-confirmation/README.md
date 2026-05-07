# WhatsApp Confirmation Bot

Standalone bot that fires the WhatsApp order-confirmation template (per brand) for newly-created Notion orders. Used as a fallback when the order-bridge isn't running, or for backfilling historical orders.

## Files

- [whatsapp_confirmation_bot.py](whatsapp_confirmation_bot.py) — polls Notion, picks the right brand template, calls WhatChimp.

## Stack

Python 3.12 · `httpx` · WhatChimp REST API · Notion REST API.

## Run

```bash
pip install -r ../../requirements.txt
cp ../../.env.example ../../.env
python whatsapp_confirmation_bot.py
```
