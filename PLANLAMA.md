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

- **v1 — Lacivert Ray:** Koyu lacivert gradyan sol menü, gradyan hero + kesme işareti motifi, Entegrasyon Yolculuğu şeridi, ikon karolu kartlar, kurumsal üst menü demo'su, TR/EN dil menüsü. *(Eksik: kod gösterimi — karar için her versiyonda farklı denenecek.)*
- **v2 — Aurora (API-first):** Şevval'in verdiği 3 Sipay/Apidog referansına göre. Pastel aurora zemin (lavanta/gök/pembe ışık yıkamaları — iç renk serbestliği Şevval onaylı, logo/vurgu mavi sabit), cam efektli tam boy sol panel (marka + TR/EN + tema + arama panel içinde), POST rozetli menü öğeleri, yeşil ipucu + gri bilgi callout'ları, erişim adresleri kartı, test bilgisi tablosu, panel yolunu gösteren mini mock kart, uç nokta çubuğu, iki kolonlu parametre listesi (çip + zorunlu/isteğe bağlı) ve **kod özelliği:** koyu Request paneli (Shell/JavaScript/PHP sekmeleri çalışır, kopyalama butonlu) + Response paneli (200 · Başarılı). Alt araçlar: LLMs.txt · Postman · Dışa Aktar.

- **v3 — Mint & Mürekkep (Plaid tarzı):** Şevval'in 5 Plaid/Sipay referansına göre. Sıcak kağıt zemin, **ikonlu** sade sol menü (alt öğeler düz metin), üst şeritte arama + paynkolay.com.tr › + TR/EN + kontur "Panel Giriş" + siyah "API Anahtarlarını Al", çizgi-sanat SVG hero illüstrasyonu, nane gradyan ikon karolu bölüm kartları (**kısa açıklamalar** — Şevval'in isteği), `/Vpos` mono uç başlığı, koyu başlıklı ✅'li parametre tablosu (ref #15), "Yanıt Alanları" listesi (kısa açıklama + iç içe alanlar sol çizgiyle) + yapışkan mürekkep lacivert **Response Object** paneli (güneş + kopyalama ikonlu, ref #13). Sağ TOC bilinçli olarak yok.

- **v4 — Kobalt** *(ilk sürüm "Amber" turuncuydu; Şevval "çok Masterpass olmuş" dedi → kurumsal maviye çevrildi ve kişiselleştirildi: kart yayları yerine kesme işareti filigranı, alt gradyan şerit yerine sol kenar dikey gradyan, kesikli sekmeler yerine hap/segmented sekmeler, kömür yerine lacivert kod blokları)*. Yerleşim ilhamı Masterpass: Şevval'in 8 Masterpass Türkiye referansına göre; "bambaşka" istendi. **Yan menü yok** — üst sekmeli portal (Anasayfa / Entegrasyon / Servis Listesi / Hata Kodları / Ürün Bilgileri / SSS, aktif turuncu + alt çizgi). Sıcak gri zemin + sol üst turuncu ışık; logo mavi sabit, vurgular turuncu (iç renk serbestliği). Bileşenler: platform filtre sekmeleri (Web/iOS/Android/Backend) + arama; gradyan alt şeritli (kırmızı→turuncu→sarı) dekoratif yaylı servis kartları; büyük harfli sekmeler + gradyan illüstrasyonlu "Sana Özel Entegrasyon Yol Haritası" (2 kolon numaralı adımlar); akordeon "Entegrasyon Senaryoları"; "bilmeniz gerekenler" (gradyan kod illüstrasyonu + HTML/Js/PHP çipleri + kalkan ikonlu liste); İndir + zigzag gradyan CTA kartları; servis detayı (← geri, Genel/Detay sekmeleri, TEST/PROD rozetli URL satırları, **kesikli çerçeveli çalışan sekmeler** Kullanım/Örnek İstek/Başarılı Yanıt, **kalın çerçeveli kömür kod blokları** yeşil anahtarlarla, mavi tip linkli ferah parametre tablosu). Dil TR/EN + tema ikonları üst barda.

## Revizyon Günlüğü

| Tarih | Değişiklik |
|---|---|
| 2026-09-02 | İlk taslak oluşturuldu |
| 2026-09-02 | Şevval'in isteğiyle eklendi: 3 durumlu tema anahtarı (Faz 2'de çalışır, Faz 1'de görsel), panel üstü TR/EN kutusu (Faz 1 görsel), sayfa altı Önceki/Sonraki kartları + "Son güncelleme" satırı (Faz 1 demo). Plan fazlara bölündü, Faz 3+ park alanı açıldı. |
| 2026-09-02 | Faz 1 uygulandı (A1–A7): kabuk, accordion sol panel, hub sayfası, responsive. Tarayıcıda masaüstü + mobil doğrulandı. A8 (birlikte gözden geçirme) bekliyor. |
| 2026-09-02 | **Yeniden tasarım (Şevval: "fazla iyzico benzeri"):** Paynkolay imza kimliği eklendi — koyu lacivert gradyan sol ray, gradyan hero paneli + kesme işareti motifi, 5 duraklı "Entegrasyon Yolculuğu" şeridi, ikon karolu kartlar, gradyan dolgulu "Sonraki" kartı, üst bar altı gradyan imza çizgisi. TALIMATLAR §2 imza alanları istisnasıyla güncellendi. |
| 2026-09-02 | **v1'e Şevval'in isteğiyle eklendi:** (1) Dil kutusu artık gerçek açılır menü — Türkçe ✓ / English; seçim etiketi değiştiriyor (içerik çevirisi Faz 3+'ta). Faz 2 B3'ün açılır davranış kısmı öne çekilmiş oldu. (2) Üst bara kurumsal gezinme demo'su: Ürünlerimiz / Hakkımızda / İletişim / Entegrasyon (aktif: mavi + alt çizgi), hepsi örnek maddeli açılır menülü. Ortak `dropdown` bileşeni + `dropdown.js` eklendi; ≤1279px'te üst menü gizlenir. |
