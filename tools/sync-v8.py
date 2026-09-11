#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v1 → v8 eşitleme: alt sayfaların içeriği, menüsü ve TOC'u v1'den alınır;
v8'in üç bölgeli üst çubuğu, atlama bağlantısı, menü durumu betiği ve sayfa ayırıcı çizgisi eklenir.
v8/index.html kendi gövdesini korur; yalnızca sol menüsü v1 ana sayfasınınkiyle değiştirilir.

Kullanım: python3 tools/sync-v8.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V1, V8 = ROOT / 'v1', ROOT / 'v8'
HEADER = re.compile(r'  <header class="topbar">.*?</header>\n', re.S)
SIDEBAR = re.compile(r'<aside class="sidebar.*?</aside>', re.S)

tpl = HEADER.search((V8 / 'index.html').read_text(encoding='utf-8')).group(0)


def header_for(depth):
    prefix = '../' * depth
    if not prefix:
        return tpl
    h = re.sub(r'(href|src)="(?!https?:|#|mailto:)([^"]+)"', lambda m: f'{m.group(1)}="{prefix}{m.group(2)}"', tpl)
    return h


def convert(src, depth):
    s = HEADER.sub(lambda m: '  <a class="skiplink" href="#icerik">İçeriğe atla</a>\n\n' + header_for(depth), src, count=1)
    s = re.sub(r'(  <script src="[^"]*theme\.js"></script>\n)',
               lambda m: m.group(1) + m.group(1).replace('theme.js', 'menustate.js'), s, count=1)
    s = s.replace('<div class="content">', '<div class="content" id="icerik">', 1)
    s = s.replace('\n<nav class="pager"', '\n<div class="rule rule--pager" aria-hidden="true"></div>\n<nav class="pager"', 1)
    s = s.replace('v1 · Versiyonlar', 'v8 · Versiyonlar')
    return s


count = 0
for p in sorted(V1.rglob('*.html')):
    rel = p.relative_to(V1)
    if rel == Path('index.html'):
        continue
    out = convert(p.read_text(encoding='utf-8'), len(rel.parts) - 1)
    dst = V8 / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not dst.exists() or dst.read_text(encoding='utf-8') != out:
        dst.write_text(out, encoding='utf-8')
        count += 1

idx = V8 / 'index.html'
home = idx.read_text(encoding='utf-8')
v1_side = SIDEBAR.search((V1 / 'index.html').read_text(encoding='utf-8')).group(0)
new_home = SIDEBAR.sub(lambda m: v1_side, home, count=1)
if new_home != home:
    idx.write_text(new_home, encoding='utf-8')
    count += 1

orphans = sorted(str(p.relative_to(V8)) for p in V8.rglob('*.html') if not (V1 / p.relative_to(V8)).exists())
print('güncellenen v8 sayfası:', count)
print('v1\'de karşılığı olmayan v8 sayfası:', orphans or 'yok')
