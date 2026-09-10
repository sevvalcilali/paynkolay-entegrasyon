# PLANLAMA — Entegrasyon Portalı

*Durum: TASLAK — Şevval onaylayınca uygulanmaya başlanır. Revize ve eklemeler bu dosya üzerinden yürür.*

Fazlar küçük ve gösterilebilir tutulur: **Faz 1** kabuğu ayağa kaldırır, **Faz 2** tema + dili çalışır yapar, sonrası (Faz 3+) park alanında bekler — büyük ayrıntılar oraya geldiğimizde birlikte konuşulur.

## Çalışma modeli: Tasarım Versiyonları

Şevval'in kararı (2026-09-02): Tasarım tek bir yön olarak değil, **versiyonlar halinde** ilerler.

- Repo kökündeki `index.html` koyu temalı bir **galeri** sayfasıdır; her versiyon bir karttır, karta tıklayınca o versiyonun prototipi açılır.
- Her versiyon kendi klasöründe, **kendi içinde bağımsız** yaşar: `v1/`, `v2/`, … (kendi assets'iyle; versiyonlar birbirinin dosyasına bağımlanmaz).
- `v1` = Lacivert Ray (mevcut tasarım). Şevval'in aklındaki ~5 fikir geldikçe `v2+` olarak eklenecek; beğenilen yön seçilip derinleştirilecek.
- Her versiyon sayfasında sol altta galeriye dönüş rozeti (`v1 · Versiyonlar`) bulunur.

---

## FAZ 1 — Doküman Kabuğu + Açılır Sol Panel

### 1.1 Hedef

docs.iyzico.com'daki gibi **tertemiz bir doküman kabuğu**:

- Üstte sade bar, solda **açılır-kapanır (accordion) navigasyon paneli**, ortada içerik alanı.
- Paynkolay kimliğiyle: beyaz zeminler + kurumsal mavi `#0C34E7`.
- İçerik henüz gerçek değil; kabuğun *dolu görünmesi* için "Başlangıç" sayfasına placeholder hub kartları konur.

**Bitti sayılma kriteri:** `index.html` tarayıcıda açıldığında iyzico ferahlığında bir sayfa; sol menü aç/kapa çalışıyor, aktif başlık vurgulu, mobilde düzgün; panel üstünde TR/EN kutusu, sayfa altında Önceki/Sonraki kartları görünüyor.

**Faz 1'de yapılmayacaklar:** gerçek içerik göçü, API referans sayfaları, arama işlevi, sağ "Bu sayfada" scroll takibi, tema anahtarının çalışması (Faz 2), EN içerik (Faz 3+).

### 1.2 Teknoloji (onay bekliyor)

**Öneri: framework'süz — saf HTML + CSS + vanilla JS.**
Tek amaç tasarımı görmek; dosyayı çift tıklayıp açabilmek. İleride istenirse framework'e taşınır.

### 1.3 Dosya mimarisi

```
paynkolay-entegrasyon/
├── index.html              ← Başlangıç sayfası (kabuk + placeholder hub)
├── assets/
│   ├── css/
│   │   ├── tokens.css      ← TEK doğru kaynak: renk, tipografi, boşluk, gölge, köşe
│   │   ├── base.css        ← reset, temel tipografi, semantic öğe stilleri
│   │   ├── layout.css      ← kabuk ızgarası: header, sidebar, içerik alanı
│   │   └── components.css  ← kart, buton, chip, callout, menü, sayfa altı gezinme
│   ├── js/
│   │   └── sidebar.js      ← accordion aç/kapa, aktif durum, mobil çekmece
│   └── img/                ← logo + SVG ikonlar (chevron, güneş/ekran/ay vb.)
├── ANALIZ.md · TALIMATLAR.md · PLANLAMA.md
```

Kurallar:
- HTML'e satır içi stil/renk yazılmaz; her şey token'lardan gelir.
- **Token mimarisi Faz 2'ye hazır kurulur:** açık tema değerleri `:root`'ta CSS değişkeni olarak tanımlanır; koyu tema Faz 2'de sadece değişken değerlerini değiştirerek gelir (`[data-theme="dark"]`). Böylece Faz 2'de tek satır bileşen kodu değişmez.

### 1.4 Sol panel — bilgi mimarisi (TASLAK, birlikte netleşecek)

Panelin **en üstünde TR/EN dil kutusu** (iyzico'daki gibi yuvarlak köşeli açılır kutu — Faz 1'de görsel, işlevi Faz 3+).

Ana başlıklar (Şevval'in belirlediği 7'li):

| # | Ana başlık | Taslak alt başlıklar (eski sayfalardan eşleme) |
|---|---|---|
| 1 | **Başlangıç** | (tek sayfa — karşılama/hub, alt menüsü yok) |
| 2 | **Ön Hazırlık** | Başvuru ve İlk Adımlar · Hangi Yöntem Size Uygun? · Entegrasyon Kontrol Listesi · Test Ortamı (Sandbox) · Test vs Canlı Ortam · Test Kartları *(2026-09-03: Şevval'in isteğiyle Paratika "İlk Adımlar" + iyzico "Ön Hazırlıklar" harmanı olarak yeniden kuruldu — önce yol gösterme, sonra test bilgileri)* |
| 3 | **Tahsilat Metodu** | API (3D · NON3D) · Form ile Ödeme · Linkli Ödeme · Ön Provizyon · Düzenli Ödeme *(2026-09-03: Şevval'in belirlediği yeni liste; hub + 5 alt sayfa iskeleti kuruldu, içerikler tek tek dolacak)* |
| 4 | **Ürünler** | Pazaryeri · Masterpass · Sigorta Ödemesi |
| 5 | **Ek Servisler** | Kart Saklama · Tekrarlayan Ödeme · Ön Provizyon · Taksit Servisi · Raporlama · İptal & İade |
| 6 | **Open Source Entegrasyonlar** | WooCommerce · OpenCart · Magento 2.x · Magento 1.9 · PrestaShop · GiveWP · WHMCS |
| 7 | **Sıkça Sorulan Sorular** | (tek sayfa; TLS hataları / hata & banka kodları buraya mı, ayrı mı — açık soru) |

Faz 1'de alt başlıklar **link görünümlü placeholder** (tıklayınca sayfa değişmez).

**Açık sorular (menü metnini etkiler, Faz 1'i bloklamaz):**
- Hash / güvenlik sayfaları (04, 05, 10) nereye? (Önerim: "Ön Hazırlık" altına "Güvenlik & Hash".)
- Hata kodları + banka kodları: SSS altına mı, "Ek Bilgiler" tarzı 8. başlığa mı?

### 1.5 Sol panel — davranış (iyzico paritesi)

1. **Accordion:** Ana başlığa tıklayınca alt liste açılır/kapanır; chevron döner; ~200ms yumuşak animasyon; birden fazla başlık aynı anda açık kalabilir.
2. **Aktif durum:** Bulunulan sayfa açık mavi zemin + mavi metin; ana başlığı otomatik açık gelir.
3. **Sticky + kendi scroll'u:** Panel ekrana yapışık; uzun menü kendi içinde kayar.
4. **Hover:** Hafif zemin değişimi.
5. **Mobil (≤ ~1024px):** Hamburger → soldan kayan çekmece + karartma. Kapatma: çarpı, karartma, Esc.
6. **Erişilebilirlik:** `<button aria-expanded>` başlıklar, `<nav>` sarmalayıcı, klavye gezinmesi, görünür odak halkası.

### 1.6 Kabuk bileşenleri

- **Üst bar:** Paynkolay logosu + "DOCS" rozeti · arama kutusu (görsel placeholder, `Ctrl+K`) · "Panel Giriş" (ikincil) + "Başvurun" (primary) butonları. Kurumsal site menüsü YOK.
- **İçerik alanı:** Breadcrumb + H1 + kısa metin + 6 hub kartı.
- **Sayfa altı gezinme (yeni):** GitBook tarzı **Önceki / Sonraki kartları** — solda "Önceki" (nötr çerçeve), sağda "Sonraki" (primary mavi çerçeve + mavi başlık), chevron ikonlu; altında "Son güncelleme …" satırı. Faz 1'de demo veriyle (Sonraki → Ön Hazırlık); gerçek zincir Faz 3+'ta sayfalar çoğalınca bağlanır.
- **Tema anahtarı (görsel):** Sağ altta 3'lü ikon grubu — güneş (açık) / ekran (sistem) / ay (koyu); aktif olan açık mavi yuvarlak-kare zeminle vurgulu. Faz 1'de sadece görünüm; işlevi Faz 2.
- **Sağ kolon:** "BU SAYFADA" statik iskeleti.
- **Footer:** Tek satır sade doküman footer'ı (© + iletişim).

### 1.7 İş listesi — Faz 1

- [x] **A1 — Token'lar:** `tokens.css` — `#0C34E7` ailesi + açık tonlar, griler, tipografi/boşluk/gölge/köşe; tema-hazır değişken mimarisi
- [x] **A2 — İskelet:** klasör yapısı + `base.css` + boş kabuk `index.html`
- [x] **A3 — Üst bar:** logo (gerçek SVG, paynkolay.com.tr'den), arama placeholder'ı, butonlar
- [x] **A4 — Sol panel (statik):** en üstte TR/EN kutusu + 7 ana başlık + taslak alt başlıklar + aktif durum stilleri
- [x] **A5 — Accordion JS:** aç/kapa + chevron + erişilebilirlik + mobil çekmece temeli
- [x] **A6 — İçerik:** karşılama + 6 hub kartı + sağ kolon iskeleti + Önceki/Sonraki kartları + "Son güncelleme" satırı + tema anahtarı görseli
- [x] **A7 — Responsive:** mobil çekmece + kırılımlar (arama kutusu kaskad hatası bulunup düzeltildi)
- [ ] **A8 — Gözden geçirme:** birlikte bakılır → revizeler bu dosyaya işlenir ⬅️ *sıradaki adım*

---

## FAZ 2 — Tema Anahtarı (çalışır) + Dil Kutusu Davranışı

### 2.1 Kapsam

1. **3 durumlu tema:** Açık / Sistem / Koyu.
   - "Sistem" işletim sistemi tercihine uyar (`prefers-color-scheme`); Açık/Koyu seçimi `<html data-theme="...">` ile zorlar.
   - Seçim `localStorage`'a kaydedilir; sayfa yenilenince korunur, ilk yüklemede "parlama" olmaz.
   - **Koyu palet tasarım kararı:** `#0C34E7` koyu zeminde kontrast olarak yetersiz kalır (koyu üstüne koyu) — koyu temada vurgu/link için mavinin **açık türevi** kullanılacak. Koyu paletin tam değerleri bu fazda birlikte seçilir; bileşenler token'dan beslendiği için tek dosyada biter.
2. **TR/EN kutusu davranışı:** Kutu açılır, TR seçili gelir; EN satırı Faz 3+'a kadar "yakında" (pasif) durumda mı, yoksa gizli mi — bu fazda birlikte karar verilir. Gerçek EN içerik altyapısı Faz 3+.

### 2.2 İş listesi — Faz 2

- [ ] **B1 — Koyu palet:** koyu tema token değerleri (zeminler, metinler, çizgiler, mavinin açık türevi) — birlikte seçilir
- [ ] **B2 — Tema JS:** 3'lü anahtar işlevi + `localStorage` + sistem takibi + parlamasız yükleme
- [ ] **B3 — Dil kutusu:** açılır davranış + TR seçili durumu + EN kararının uygulanması
- [ ] **B4 — Gözden geçirme:** iki temada tüm bileşenler kontrol edilir

---

## FAZ 3+ — Park Alanı (büyük ayrıntılar, sırası gelince birlikte planlanır)

Sıralaması ve kapsamı sonra konuşulacak; şimdilik sadece kayıt:

- Gerçek içerik göçü (44 sayfanın yeni mimariye taşınması) — Önceki/Sonraki zinciri otomatik bağlanır
- API referans sayfası düzeni (iki kolon: parametreler + yapışkan kod paneli)
- Sağ "Bu sayfada" scroll takibi (aktif başlık vurgusu)
- Arama (Ctrl+K) işlevi
- EN içerik / i18n altyapısı
- Hash Test Formu'nun yeni tasarıma taşınması, Postman/test araçları vitrini
- Yaratıcı katman (ANALIZ.md §4): kişiye göre giriş, entegrasyon yolculuğu şeridi, yöntem sihirbazı, akış diyagramları

---

## Versiyon Kayıtları

- **v1 — Lacivert Ray:** Koyu lacivert gradyan sol menü, gradyan hero + kesme işareti motifi, Entegrasyon Yolculuğu şeridi, ikon karolu kartlar, TR/EN dil menüsü, üst barda tema anahtarı. *(2026-09-10, Şevval: "burası bir docs" — kurumsal üst menü demo'su 64 sayfadan kaldırıldı, tema anahtarı sağ alttan üst bara taşındı.)* *(Eksik: kod gösterimi — karar için her versiyonda farklı denenecek.)*
- **v2 — Aurora (API-first):** Şevval'in verdiği 3 Sipay/Apidog referansına göre. Pastel aurora zemin (lavanta/gök/pembe ışık yıkamaları — iç renk serbestliği Şevval onaylı, logo/vurgu mavi sabit), cam efektli tam boy sol panel (marka + TR/EN + tema + arama panel içinde), POST rozetli menü öğeleri, yeşil ipucu + gri bilgi callout'ları, erişim adresleri kartı, test bilgisi tablosu, panel yolunu gösteren mini mock kart, uç nokta çubuğu, iki kolonlu parametre listesi (çip + zorunlu/isteğe bağlı) ve **kod özelliği:** koyu Request paneli (Shell/JavaScript/PHP sekmeleri çalışır, kopyalama butonlu) + Response paneli (200 · Başarılı). Alt araçlar: Postman · Hash Aracı · Test Kartları.
  *(2026-09-07: v1'in tüm yapısı v2 temasına taşındı — 64 sayfa, sol menü ağacı, zengin üst menüler, swimlane diyagramlar, Hash Aracı, arama (Ctrl/Cmd+K), kod blokları v2 codebox'a çevrildi, sol menüye POST rozetleri eklendi. Koyu tema v2'de bilinçli olarak kapalı: Aurora açık tema kimliği korunuyor, tema düğmesi "yakında". Kod blokları v1'de sayfa bazında codeblock/codetabs'tı; v2'de tek bileşen: codebox.)*

- **v3 — Mint & Mürekkep (Plaid tarzı):** Şevval'in 5 Plaid/Sipay referansına göre. Sıcak kağıt zemin, **ikonlu** sade sol menü (alt öğeler düz metin), üst şeritte arama + paynkolay.com.tr › + TR/EN + kontur "Panel Giriş" + siyah "API Anahtarlarını Al", çizgi-sanat SVG hero illüstrasyonu, nane gradyan ikon karolu bölüm kartları (**kısa açıklamalar** — Şevval'in isteği), `/Vpos` mono uç başlığı, koyu başlıklı ✅'li parametre tablosu (ref #15), "Yanıt Alanları" listesi (kısa açıklama + iç içe alanlar sol çizgiyle) + yapışkan mürekkep lacivert **Response Object** paneli (güneş + kopyalama ikonlu, ref #13). Sağ TOC bilinçli olarak yok.
  *(2026-09-07: v1'in tüm yapısı v3 temasına taşındı — 64 sayfa, ikonlu sol menü ağacı, zengin üst menüler (nane karolu), swimlane diyagramlar (nane şeritli), Hash Aracı, arama. Kod blokları mürekkep lacivert `codebox`'a genelleştirildi (Response Object panelinin devamı), `dtable` → koyu başlıklı `ptable`, hub kartları → nane `pcard`, butonlar siyah/kontur ikiliye çevrildi. Demo'ya özel respbox/fields/section-title CSS'i kaldırıldı. Sağ TOC kararına sadık kalındı; koyu tema kapalı (tema düğmeleri "yakında").)*

- **v4 — Kobalt** *(ilk sürüm "Amber" turuncuydu; Şevval "çok Masterpass olmuş" dedi → kurumsal maviye çevrildi ve kişiselleştirildi: kart yayları yerine kesme işareti filigranı, alt gradyan şerit yerine sol kenar dikey gradyan, kesikli sekmeler yerine hap/segmented sekmeler, kömür yerine lacivert kod blokları)*. Yerleşim ilhamı Masterpass: Şevval'in 8 Masterpass Türkiye referansına göre; "bambaşka" istendi. **Yan menü yok** — üst sekmeli portal (Anasayfa / Entegrasyon / Servis Listesi / Hata Kodları / Ürün Bilgileri / SSS, aktif turuncu + alt çizgi). Sıcak gri zemin + sol üst turuncu ışık; logo mavi sabit, vurgular turuncu (iç renk serbestliği). Bileşenler: platform filtre sekmeleri (Web/iOS/Android/Backend) + arama; gradyan alt şeritli (kırmızı→turuncu→sarı) dekoratif yaylı servis kartları; büyük harfli sekmeler + gradyan illüstrasyonlu "Sana Özel Entegrasyon Yol Haritası" (2 kolon numaralı adımlar); akordeon "Entegrasyon Senaryoları"; "bilmeniz gerekenler" (gradyan kod illüstrasyonu + HTML/Js/PHP çipleri + kalkan ikonlu liste); İndir + zigzag gradyan CTA kartları; servis detayı (← geri, Genel/Detay sekmeleri, TEST/PROD rozetli URL satırları, **kesikli çerçeveli çalışan sekmeler** Kullanım/Örnek İstek/Başarılı Yanıt, **kalın çerçeveli kömür kod blokları** yeşil anahtarlarla, mavi tip linkli ferah parametre tablosu). Dil TR/EN + tema ikonları üst barda.

- **v5 — Mavikopya (teknik çizim):** Şevval'in "mavi + beyaz, 3 yaratıcı yön" isteğiyle, ui-ux-pro-max skill'inin Minimalism & Swiss önerisi üzerine. Milimetrik kağıt zemin, kesikli çerçeve + köşe kırpma işaretli hero, mono föy kodları (01/02…), ok uçlu 5 duraklı entegrasyon hattı (iyzico adım şeridi esinli), TEST/CANLI spec satırları, ince cetvelli parametre tablosu, **açık zeminli kod föyü** (diğer versiyonlardan ayrışan tek açık kod), teknik çizim SVG'leri (swimlane + test kartı), M-01…M-08 modül karoları, sol föy indeksi (scroll-spy). Skip link + reduced-motion + focus-visible baştan uygulandı.
- **v6 — Konsol (bölünmüş ekran):** Stripe docs esinli. Solda bembeyaz düzyazı (numaralı hızlı başlangıç, uç hapları, Stripe-vari parametre satırları, yöntem listesi, SSS), sağda **hep görünür yapışkan gece lacivert terminal rayı**: üç noktalı pencere çubuğu, cURL/PHP/Node sekmeleri (çalışır), 200 yanıt paneli, zaman damgalı işlem günlüğü. Güven satırı (≈8 sn akış · PCI DSS · 26 uç · 7/24). Aynı erişilebilirlik temeli.
- **v7 — Bento (karo ızgarası):** ui-ux-pro-max `bento-box-grid` checklist'iyle (4→2→1 kolon, değişken span, 22px köşe, hover scale 1.02). Buz mavisi zeminde beyaz karolar: 2x2 karşılama (kesme işareti filigranı), hızlı başlangıç, tek dolgu-mavi vurgu karosu, mini test kartı görseli, kopyalanabilir uç satırları, Hash Aracı + Postman karoları, ortam durumu; altta yöntem karoları, numaralı yolculuk şeridi, SSS ve mavi destek bandı.

- **v8 — Gravür** *(2026-09-07, Şevval: "solda açılır menü istiyorum, hep orada olmasın; açan açsın, alt başlıklar görünsün" — v8'e **istenince açılan sol drawer** eklendi: üst barda "Menü" düğmesi, tıklayınca soldan kayan tam akordeon ağaç (v1'in 64 sayfalık nav'ı, ana + alt + iç içe başlıklar), karartma + Esc + çarpı ile kapanır, her ekran boyutunda çalışır (mobile-only değil). Kendi `sidebar.js`'i: accordion + drawer + **URL-tabanlı aktif tespit** (bulunulan sayfa `is-active`, ata grupları otomatik açık `is-open`, en dış grup `is-current`) — group-link sayfalarını ve iç içe grupları da doğru açar. Drawer tokenlarla temaya (açık/koyu) uyumlu. Bölüm-kartı içerik haritası korundu; ikisi bir arada.)* *(2026-09-07, Şevval: "dark light mod ekle" — v8'e 3 durumlu tema anahtarı (Açık/Sistem/Koyu) eklendi, `theme.js` + `localStorage` (v1'deki mekanizma). Koyu palet "mavi baskı" laciverti: zemin #04081F/#0B1747, metin beyaz/buz, vurgu periwinkle #8FA4FF, dolgu butonlar marka mavisi (`--brand-fill` ayrımıyla açık/koyu tutarlı). Üst bar zemini `--topbar-bg` token'ıyla temaya bağlandı; logo koyuda beyaza, giyoş dokusu + kart illüstrasyonu + 3B ürün sahnesi + uyarı callout'u koyuya uyarlandı. Anahtar 64 sayfaya enjekte edildi. Koyu kontrast ölçüldü (5.6–15.9:1; CANLI yeşili koyuda #4ADE9C'ye açıldı).)* *(2026-09-07, Şevval: "tema çok iyi ama her şey aynı sayfaya gidiyor; v2'deki yönlendirmeyi uygula, alt başlıklar görünsün ama soldan açılır olmasın; DESTEK satırını kaldır" — v8 tam içerikli dokümana dönüştü: v1'in 63 alt sayfası Gravür kabuğuna taşındı (64 sayfa). Kenar menü yok; navigasyon içerikte görünür: ana sayfada 8 **BÖLÜM kartı** (gravür köşeli section'lar, serifli başlık linki + kesikli ayraç altında tüm alt başlıklar), her alt sayfa sonunda **"BU BÖLÜMDE"** kartı (bulunulan sayfa altı çizili, `aria-current`). Üst bara arama eklendi (Ctrl/Cmd+K, 268 kayıt), kurumsal menü gerçek linklere bağlandı, yolculuk durakları tıklanabilir oldu, hero'daki DESTEK notu kaldırıldı, "Örnek İsteğe Bakın" → Form ile Ödeme dokümanına. İçerik katmanı Gravür diliyle: kod blokları koyu plaka, tablolar mono-brand başlıklı, kartlar gravür köşeli, mühür-stil rehber numaraları. Öğrenilen ders: kart içinde link listesi varsa kart `<a>` değil `<section>` olmalı — iç içe anchor HTML'i patlatıyor. QA: 0 kırık link/çapa, tanımsız sınıf yok.)* *(2026-09-07, Şevval: "açık renkli yap" — koyu lacivert zemin açık temaya çevrildi: beyaz kağıt + lacivert mürekkep metin; gravür çizgileri ve giyoş dokusu artık doğrudan marka mavisi #0C34E7 (açık zeminde tam kontrastlı), logo orijinal mavi haline döndü, kod plakaları koyu lacivert kalarak vurgu oldu. 10 kontrast çifti yeniden ölçüldü, 5.3–16:1.)* *(2026-09-07, Şevval: "biz darphane miyiz, ödeme sistemiyiz — kaldır onları": tüm darphane/banknot temalı metinler kaldırıldı — "itinayla basılmıştır" → "Entegrasyona hoş geldiniz", Basım Hattı → Entegrasyon Yolculuğu, mühür → adım, FÖY I–VIII → BÖLÜM 01–08, DARBHANE/tedavül ibareleri silindi; banknot illüstrasyonu aynı gravür çizgisinde **ödeme kartı** çizimiyle değiştirildi (çip + temassız dalgalar + test kartı numarası). Görsel dil aynen korundu; versiyon adı Banknot → Gravür.)* Önceki kayıt: Şevval'in "bambaşka tasarım" isteğiyle doğan tek sayfalık gravür/değerli-kağıt kavramı; ilk denemesi zümrüt+altındı, Şevval "vazgeçtim, ana rengim olsun" deyince aynı gün **marka paletine yeniden basıldı**. Zemin marka gradyan ailesinin koyu laciverti (#0A1450→#04081F), metin beyaz/buz, gravür çizgileri mavinin açık türevi periwinkle (#8FA4FF — koyu zeminde #0C34E7 kontrast için yetersiz), butonlar dolgu marka mavisi. Kalanlar aynı: giyoş halkaları, serifli display başlıklar (tek serif ve tek koyu-öncelikli versiyon), çift-çerçeveli "plate" panelleri + köşe uçları, dekoratif doküman banknotu SVG'si ("TEST BASKISI · TEDAVÜL DIŞI"), Roma rakamlı mühür durakları (I–V), "ledger" uç listesi, kod plakası, FÖY kartları. 11 kontrast çifti ölçüldü (5.6–14.4:1). İçerik göçü bilinçli olarak yapılmadı: yön beğenilirse 64 sayfa taşınır.

## Revizyon Günlüğü

| Tarih | Değişiklik |
|---|---|
| 2026-09-02 | İlk taslak oluşturuldu |
| 2026-09-02 | Şevval'in isteğiyle eklendi: 3 durumlu tema anahtarı (Faz 2'de çalışır, Faz 1'de görsel), panel üstü TR/EN kutusu (Faz 1 görsel), sayfa altı Önceki/Sonraki kartları + "Son güncelleme" satırı (Faz 1 demo). Plan fazlara bölündü, Faz 3+ park alanı açıldı. |
| 2026-09-02 | Faz 1 uygulandı (A1–A7): kabuk, accordion sol panel, hub sayfası, responsive. Tarayıcıda masaüstü + mobil doğrulandı. A8 (birlikte gözden geçirme) bekliyor. |
| 2026-09-02 | **Yeniden tasarım (Şevval: "fazla iyzico benzeri"):** Paynkolay imza kimliği eklendi — koyu lacivert gradyan sol ray, gradyan hero paneli + kesme işareti motifi, 5 duraklı "Entegrasyon Yolculuğu" şeridi, ikon karolu kartlar, gradyan dolgulu "Sonraki" kartı, üst bar altı gradyan imza çizgisi. TALIMATLAR §2 imza alanları istisnasıyla güncellendi. |
| 2026-09-02 | **v1'e Şevval'in isteğiyle eklendi:** (1) Dil kutusu artık gerçek açılır menü — Türkçe ✓ / English; seçim etiketi değiştiriyor (içerik çevirisi Faz 3+'ta). Faz 2 B3'ün açılır davranış kısmı öne çekilmiş oldu. (2) Üst bara kurumsal gezinme demo'su: Ürünlerimiz / Hakkımızda / İletişim / Entegrasyon (aktif: mavi + alt çizgi), hepsi örnek maddeli açılır menülü. Ortak `dropdown` bileşeni + `dropdown.js` eklendi; ≤1279px'te üst menü gizlenir. |
| 2026-09-07 | **v2 tam içerik göçü (Şevval: "v1'i analiz et, temayı bozmadan v2'ye uygula"):** v1'in 64 sayfası, sol menü ağacı, zengin üst menüler, TOC'ler, diyagramlar ve tüm araçlar v2 Aurora kabuğuna taşındı. v2 CSS'ine içerik bileşenleri katmanı eklendi (hero, journey, guide, cards, dtable, faq, tool, searchbox, prodhero…); kod blokları v2 `codebox`'a dönüştürüldü; sol menü servis sayfalarına POST rozetleri eklendi; arama indeksi script'i versiyon parametreli yapıldı (`tools/build-search-index.py v2`). Otomatik QA: 0 kırık link, 0 kırık çapa, tanımsız sınıf yok. |
| 2026-09-07 | **v6 kenar menüsüz navigasyon (Şevval: "v6'yı da kendi formatında yap"):** akordeon kenar menü v6'dan kaldırıldı; navigasyon konsol diline taşındı — ana sayfada **"Doküman Ağacı"**: `tree — paynkolay-docs/` başlıklı koyu terminal penceresinde tüm ana başlıklar dizin (`on-hazirlik/ — Ön Hazırlık`), alt başlıklar `├──`/`└──` satırları olarak (2 kolon); her alt sayfanın sonunda **"bu-bölümde — <dizin>/"** mini ağacı, bulunulan sayfa beyaz + yeşil `◂ buradasınız` işaretli (`aria-current`). TR/EN üst bara taşındı; üst menü, arama, sağ TOC, konsol rayı ve pager korundu. Kenar menü CSS/JS temizlendi. QA: 0 kırık link/çapa, tanımsız sınıf yok. |
| 2026-09-07 | **v7 kenar menüsüz navigasyon (Şevval: "açılır pencere yapmadan ana/alt başlıklar içerik olarak, v7'nin kendi tarzında"):** v7'den akordeon kenar menü tamamen kaldırıldı; navigasyon v7'nin karo diline taşındı — ana sayfada 7 bölümlük **Doküman Haritası** bento'su (ana başlık karoları + görünür alt başlık hapları), her alt sayfanın sonunda **"Bu Bölümde"** karosu (kardeş sayfa hapları, bulunulan sayfa dolgu-mavi `aria-current` ile işaretli). TR/EN kutusu üst bara taşındı; üst kurumsal menü, arama, sağ TOC ve pager korundu. Kenar menü CSS/JS'i v7'den temizlendi. QA: 0 kırık link/çapa, tanımsız sınıf yok. |
| 2026-09-07 | **v5 · v6 · v7 tam içerik göçü (Şevval: "içeriklerin hepsi v1'den; ana+alt başlıklı menü ve üst menü şart"):** v1'in 63 alt sayfası üç versiyona da taşındı (her biri 64 sayfa oldu). Kabuk v1 paritesinde: akordeon kenar menü (iç içe API ağacı, aktif durumlar), zengin üst kurumsal menü, Ctrl/Cmd+K arama, TR/EN kutusu, GitBook rozeti, sağ "Bu Sayfada" (scroll-spy), skip link, mobil çekmece. Ana sayfalar her versiyonun kimliğini korudu (Mavikopya föyü / Konsol rayı / Bento ızgarası) ve modül-karo linkleri gerçek sayfalara bağlandı. Kod blokları versiyon diliyle: v5 açık föy, v6 pencere noktalı terminal, v7 lacivert karo. Tek şablondan üretilen içerik katmanı + `copybtn→copychip`. QA (3 versiyon): 192 sayfa, 0 kırık link/çapa, tanımsız sınıf yok. |
| 2026-09-07 | **v5 · v6 · v7 yeni tasarım yönleri (Şevval: "mavi #0C34E7 + beyaz, 3 yaratıcı tasarım"):** ui-ux-pro-max skill'iyle (design-system + bento-box-grid + Swiss/minimal aramaları doğrulanarak) üç tek sayfalık prototip eklendi: **v5 Mavikopya** (teknik çizim föyü), **v6 Konsol** (bölünmüş ekran + yapışkan terminal rayı), **v7 Bento** (karo ızgarası). Üçü de denetim derslerini baştan uyguluyor: skip link, tüm metin kontrastları ≥4.5:1 (ölçüldü), focus-visible, reduced-motion, touch-action. Galeri kartları ve sw-buz/sw-gece renk örnekleri eklendi. QA: 0 kırık link/çapa, tanımsız sınıf yok. |
| 2026-09-07 | **v3 tam içerik göçü (Şevval: "aynısını v3 uygula"):** aynı 64 sayfa Mint & Mürekkep kabuğuna taşındı. v3'e özgü uyarlamalar: sol menü üst başlıklarına ikonlar, hub kartları nane `pcard`'lara, tablolar koyu başlıklı `ptable`'a, kod blokları mürekkep `codebox`'a dönüştü; butonlar siyah/kontur; diyagram şeritleri ve callout'lar nane; sağ TOC yok (v3 kararı). Demo'ya özel respbox/fields CSS'i temizlendi. Otomatik QA: 0 kırık link, 0 kırık çapa, tanımsız sınıf yok. |
| 2026-09-10 | **v1 içerik düzeltmeleri + docs ayrışması (Şevval):** Test üye işyeri no 273 → 400000273 (test-ortami + ortamlar); ana sayfa hero başlığı "Entegrasyon Dokümantasyonu" oldu; Başvuru ve İlk Adımlar'ın 4 adımına eylem linkleri (başvuru formu, durum sorgulama, panel rehberi, canlıya geçiş listesi) + üç anahtar kartı "Entegrasyon Bilgileriniz" bölümüne ayrıntılandı (3 sx ayrımı, "panelde göremiyorum" uyarısı). Ardından "burası bir docs" kararıyla kurumsal üst menü (Ürünlerimiz/Hakkımızda/İletişim/Entegrasyon) 64 sayfadan kaldırıldı; tema anahtarı sağ alttan üst bara taşındı (≤767px'te sağ altta yüzmeye devam eder — üst barda yer dar). Ölü CSS temizlendi (mainnav, richitem, rich/products menü stilleri); arama indeksi yenilendi. |
| 2026-09-10 | **v1 üstten-başlama + e-posta + lead düzeltmeleri (Şevval):** (1) Sayfalar arası her geçiş artık hedef sayfanın en üstünden başlıyor — `scrolltop.js` (head'de; `scrollRestoration=manual` + `pageshow`'da en üste, çapalı adresler korunur) 64 sayfaya eklendi ve sayfalar arası linklerdeki 271 `#çapa` kaldırıldı (kenar menüdeki 4 iç içe API linki + içerik derin linkleri; sayfa içi TOC çapaları ve arama sonuçlarının bölüm hedefleri korunuyor). (2) Tüm versiyonlarda destek e-postaları doğrudan `mailto:` — v8'deki Gmail compose butonu, v5 föy künyesi ve v6 istatistik şeridi düzeltildi. (3) Hangi Yöntem lead'i profesyonelleştirildi ("İş modelinize ve teknik altyapınıza uygun…"). |
| 2026-09-10 | **v1 API alt sayfaları + swimlane seti (Şevval: "menüdeki Ödeme Oluşturma/Sorgulama ve 3DS Başlatma/Tamamlama gerçek sayfa olsun; canlı 03 + 19'dan al"):** 4 yeni sayfa üretildi (68 sayfa): **Ödeme Oluşturma** (uç+hash+21 parametre+örnek istek/yanıt, localhost/TLS uyarısı), **Ödeme Sorgulama** (PaymentList — ne zaman gerekir, sx List uyarısı, STATUS tablosu), **3DS Başlatma** (BANK_REQUEST_MESSAGE'ı kaçış karakterlerinden temizleyip ekrana basma — PHP/Node örnekli, canlı 03'ten), **3DS Tamamlama** (dönüş alanları tablosu + Altın Kural + CompletePayment buraya taşındı). Ana sayfalar genel bakış+akışa sadeleşti; api.html'e canlı 19'dan **v1/v0 sürüm karşılaştırması** (PaymentInstallments→EncodedValue akışı, iscardvalid) eklendi. Python swimlane üreticiyle 4 yeni akış diyagramı: Non-3DS, Linkli Ödeme, Ön Provizyon (bloke→onay/iptal yaşam döngüsü — gerekli görüldü), Düzenli Ödeme. Kenar menü 68 sayfada yeni alt sayfalara bağlandı; pager zinciri yeniden örüldü. QA'da 5 yanlış hedefli link bulunup düzeltildi: Düzenli Ödeme→"Taksit Servisi" ürünlere gidiyordu (Şevval'in bulduğu), Ödeme Sonucu→"İşlem Doğrulama" Pazaryeri'ne, Ürünler hub'ı→"Sigorta" Düzenli Ödeme'ye, 3 ek-servisler sayfasında Pazaryeri/Open Source üst başlıkları kaymıştı. Arama indeksi 287 kayda çıktı. |
| 2026-09-10 | **v1 canlı parite maratonu + yeni sayfalar (Şevval'in sayfa sayfa kıyas isteğiyle):** (1) Karşılaştırılıp tamamlanan sayfalar: Form ile Ödeme (5 dilli çalışır örnekler — canlıdaki Node hash hatası ve C# saat biçimi düzeltilerek), Ödeme Sonucu (5 dilli kontrol fonksiyonu + Response Hash bölümü + tam dönüş örnekleri), İptal/İade (Deneme Konsolu: hash+cURL+test ortamına İstek Gönder, canceltool.js), pazaryeri Kimlik/Hash/Profil/Satıcı/Ödeme/İptal/Masterpass/Raporlama (yanıt JSON'ları, doğrulama algoritmaları, swimlane, Dashboard+Excel, uçtan uca Manager sınıfları). (2) **Yeni sayfalar:** ek-bilgiler/iframe-kullanimi.html (canlı 08 — ANALIZ-CANLI-SITE'nin 1 no'lu boşluğu kapandı: SameSite 4 dil, X-Frame-Options/CSP, kontrol listesi, teknik arka plan; canlıdaki yanlış "sayfa 3" referansı düzeltildi) ve kök masterpass.html (canlı 18 — kenar menüde ayrı üst başlık, CVV'siz yetki koşulu + gerekli bilgiler + destek adresleri). (3) Ek Bilgiler menüsüne İşlem Doğrulama ve Raporlama Servisi çapraz linkleri eklendi (Test Kartları emsali). (4) Hash Aracı formül tablosu canlı 04+05 ile birleşti: 15 formül (düzenli ödeme ×2, kayıtlı kart ×3, saklı karttan ödeme, sigorta TCKN, Response Hash). (5) Başvuru Süreci 3 adıma indi; **şirket türü seçimli işaretlenebilir belge kontrol listesi** eklendi (belgeler.js, localStorage, 8 tür × 23 evrak matrisi açılır tabloda). (6) 👎 geri bildirim "bize ulaşın" linki tüm sayfalarda iletişim formuna (paynkolay.com.tr/iletisim#bize-yazin) bağlandı. (7) Pazaryeri Postman koleksiyonu (26 istek) menüye indirilebilir eklendi. Sayfa sayısı 70, arama indeksi 309 kayıt. |
