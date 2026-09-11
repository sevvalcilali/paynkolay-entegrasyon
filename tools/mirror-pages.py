#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""İki bölümde birden yer alan sayfaların ikinci kopyasını tek kaynaktan üretir.

Kopya, kaynağın içeriğini taşır; menüsü ve üst başlığı kendi bölümüne aittir, böylece
sol menü ve Önceki/Sonraki kutuları okuru bulunduğu bölümde tutar.
Kaynak değiştiğinde:  python3 tools/mirror-pages.py v1 && python3 tools/check-pager.py v1 --fix
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VER = ROOT / (sys.argv[1] if len(sys.argv) > 1 else 'v1')
# (kaynak, kopya, menü şablonu alınacak kardeş sayfa, bölüm adı)
MIRRORS = [('on-hazirlik/test-kartlari.html', 'ek-bilgiler/test-kartlari.html', 'ek-bilgiler/hash-araci.html', 'Ek Bilgiler')]

SIDEBAR = re.compile(r'<aside class="sidebar.*?</aside>', re.S)

for src, dst, sibling, section in MIRRORS:
    assert len(Path(src).parts) == len(Path(dst).parts), 'göreli bağlantılar için aynı derinlik gerekir'
    s = (VER / src).read_text(encoding='utf-8')
    side = SIDEBAR.search((VER / sibling).read_text(encoding='utf-8')).group(0)
    side = side.replace(' is-active" href="' + Path(sibling).name + '" aria-current="page"', '" href="' + Path(sibling).name + '"')
    side = side.replace('<a class="nav__link" href="' + Path(dst).name + '">',
                        '<a class="nav__link is-active" href="' + Path(dst).name + '" aria-current="page">')
    assert side.count('aria-current="page"') == 1, dst
    s = SIDEBAR.sub(lambda m: side, s, count=1)
    s = re.sub(r'<p class="eyebrow"><a href="index.html">[^<]*</a></p>',
               f'<p class="eyebrow"><a href="index.html">{section}</a></p>', s, count=1)
    (VER / dst).write_text(s, encoding='utf-8')
    print('üretildi:', dst, '←', src)
