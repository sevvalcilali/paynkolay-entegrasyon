# Paynkolay Entegrasyon Sayfası — Analiz

*Tarih: 2026-09-01 · Durum: Analiz tamamlandı, planlama birlikte yapılacak.*

**Amaç:** `paynkolay.com.tr/entegrasyon/` sayfasını, iyzico'nun doküman portalını (docs.iyzico.com) referans alarak daha sade, profesyonel ve yaratıcı bir entegrasyon portalına dönüştürmek. Hedef kitle üç katmanlı:

1. **Geliştirici** — API'yi hızla bulup entegre etmek istiyor.
2. **Teknik olmayan kişi** (işletme sahibi, yönetici) — hangi ürün ne işe yarıyor, süreç nasıl ilerliyor anlamak istiyor.
3. **Sunum senaryosu** — sayfa, örneğin bir banka toplantısında sunum dosyası gibi baştan sona anlatılabilmeli.

---

## 1. Referans: iyzico docs nasıl çalışıyor?

### 1.1 Genel yapı

- Dokümantasyon **ayrı bir kimlik**: `docs.iyzico.com` alt alan adında, kurumsal sitenin menüsü/footer'ı yok. Kendi sade üst çubuğu var: logo + DOCS rozeti · arama (⌘K) · GitHub · Feedback · "API Reference" butonu.
- **3 kolonlu düzen:** solda daraltılabilir navigasyon (en fazla 3 seviye) · ortada içerik · sağda "ON THIS PAGE" (sayfa içi başlıklar, scroll ile aktif başlık vurgulanıyor).
- Sol menünün en üstünde **dil seçici (TR/EN)**, sağ altta **açık/koyu tema** anahtarı.
- Her sayfada breadcrumb, "Copy" (sayfayı markdown kopyalama) ve "Last updated" bilgisi.
- Altyapı: GitBook (hazır ürün — biz kendimiz tasarlayacağız ama bileşen dilini örnek alabiliriz).

### 1.2 Sayfa tipleri (bu ayrım önemli)

| Sayfa tipi | Örnek | İçerik |
|---|---|---|
| **Karşılama (hub)** | Başlangıç | Kısa tanıtım metni + 6 bölüm kartı (Ön Hazırlıklar, Ürünler, Ödeme Metotları…) |
| **Bölüm hub'ı** | Ek Bilgiler (bizim referans) | Sadece kartlar: Hata Kodları · Test Kartları · Logo Paketi. Sayfa bomboş ve ferah — kaybolmak imkânsız |
| **Ürün tanıtımı** | Ödeme Formu (CheckoutForm) | Video · ikonlu "Avantajlar" satırı · çizim/illüstrasyonlu akış kartları · "ON THIS PAGE" |
| **Entegrasyon akışı** | CF Entegrasyonu | **Ok şeklinde adım şeridi** (Kullanım Tercihi → CF Başlatma → Yönlendirme → CF Sorgulama → Webhook), her adım tıklanabilir link |
| **API referansı** | CF Başlatma | **İki kolon:** solda parametreler (isim + tip + `required/optional` etiketi + açıklama + Example chip + Possible values), sağda **yapışkan kod paneli** (POST rozeti + endpoint, dil seçici, istek örneği, açılır-kapanır 200/hata yanıtları). En altta dil kartları (PHP, Java, .NET, Node.js, Python, Postman) → GitHub örnekleri |

### 1.3 iyzico'yu iyi yapan 7 prensip (bizim çıkarımlarımız)

1. **Ayrışma:** Doküman portalı pazarlama sitesinden koparılmış; ekranda sadece dokümana hizmet eden öğeler var.
2. **Hub-and-spoke mimari:** Her seviyenin kart tabanlı bir giriş sayfası var; kullanıcı her an "neredeyim, nereye gidebilirim" görüyor.
3. **Kademeli derinlik:** Tanıtım → akış → adımlar → API detayı. Teknik olmayan kişi ilk iki katmanda kalabiliyor, geliştirici son katmana dalıyor.
4. **Kod ile açıklama yan yana:** İki kolonlu API sayfasında parametreyi okurken örneği aynı hizada görüyorsun.
5. **Görsel akışlar:** Süreçler madde listesi yerine ok şeritleri ve marka renginde illüstrasyonlarla anlatılıyor.
6. **Tutarlı bileşen dili:** Kart, chip (etiket), callout (uyarı kutusu), kod sekmesi her yerde aynı.
7. **Ürün hissi:** Arama, tema, dil, feedback — doküman "statik sayfa" değil "ürün" gibi davranıyor.

---

## 2. Mevcut durum: paynkolay.com.tr/entegrasyon/

