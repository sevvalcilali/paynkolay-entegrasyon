#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v1 arama indeksini üretir: v1/assets/search-index.json

Her sayfa için bir kayıt (başlık + lead) ve her h2 bölümü için bir alt kayıt yazar.
Yeni sayfa eklendiğinde bu script yeniden çalıştırılır:  python3 tools/build-search-index.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "v1"

SECTIONS = {
    "v1": "Başlangıç",
    "on-hazirlik": "Ön Hazırlık",
    "tahsilat-metodu": "Tahsilat Metodu",
    "urunler": "Ürünler",
    "ek-servisler": "Ek Servisler",
    "pazaryeri": "Pazaryeri Entegrasyonu",
    "open-source": "Open Source",
    "ek-bilgiler": "Ek Bilgiler",
}


def text_of(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()


records = []
for page in sorted(ROOT.rglob("*.html")):
    rel = page.relative_to(ROOT).as_posix()
    folder = page.parent.name if page.parent != ROOT else "v1"
    section = SECTIONS.get(folder, folder)

    s = page.read_text(encoding="utf-8")
    m = re.search(r"<title>([^<]*?)(?:\s*—\s*Paynkolay Docs)?</title>", s)
    title = m.group(1).strip() if m else rel

    m = re.search(r'<p class="lead">(.*?)</p>', s, re.S)
    lead = text_of(m.group(1)) if m else ""

    records.append({"u": rel, "b": section, "t": title, "d": lead})

    for hm in re.finditer(r'<h2 id="([^"]+)"[^>]*>(.*?)</h2>', s, re.S):
        records.append({
            "u": rel + "#" + hm.group(1),
            "b": section + " › " + title,
            "t": text_of(hm.group(2)),
            "d": "",
        })

out = ROOT / "assets" / "search-index.json"
out.write_text(json.dumps(records, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("kayit:", len(records), "→", out, "(%.1f KB)" % (out.stat().st_size / 1024))
