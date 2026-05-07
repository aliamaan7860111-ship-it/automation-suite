import os
import requests
import json
from dotenv import load_dotenv
from pathlib import Path

# Load env variables
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

WHATCHIMP_API_TOKEN = os.getenv("WHATCHIMP_API_TOKEN", "")
WHATCHIMP_PHONE_NUMBER_ID = os.getenv("WHATCHIMP_PHONE_NUMBER_ID", "")

# 1. Fetch Postbacks
print("--- FETCHING POSTBACK LIST ---")
url_pb = "https://app.whatchimp.com/api/v1/whatsapp/get/post-back-list"
payload_pb = {
    "apiToken": WHATCHIMP_API_TOKEN,
    "phone_number_id": WHATCHIMP_PHONE_NUMBER_ID
}
resp_pb = requests.post(url_pb, data=payload_pb)
if resp_pb.status_code == 200:
    print(json.dumps(resp_pb.json(), indent=2))
else:
    print(f"Error fetching postbacks: {resp_pb.status_code} - {resp_pb.text}")

# 2. Fetch Template Details
TEMPLATE_ID = os.getenv("DEBUG_TEMPLATE_ID", "")
print(f"\n--- FETCHING TEMPLATE DETAILS ({TEMPLATE_ID}) ---")
url_temp = "https://app.whatchimp.com/api/v1/whatsapp/template/list"
resp_temp = requests.post(url_temp, data=payload_pb)
if resp_temp.status_code == 200:
    templates = resp_temp.json().get("data", [])
    for t in templates:
        if str(t.get("id")) == TEMPLATE_ID:
            print(json.dumps(t, indent=2))
else:
    print(f"Error fetching templates: {resp_temp.status_code} - {resp_temp.text}")
