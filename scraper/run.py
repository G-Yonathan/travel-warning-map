import requests
import json
import time
import sys

from lookup import GOV_API_DATA_PIC_NAME_TO_ISO, GOV_API_URLNAME_TO_ISO, GOV_API_DATA_COUNTRY_TO_NAME

URL = "https://www.gov.il/he/api/DynamicCollector"
TEMPLATE_ID = "a591accc-14b7-4be8-a7b7-395ca588db53"
BATCH_SIZE = 10
PAUSE = 0.2

HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0"
}


def fetch_batch(offset):
    payload = {
        "DynamicTemplateID": TEMPLATE_ID,
        "QueryFilters": {"skip": {"Query": offset}},
        "From": offset
    }
    r = requests.post(URL, json=payload, headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


def scrape():
    first = fetch_batch(0)
    total = first.get("TotalResults", 0)
    if total <= 0:
        return []

    out = first.get("Results", [])

    offset = BATCH_SIZE
    while offset < total:
        data = fetch_batch(offset)
        batch = data.get("Results", [])
        if not batch:
            break
        out.extend(batch)
        offset += BATCH_SIZE
        time.sleep(PAUSE)

    return out


def transform(records):
    countries = {}
    for it in records:
        name_raw = it.get("Data", {}).get("pic", {}).get("Name")
        urlname_raw = it.get("UrlName")
        details = it.get("Data", {}).get("details")
        other_url = it.get("Data", {}).get("other", {}).get("URL")
        country = it.get("Data", {}).get("country", [[]])[0]

        warning_levels = GOV_API_DATA_PIC_NAME_TO_ISO.get(name_raw, name_raw)
        country_code = GOV_API_URLNAME_TO_ISO.get(urlname_raw, urlname_raw)
        name_entry = GOV_API_DATA_COUNTRY_TO_NAME.get(country, {"he": "NA", "en": "NA"})

        countries[country_code] = {
            "WarningLevels": warning_levels,
            "Details": details,
            "URL": other_url,
            "HebrewName": name_entry["he"],
            "EnglishName": name_entry["en"]
        }

    return {
        "countries": countries,
        "timestamp": int(time.time())
    }


try:
    raw = scrape()
except Exception as e:
    print(f"Scrape failed: {e}")
    sys.exit(1)

try:
    clean = transform(raw)
except Exception as e:
    print(f"Transform failed: {e}")
    sys.exit(1)

with open("clean.json", "w", encoding="utf-8") as f:
    json.dump(clean, f, indent=4, ensure_ascii=False)
