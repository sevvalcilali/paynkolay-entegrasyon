# Canlı Site Analizi — paynkolay.com.tr/entegrasyon/

*Tarih: 2026-09-08 · Yöntem: 45 sayfanın tamamı (index + 44 alt sayfa) indirildi, her sayfanın başlık yapısı, tabloları, kod blokları, görselleri ve metni çıkarılıp incelendi. Bu belge ANALIZ.md'nin (2026-09-01) güncel ve sayfa sayfa ayrıntılı devamıdır.*

---

## 1. Genel Yapı ve Kabuk

| Özellik | Durum |
|---|---|
| Sayfa sayısı | 45 (index + 44 numaralı `.php` sayfası) |
| Arama | ✅ Var (Ctrl+K, arama kutusu) |
| Breadcrumb | ✅ Her sayfada |
| Kod sekmeleri | ✅ PHP / .NET C# / Python / Node.js (+ dosya adı rozeti, Bootstrap tab) |
| Akış diyagramları | ✅ Mermaid yüklü (01, 02, 03, 05, 06, 36, 38'de flowchart/sequence) |
| Test bilgileri kopyalama | ✅ Tek tık kopyalanabilir token blokları |
| Meta description | ❌ **0 sayfada var** |
| Canonical etiketi | ❌ Yok |
| Koyu tema | ❌ Yok |
| EN içerik | ❌ Yok |
| "Son güncelleme" bilgisi | ❌ Yok |
| Geri bildirim mekanizması | ❌ Yok |
| Kurumsal menü/footer ayrışması | ❌ Kurumsal site menüsü, dev footer ve çerez bandı hâlâ her doküman sayfasında |

**1 Eylül analizinden bu yana site belirgin şekilde yenilenmiş.** O tarihte zayıf denen birçok nokta kapatılmış: SSS artık gerçek içerikli (IP itibarı/BrightCloud gibi nadir bilgiler dahil), ana sayfada "Canlı bilgilerinizi panelden nasıl alırsınız" bölümü (ekran görüntülü) var, iframe sayfası SameSite/X-Frame-Options sorun giderme kılavuzuna dönüşmüş, pazaryeri dokümantasyonu (31–39) baştan yazılmış görünüyor ve sigorta ödemeleri (46) eklenmiş.

## 2. Bilgi Mimarisi — Sol Menü (gerçek sıra)

9 akordeon grup:

1. **Temel Ödeme Entegrasyonu** — 01 Servisler · 02 Örnek Form · [03/19 API'ler] · 09 İptal-İade · 08 iFrame · 06 Ödeme Sonucu · 07 Test Kartları
2. **API Dokümantasyonu Versiyonları** — 03 "Taksit Bilgisi Size Ait" (v1) · 19 "Taksit Bilgisi Paynkolay'a Ait" (v0)
3. **Masterpass Entegrasyonu** — 18
4. **Pazaryeri Entegrasyonu** — 31–39 (9 sayfa)
5. **Güvenlik ve Doğrulama** — 04 Hash İsteği · 05 Hash Yanıtı · 10 İşlem Doğrulama · 28 Raporlama · 17 TLS · 43 Hata Kodları
6. **Gelişmiş Ödeme Özellikleri** — 29 Taksit · 11 Ön Provizyon · 12/13/14 Linkli Ödeme · 16 Düzenli Ödeme · 27 Ödeme Tamamlama · 30 Kart Programı · 44 Banka Kodları · 46 Sigorta
7. **Kart Yönetimi** — 14 Kart Saklama · 15 Kayıtlı Karttan Ödeme
8. **Open Source Entegrasyonlar** — 20–26 (7 eklenti)
9. **SSS / FAQ** — 45

Mimari pürüzler:
- **Çift 14 numara:** `14-delete-payment-link.php` ve `14-save-card.php` aynı numarayı taşıyor.
- **40–42 numaraları boş** (39'dan 43'e atlıyor) — URL'den içerik silindiği izlenimi.
- URL'ler dosya numarası sızdırıyor; menü sırası numara sırasıyla örtüşmüyor (ör. 28 Raporlama "Güvenlik" altında).
- **İki sayfa aynı başlığı taşıyor:** 18 ve 38 ikisi de "Masterpass Entegrasyonu" — aramada/sekmede ayırt edilemez.
- 28 Raporlama'nın "Güvenlik ve Doğrulama" altında olması tartışılır; içerik olarak 10 İşlem Doğrulama'nın kardeşi.

## 3. Sayfa Sayfa Analiz

### Ana sayfa (index)
Hero + "Paynkolay Nedir" + 4 yöntem kartı + Hızlı Başlangıç (273 no'lu test üye işyerinin sx/sx-List/sx-İptal/Secret Key değerleri kopyalanabilir bloklar) + panelden canlı bilgi alma rehberi (ekran görüntülü) + Önemli Konular + Teknik Detaylar + destek.
- ✅ Hızlı Başlangıç ve panel rehberi çok işlevsel.
- ⚠️ Yöntem kartlarındaki maddeler birebir tekrarlı ("PCI DSS…/Mobil uyumlu/3D Secure" iki kartta aynı); "Önemli Konular" 13 maddelik yapılandırılmamış düz liste.

### Temel ödeme (01–08)
- **01 Ödeme Entegrasyon Servisleri:** 3 yöntemin (Ortak Ödeme / Linkli / API) tanımı + form akışı + 22 satırlık parametre tablosu (İsim/Tipi/Açıklama/Zorunlu/Örnek). İyi bir giriş; ama "servislere genel bakış" sayfasına tüm form parametre referansının gömülmesi sayfayı iki işlevli yapıyor.
- **02 Örnek Form:** 5 dev kod bloğu (PHP, ASP.NET Razor ×2, Python/Flask, Node/Express; 85–146 satır). Kod kalitesi iyi (IP tespiti, hash üretimi dahil) ama sayfa neredeyse hiç düzyazı içermiyor; başlık hiyerarşisi tek H1 + "Test Ortamı".
- **03 API v1 ("Taksit Bilgisi Size Ait"):** `/Vpos/v1/Payment` akışı, ekran görüntüleri, 4 dilde tam örnek, 3D form basma yöntemi. ⚠️ "Canlıya localhost'tan istek güvenlik hatası verir" gibi kritik notlar düz madde arasında kayboluyor.
- **04 Hash İsteği:** Sitenin mücevheri. Canlı hash test formu + **8 farklı hash formülü** (ödeme, iptal-iade, raporlama, PayByLink, düzenli ödeme ×2, kayıtlı kart ×4 varyant, sigorta) her biri 4 dilde. ⚠️ Bu kadar kritik bir sayfada "canlı secret key'inizi bu forma girmeyin, sadece test değerleri kullanın" uyarısı yok.
- **05 Hash Yanıtı:** Response hash formülü + parametre örneği; kısa ve doğru.
- **06 Ödeme Sonucu:** Dokümantasyonun en iyi güvenlik sayfası: hash kontrolü + RESPONSE_CODE=2 + AUTH_CODE dolu + AUTHORIZATION_AMOUNT ≥ amount kuralları, mermaid karar akışı, 6 dilde `isPaymentSuccessful` örneği.
- **07 Test Kartları:** 21 kartlık tablo (banka, no, şema, SKT, CVC, 3D şifresi).
- **08 iFrame:** 4 örnek + **SameSite çerezleri ve X-Frame-Options/CSP sorun giderme kılavuzu** + canlıya çıkış kontrol listesi + teknik arka plan. Sektör standardının üstünde, pratik bir sayfa. ⚠️ "sayfa 3'teki örnek formu kullanabilirsiniz" ifadesi numarayla çapraz referans veriyor ve yanlış (örnek form sayfa 02'de).

### Güvenlik ve servisler (09–17, 27–30)
- **09 İptal/İade:** İptal=aynı gün, iade=sonraki günler + amount + trxDate; "iptal-iade sx'i satış sx'inden farklıdır" uyarısı doğru yerde. ⚠️ Parametre tablolarının ilk kolon başlığı boş.
- **10 İşlem Doğrulama:** STATUS (SUCCESS/ERROR/NEW) ve TRANSACTION_TYPE değerleri; NEW'in açıklaması ("yarıda kalmış işlem") değerli. ⚠️ Giriş cümlesi 28 Raporlama ile kelimesi kelimesine aynı (kopyala-yapıştır).
- **11 Ön Provizyon:** Kavramsal giriş (nedir, ne zaman kullanılır, 15–30 gün otomatik düşme) + 3 servis (listeleme/onay/iptal) + gerçek hata yanıtı örnekleri. ⚠️ Hata örneklerinde `java.text.ParseException` gibi **ham backend istisna mesajları** görünüyor — hem estetik hem bilgi sızıntısı açısından ayıklanmalı. Listelemede ayrı `sx-list` kullanımı iyi vurgulanmış.
- **12/13/14 Linkli Ödeme:** Oluştur (10 dk geçerlilik!), gönder (SMS/e-posta, NOT_FIXED serbest tutar, IMAGE_URL base64, CALLBACK_URL), sil (geri alınamaz). Üçü de kompakt ve yeterli. ⚠️ 12'deki "geçerlilik 10 dakikadır" bilgisi tabloda değil düzyazıda; gözden kaçmaya açık.
- **16 Düzenli Ödeme:** Talimat oluştur/iptal/listele + gerçek JSON yanıtları.
- **17 TLS:** Checklist formatında; Windows kayıt defteri sayfasına link + desteklenen 12 ciphersuite listesi. ⚠️ curl örneğindeki cipher adı (`ECDHE-RSA-WITH-AES_128_GCM_SHA256`) OpenSSL'in gerçek adlandırması değil (doğrusu `ECDHE-RSA-AES128-GCM-SHA256`); komut kopyalanınca büyük olasılıkla çalışmaz.
- **27 Ödeme Tamamlama (2 aşamalı 3D):** Kısa, öz. ⚠️ "AUTOCOMPLATE" yazım hatası (doğrusu AUTOCOMPLETE).
- **28 Raporlama:** İstek/yanıt örnekleri iyi; 10 ile giriş metni ve değer listeleri tekrar ediyor.
- **29 Taksit Servisi:** İki servis (tarih ile / kart ile) + **COMMISION vs MERCHANT_COMMISSION ayrım tablosu** (Nkolay komisyonu vs üye işyerinin vade farkı) — sık karışan bir konuyu net çözmüş.
- **30 Kart Programı:** 001–018 kod listesi; sade ve yeterli.

### API versiyonları (03 & 19)
"Versiyon 1 = taksit sizde, Versiyon 0 = taksit Paynkolay'da" ayrımı doğru anlatılmış; ancak **v0/v1 adlandırması ile menü etiketleri** ("Size Ait"/"Paynkolay'a Ait") ilk bakışta eşleşmiyor; endpoint'ler de farklı desende (`/Vpos/v1/Payment` vs `/Vpos/Payment/PaymentInstallments` + `/Vpos/Payment/Payment`). Hangi durumda hangisinin seçileceğine dair karar tablosu yok.

### Kart yönetimi (14-save-card & 15)
- 14: Kart kaydetme (csCustomerKey + csAutoSave, 3D şart), Kart Kayıt API (aynı gün IKSIRPF referansı ile), listeleme, silme, saklı karttan ödeme — kapsamlı.
- ⚠️ **15 sayfası neredeyse tamamen 14'ün "Saklı Karttan Ödeme" bölümünün kopyası** (aynı paragraf + aynı görsel). Ya birleştirilmeli ya 15 gerçek içerik almalı. 15'te "Saklı **Kartan**" yazım hatası da var.

### Pazaryeri (31–39) — dokümantasyonun en modern bölümü
Her sayfada TEST/PROD endpoint blokları, JSON istek/yanıt örnekleri, parametre tabloları (Tip/Zorunlu kolonlu), kullanım senaryoları, "Sonraki Adımlar" navigasyonu ve best-practice blokları var. Tekil (Vpos) tarafından tamamen farklı bir teknoloji dünyası: **JSON + JWT Bearer + apiKey hash**.
- **31 Genel Bakış:** Kavramlar, MCC 5262 / NACE kodları tablosu, stopaj hesabı, valör/transfer akışı — iş geliştirme + teknik kitleyi aynı anda besliyor.
- **32 Kimlik Doğrulama:** JWT akışı, token cache/yenileme sınıf örneği, 401 yönetimi.
- **33 Hash:** 3 farklı apiKey formülü (ödeme / saklı kart listeleme / iptal-iade) + **sunucu taraflı calculate-hash doğrulama servisleri** + callback hash doğrulama + güvenlik best-practices (❌/✅ örnekli). Çok güçlü.
- **34 Ödeme Profili:** 5 CRUD servisi + valör tipleri (W/H/M/T/D) + 3 senaryo.
- **35 Satıcı:** 6 servis + gerçek/şahıs/tüzel ayrımı + IBAN/TCKN/VKN doğrulama algoritmaları. "sellerType/tckn değiştirilemez", "borcu olan satıcı silinemez" gibi kısıtlar açıkça yazılmış.
- **36 Ödeme:** CreatePayment (base64 3D form akışı + mermaid sequence), GetPaymentStatus, saklı kart, taksit, komisyon güncelleme (sadece aynı gün!), **CompletePaymentExternal (autoComplete=false akışı)** ve **UpdateDeliveryDate (teslimat bazlı valör)**. Kapsam tam.
- **37 İptal/İade:** Kısmi iade, indirimli iade senaryoları (satıcı/pazaryeri indirimi ayrımı), hata tablosu (ALREADY_REFUNDED…) + güvenli iade örneği.
- **38 Masterpass (pazaryeri):** GSM formatı (❌/✅ örnekli), gönderilmeyecek parametre listesi, akış diyagramı, 4 dilde sınıf örneği, UI örneği.
- **39 Raporlama:** 5 servis (işlem, satıcı-tarih, ödeme listesi, borç, **ApplyPenalty/ceza**) + dashboard ve Excel export örnekleri.
- ⚠️ Bölüm geneli: stopaj örneği (100 TL → KDV hariç 80 TL) hangi vergi oranını varsaydığını söylemiyor; sequence diyagramlar bazı sayfalarda kod bloğu olarak duruyor (render kontrolü yapılmalı).

### Hazır eklentiler (20–26)
Ekran görüntülü adım adım kurulum; OpenCart 4 sürüm için ayrı paket + GitHub kaynak linki; WooCommerce'te sürüm rozeti (v1.1.2).
- ⚠️ **20 Magento 1.9:** Platformun desteği yıllar önce bitti; "EOL — güvenlik riski" uyarısı yok.
- ⚠️ **25 GiveWP** bölümün en zayıf sayfası: başlıksız, akışı bozuk cümleler ("Eklentilere tıklayınız… arama kısmına give wp yazın").
- ⚠️ Ekran görüntülerinin tamamında `alt='image'` — erişilebilirlik açısından anlamsız.

### Referans sayfaları (43–46)
- **43 Hata Kodları:** 69 kod + açıklama. ⚠️ "Ne yapmalı" kolonu yok; hangi hatalar tekrar denenebilir (retryable) bilgisi eksik.
- **44 Banka Kodları:** ⚠️ Ciddi veri bakımı sorunu: **mükerrer kayıtlar** (013 & 134 Denizbank; 048 & 123 HSBC; 203 & 223 Al Baraka) ve **kapanmış/devralınmış bankalar** listede duruyor (BCCI, Credit Lyonnais, KentBank, Türk Sakura Bank, Fortis, Asya Katılım…). Bunun tarihsel TCMB/BDDK kod listesi olduğu, servis yanıtında hangi alt kümenin dönebileceği açıklanmamış.
- **45 SSS:** 5 soru ama isabetli: panelde sx görünmemesi (yetki), test/canlı URL'leri, "Girdiğiniz bilgileri kontrol ediniz" hatasının 3 nedeni, **timeout'un IP itibarından (BrightCloud) kaynaklanabilmesi** — başka hiçbir yerde bulunmayan destek bilgisi.
- **46 Sigorta (TCKN ile Ödeme):** MCC 6300 + NonSecure yetki şartları, **2 ayrı test üye işyeri** (kendi sx setleriyle), TCKN'li özel hash formülü, 18 parametrelik tablo, hash'i otomatik hesaplayan pre-request script'li Postman koleksiyonu. Yeni ve kaliteli bir sayfa.

## 4. Çapraz Kesit Bulgular

### Güçlü yönler (korunmalı / yeni tasarıma taşınmalı)
1. Hash Test Formu + 8 formül × 4 dil (04)
2. Ödeme sonucu doğrulama kuralları + 6 dilde hazır fonksiyon (06)
3. iFrame SameSite/X-Frame-Options sorun giderme + canlıya çıkış checklist'i (08)
4. Pazaryeri bölümünün tamamı — özellikle calculate-hash doğrulama servisleri (33) ve senaryolu anlatım
5. Tek tık kopyalanabilir test kimlik blokları; Postman koleksiyonları (sigortada pre-request script'li)
6. SSS'deki IP itibarı/timeout bilgisi (45)
7. COMMISION / MERCHANT_COMMISSION ayrım tablosu (29)

### Teknik/SEO eksikleri
- Meta description ve canonical hiçbir sayfada yok; sosyal paylaşım/arama görünümü zayıf.
- Kurumsal menü + footer + çerez bandı doküman deneyimini bölüyor (kimlik ayrışması hâlâ yok).
- Koyu tema, EN, "son güncelleme", geri bildirim yok.
- Görsellerde anlamlı alt metin yok (`alt='image'`).

### İçerik kalitesi sorunları (düzeltme listesi)
| Yer | Sorun |
|---|---|
| 14-save-card / 15 | Aynı bölüm iki sayfada kopya; 15 neredeyse boş |
| 10 / 28 | Giriş metni ve değer listeleri birebir tekrar |
| 08 | "Sayfa 3'teki örnek form" — yanlış/numaralı çapraz referans |
| 27 | "AUTOCOMPLATE" yazım hatası |
| 15 | "Saklı Kartan" yazım hatası |
| 03, 14, 15, 19 | "Code sinppet" yazım hatası (tekrarlayan) |
| 17 | curl cipher adı OpenSSL adlandırmasıyla uyumsuz (komut çalışmaz) |
| 11 | Hata örneklerinde ham Java exception mesajları |
| 44 | Mükerrer + kapanmış banka kayıtları |
| 18 vs 38 | Aynı sayfa başlığı ("Masterpass Entegrasyonu") |
| 04 | Hash formuna "canlı secret girmeyin" uyarısı yok |
| 20 | Magento 1.9 EOL uyarısı yok |
| 31/36/37 | Stopaj örneğinde vergi oranı varsayımı açıklanmamış |

### Yapısal gözlem
Tekil üye işyeri (Vpos: form-data + SHA-512 hash) ile Pazaryeri (JSON + JWT + apiKey) iki ayrı dünya; dokümantasyon bu ikisini üst seviyede karşılaştıran bir "hangi API bana göre?" sayfasından yoksun. v0/v1 seçimi için de karar tablosu yok.

## 5. Yeniden Tasarım (v1–v8) ile Senkron Durumu

v8 içeriği canlı siteyle büyük oranda senkron çıktı (update-delivery, penalty, CompletePaymentExternal, calculate-hash, InsurancePayment, BrightCloud, byPaymentProfile, storedCardList, withholdingTax konularının hepsi v8'de mevcut). **Tek önemli boşluk:**

- ❌ **iFrame sayfasının (08) tamamı v8'de yok** — SameSite çerez yapılandırması, X-Frame-Options/CSP çözümleri ve canlıya çıkış kontrol listesi dahil. v8'de "iframe" yalnızca form-ile-odeme sayfasında bir cümle olarak geçiyor. Yeni tasarıma "Form ile Ödeme" altına alt sayfa ya da "Ek Bilgiler"e "iFrame Kullanımı" sayfası olarak taşınmalı.
- Ayrıca canlı sitedeki sigorta sayfasının **2 ayrı test üye işyeri kimlik seti** (400001647 / 400001820) v8 sigorta sayfasıyla karşılaştırılıp eşitlenmeli.

## 6. Öncelikli Öneriler (etki sırasıyla)

1. **08'in sorun giderme içeriğini v8'e taşı** (yukarıdaki boşluk).
2. 14/15 kart sayfalarını birleştir ya da 15'i gerçek içerikle doldur; 10/28 tekrarını tekilleştir.
3. 44 banka kodlarını güncel liste + "tarihsel kodlar" ayrımıyla yeniden yapılandır.
4. Yazım/teknik hataları düzelt (sinppet, AUTOCOMPLATE, Kartan, 17'deki cipher adı, 08'deki sayfa referansı).
5. Meta description + canonical ekle; görsellere anlamlı alt metin ver.
6. "Hangi API bana göre?" karar sayfası (Vpos v1 / v0 / Pazaryeri / Ortak Ödeme / Linkli) ekle.
7. 43'e "ne yapmalı / tekrar denenebilir mi" kolonu ekle.
8. 04'e canlı-secret uyarısı, 20'ye Magento EOL uyarısı ekle.
