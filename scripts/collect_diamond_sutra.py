#!/usr/bin/env python3
"""Collect the complete Sanskrit Diamond Sutra from the DSBC parallel texts."""

from __future__ import annotations

import html
import re
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "data" / "sutra" / "diamond-sutra"

EDITIONS = (
    (
        "https://www.dsbcproject.org/canon-text/content/76/633",
        "sanskrit-iast.txt",
        "vajracchedikā nāma triśatikā prajñāpāramitā",
        "||āryavajracchedikā bhagavatī prajñāpāramitā samāptā||",
    ),
    (
        "https://www.dsbcproject.org/canon-text/content/403/1863",
        "sanskrit-devanagari.txt",
        "वज्रच्छेदिका नाम त्रिशतिका प्रज्ञापारमिता।",
        "॥आर्यवज्रच्छेदिका भगवती प्रज्ञापारमिता समाप्ता॥",
    ),
)


def extract_text(page: str, start: str, end: str) -> str:
    start_at = page.index(start)
    end_at = page.index(end, start_at) + len(end)
    text = page[start_at:end_at]
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text).replace("\r", "")
    # DSBC's Romanized section 27 contains one legacy-font private-use glyph
    # in "gaṅgānadīvālukāsamāṃllokadhātūn"; it represents anusvāra.
    text = text.replace("\uf141", "ṃ")
    lines = [line.strip() for line in text.splitlines()]

    cleaned: list[str] = []
    for line in lines:
        if line:
            cleaned.append(line)
        elif cleaned and cleaned[-1] != "":
            cleaned.append("")

    return "\n".join(cleaned).strip() + "\n"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for url, filename, start, end in EDITIONS:
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "Sutra text collector/1.0"},
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            page = response.read().decode("utf-8")

        text = extract_text(page, start, end)
        if "||32||" not in text and "॥३२॥" not in text:
            raise RuntimeError(f"{filename}: section 32 was not found")
        if not text.rstrip().endswith(end):
            raise RuntimeError(f"{filename}: final colophon was not found")

        (OUTPUT_DIR / filename).write_text(text, encoding="utf-8")
        print(f"{filename}: {len(text)} characters")


if __name__ == "__main__":
    main()
