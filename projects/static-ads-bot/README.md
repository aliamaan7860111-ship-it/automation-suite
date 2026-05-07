# Static Ads Bot

Slack bot that turns a product photo + brand brief into a finished static ad. Operators upload an image in a Slack channel, pick a brand from the dropdown, and 30 seconds later the bot drops the rendered ad back into the thread.

## How it works

```
   Slack /ad command
        │
        ▼
   slack_ui.py    ──► modal: brand selector + image upload + style hint
        │
        ▼
   claude_engine.py ──► Claude builds an ad concept JSON (headline, layout, mood)
        │
        ▼
   image_engine.py  ──► Fal.ai (FLUX) composites product into the concept
        │
        ▼
   Gemini upscale   ──► 640×640 → 2048×2048
        │
        ▼
   Posts back to Slack thread
```

## Files

- [static_ads_bot.py](static_ads_bot.py) — Slack Bolt app entry, slash command + event router
- [slack_ui.py](slack_ui.py) — Block Kit modals (brand picker, brief form, result view)
- [claude_engine.py](claude_engine.py) — Claude prompt orchestration, concept-JSON parsing
- [image_engine.py](image_engine.py) — Fal.ai FLUX subscribe + upscaling

## Stack

Python 3.12 · `slack-bolt` · Anthropic SDK · `fal-client` · Gemini SDK.

## Run

```bash
pip install -r ../../requirements.txt
cp ../../.env.example ../../.env  # fill SLACK_*, ANTHROPIC_API_KEY, FAL_KEY, NANO_BANANA_GEMINI_API_KEY
python static_ads_bot.py
```

The bot needs Slack `chat:write`, `commands`, `files:read`, `files:write`, and `app_mentions:read` scopes.