### 2.1 Güçlü yanlar (iskelet zaten var, sıfırdan başlamıyoruz)

- Sol menü 8 kategori + alt başlıklar, breadcrumb, sağda "BU SAYFADA" menüsü — üç kolon düşüncesi mevcut.
- `Ctrl+K` ile doküman araması var.
- Kod blokları **dil sekmeli** (PHP, .NET C#, Python, Node.js) ve kopyalama butonlu.
- **Hash Test Formu** (04 sayfası): Kullanıcı kendi değerleriyle hash'i canlı test edebiliyor. Bu iyzico'da bile yok — **korunması ve parlatılması gereken en değerli özellik.**
- Postman koleksiyonu indirme butonu sol menüde.
- Test token'ları tek tıkla kopyalanabiliyor.
- "Bu bilgileri panelde göremiyor musunuz?" gibi gerçek sorunlara cevap veren callout'lar var.
- İçerik **kapsamlı**: 44 alt sayfa — ödeme, link, iade, kart saklama, tekrarlayan ödeme, pazaryeri, 7 hazır e-ticaret eklentisi, hata/banka kodları, SSS, sigorta ödemesi.

### 2.2 Zayıf yanlar (dönüşümün ana gerekçeleri)

1. **Kimlik karmaşası:** Doküman, kurumsal sitenin içinde yaşıyor. Her sayfada pazarlama menüsü (Ürünlerimiz, Hakkımızda, İletişim…) + dev kurumsal footer (App Store, yasal linkler, banka logoları). Doküman portalı hissi yok; broşür sayfası hissi var.
2. **Karşılama sayfası duvar gibi:** Stok fotoğraflı hero → "Paynkolay Nedir" → yöntem kartları → **sayfanın ortasına dökülmüş ham test token'ları** (yatay kaydırmalı dev siyah bloklar) → panel ekran görüntüleri → "Önemli Konular" → "Teknik Detaylar" → destek. Ne geliştirici ne de teknik olmayan biri için kurgulanmış bir yol var; herkes aynı duvarı kazıyor.
3. **Görsel akış yok:** Ödeme akışları uzun madde listeleriyle anlatılıyor (ör. 01 sayfası). Diyagram, adım şeridi, illüstrasyon yok — teknik olmayan biri için en büyük engel bu.
4. **API referansı dev tablolar:** 5 kolonlu, koyu başlıklı, geniş tablolar (İsim/Tipi/Açıklama/Zorunlu/Örnek). Tarama zor, kod örneğiyle eşleşmiyor; iyzico'nun iki kolonlu düzeninin tam tersi.
5. **Bilgi mimarisi pürüzleri:** URL'ler `04-hash-request.php` gibi dosya numarası sızdırıyor; numaralamada çift `14` var, `40-42` boş; sol menü kategorileriyle numara sırası örtüşmüyor. "API Dokümantasyonu Versiyonları" (v0/v2) yerleşimi kafa karıştırıyor.
6. **Ürün hissi eksikleri:** Koyu tema yok, doküman için EN yok, "son güncelleme" bilgisi yok, feedback kanalı yok.
7. **Görsel dil dağınık:** Buton stilleri karışık, kod blokları sert siyah ve yatay kaydırmalı, boşluk ritmi tutarsız, hero'da marka yerine stok fotoğraf.
8. **Kategori hub'ları yok:** Bir kategoriye tıklayınca kart tabanlı giriş sayfası yerine doğrudan içerik açılıyor; iki içerik arasında gezinmenin tek yolu sol menü.

### 2.3 İçerik envanteri (44 sayfa, gruplu)

| Grup | Sayfalar |
|---|---|
| Temel ödeme | 01 servisler · 02 örnek form · 03 API doküman (+ 19 v0) · 04 hash istek · 05 hash yanıt · 06 ödeme sonucu · 07 test kartları · 08 iframe · 09 iptal/iade |
| Güvenlik & doğrulama | 10 işlem doğrulama · 17 TLS hataları · 43 hata kodları · 44 banka kodları |
| Linkli ödeme | 12 link oluştur · 13 link gönder · 14 link sil |
| Kart yönetimi | 14 kart sakla (çift numara!) · 15 kayıtlı karttan ödeme · 16 tekrarlayan ödeme · 30 kart program bilgisi |
| Gelişmiş | 11 ön provizyon · 27 ödeme tamamlama · 28 raporlama · 29 taksit servisi · 46 sigorta ödemesi |
| Masterpass | 18 |
| Pazaryeri | 31–39 (genel bakış, kimlik, hash, ödeme profili, satıcı, ödeme, düzenlemeler, masterpass, raporlama) |
| Hazır eklentiler | 20 Magento 1.9 · 21 Magento 2.x · 22 OpenCart · 23 PrestaShop · 24 WooCommerce · 25 GiveWP · 26 WHMCS |
| Yardım | 45 SSS |

**Not:** İçerik değerli ve büyük oranda hazır. Bu bir *içerik yazma* projesi değil; **bilgi mimarisi + tasarım + anlatım** projesi.

---

## 3. Elimizdeki tasarım varlıkları

Kurumsal renk token'ları (Figma'dan, `paynkolay-odeme` projesinde de kullanıldı):

