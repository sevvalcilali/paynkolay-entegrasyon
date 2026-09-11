#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Önceki/Sonraki denetimi: her sayfanın pager'ı sol menü sırasına uymalı.

Sıra, ana sayfa menüsündeki bağlantıların ilk görüldüğü konumdur; başka bölüme açılan
kısayollar (ör. Ek Bilgiler'deki Test Kartları) ve indirme dosyaları zincire girmez.
Kullanım: python3 tools/check-pager.py v1 [--fix]
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VER = ROOT / (sys.argv[1] if len(sys.argv) > 1 else 'v1')
FIX = '--fix' in sys.argv
# Bilinçli istisnalar: sayfa → {etiket: hedef}
EXCEPTIONS = {'tahsilat-metodu/api-3ds.html': {'Önceki': 'tahsilat-metodu/api-non3ds.html'}}

PAGER = re.compile(r'<nav class="pager".*?</nav>', re.S)
CARD = re.compile(r'<a class="pager__card[^"]*" href="([^"]+)">.*?<span class="pager__label">([^<]+)</span>\s*'
                  r'<span class="pager__title">([^<]*)</span>', re.S)
PREV_ICON = ('<svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
             'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>')
NEXT_ICON = PREV_ICON.replace('m15 6-6 6 6 6', 'm9 6 6 6-6 6')

nav = re.search(r'<nav class="nav">.*?</nav>', (VER / 'index.html').read_text(encoding='utf-8'), re.S).group(0)
order, titles = [], {}
for href, text in re.findall(r'<a class="nav__link[^"]*" href="([^"]+)"[^>]*>(.*?)</a>', nav, re.S):
    path = os.path.normpath(href)
    if href.startswith('http') or not path.endswith('.html') or path in titles:
        continue
    titles[path] = re.sub(r'<[^>]+>', '', text).strip()
    order.append(path)


def rel(frm, to):
    return os.path.relpath(to, os.path.dirname(frm) or '.')


def build(page, prev, nxt):
    out = ['<nav class="pager" aria-label="Sayfalar arası gezinme">']
    if prev:
        out += [f'  <a class="pager__card" href="{rel(page, prev)}">', f'    {PREV_ICON}',
                f'    <span class="pager__meta"><span class="pager__label">Önceki</span><span class="pager__title">{titles[prev]}</span></span>',
                '  </a>']
    if nxt:
        out += [f'  <a class="pager__card pager__card--next" href="{rel(page, nxt)}">',
                f'    <span class="pager__meta"><span class="pager__label">Sonraki</span><span class="pager__title">{titles[nxt]}</span></span>',
                f'    {NEXT_ICON}', '  </a>']
    return '\n'.join(out + ['</nav>'])


problems = 0
for i, page in enumerate(order):
    want = {'Önceki': order[i - 1] if i else None, 'Sonraki': order[i + 1] if i + 1 < len(order) else None}
    want.update(EXCEPTIONS.get(page, {}))
    f = VER / page
    s = f.read_text(encoding='utf-8')
    m = PAGER.search(s)
    if not m and page == 'index.html':   # v8 ana sayfası kendi kapanış bandını kullanır
        continue
    got = {lab: (os.path.normpath(os.path.join(os.path.dirname(page), h)), t)
           for h, lab, t in CARD.findall(m.group(0))} if m else {}
    issues = []
    for lab in ('Önceki', 'Sonraki'):
        g, w = got.get(lab), want[lab]
        if (g[0] if g else None) != w:
            issues.append(f'{lab}: {g[0] if g else "—"} → {w or "—"}')
        elif g and g[1] != titles[w]:
            issues.append(f'{lab} başlığı: "{g[1]}" → "{titles[w]}"')
    if issues:
        problems += 1
        print(page, '|', '; '.join(issues))
        if FIX and m:
            f.write_text(s.replace(m.group(0), build(page, want['Önceki'], want['Sonraki']), 1), encoding='utf-8')
print('sorunlu sayfa:', problems, '(düzeltildi)' if FIX and problems else '')