```
primary      #2566E2   (ana mavi — butonlar, linkler, vurgular)
primary-soft #C8D9F8   (pasif/açık mavi)
card-blue    #477DEA   (kart zemin mavisi)
panel        #E8EEFC   (panel zemini)
page         #F3F5FA   (sayfa zemini)
heading      #303E48   (başlık rengi)
muted        #888888   (ikincil metin)
line         #DDDDDD   (çizgiler)
danger       ≈#C61835  (hata/uyarı)
```

Ayrıca elimizde: Postman koleksiyonu (26 istek, doğrulanmış hash formülleri), örnek UAT formu, Figma dosyası (ödeme sayfası tasarımı — görüntüleme yetkisi).

---

## 4. Yeni sayfa için fikirler — ÖNERİ, henüz karar verilmedi

> Bunlar analizden çıkan ham fikirler. Hangilerinin plana gireceğine **birlikte** karar vereceğiz.

**iyzico'dan alacaklarımız (temel):**
- Sade doküman kabuğu (kurumsal menü/footer'dan arındırılmış), 3 kolonlu düzen.
- Kart tabanlı hub sayfaları + kademeli derinlik (tanıtım → akış → API).
- İki kolonlu API referansı (solda parametre listesi, sağda yapışkan kod paneli).
- Ok şeklinde adım şeritleri, callout kutuları, chip'ler, tutarlı kart dili.

**Bize özgü, yaratıcı katman (iyzico'da olmayan):**
1. **Kişiye göre giriş:** Hero'da iki yol — "Geliştiriciyim" (→ hızlı başlangıç, API) / "Teknik değilim" (→ ürünler, süreç, SSS).
2. **Entegrasyon Yolculuğu şeridi:** Başvuru → Test bilgileri → Yöntem seçimi → Test → Canlıya geçiş. Karşılama sayfasının omurgası; her durak ilgili bölüme götürür. Sunumda "uçtan uca sistem" anlatısının kendisi.
3. **Yöntem seçme sihirbazı:** 2-3 soruyla (siteniz var mı, kod yazacak biri var mı, kart bilgisini kim alacak?) doğru ürünü öneren mini araç: Ortak Ödeme form / link / API / hazır eklenti.
4. **Akış diyagramları:** Müşteri ↔ Üye işyeri ↔ Paynkolay ↔ Banka şeritli (swimlane) SVG diyagramlar — hem dokümanda hem sunumda kullanılır.
5. **Hash Test Formu'nu vitrine çıkarmak:** "Araçlar" bölümünde parlatılmış haliyle (Postman + test kartları + hash testi bir arada).
6. Kurumsal token'larla tutarlı, aydınlık ve ferah tema (page #F3F5FA zemin, beyaz kartlar, #2566E2 vurgu).

---

## 5. Planlamada birlikte karar vereceğimiz sorular

1. **Kapsam:** Önce dar bir dikey dilim mi (karşılama + 1 kategori hub + 1 API sayfası + test kartları) yoksa baştan 44 sayfanın tamamı mı? *(Önerim: dilimle başlayıp tasarımı kanıtlamak.)*
2. **Teknoloji:** Masaüstündeki klasörde saf HTML/CSS/JS statik prototip mi, yoksa bir framework mü? Sonunda gerçek siteye nasıl taşınacağı belli mi (PHP altyapısı)?
3. **Sayfa modeli:** iyzico gibi çok sayfalı mı, tek uzun sayfa + bölüm çıpaları mı?
4. **Yaratıcı katman:** 4. bölümdeki fikirlerden hangileri plana girecek (kişi seçimi? yolculuk şeridi? sihirbaz? diyagramlar?)
5. **Sunum ihtiyacı:** "Banka sunumu" senaryosu için ayrı bir şey mi gerekiyor (ör. yazdırılabilir genel bakış), yoksa sayfanın kendisi mi yeterli?
6. **Kapsam dışı netleşsin:** Koyu tema, EN dil, arama — ilk sürümde var mı yok mu?
