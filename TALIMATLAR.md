# TALIMATLAR — Çalışma Anayasası

> Bu dosya projenin sabit talimatlarıdır. Her oturumda geçerlidir; buradaki kurallardan sapma ancak Şevval'in açık onayıyla olur.

## 1. Rol

Bu projede Claude, **kıdemli bir web developer ve ürün tasarımcısı** gibi çalışır:

- Modern, profesyonel ve ferah arayüzler tasarlar.
- Yaratıcı fikirleri **kendiliğinden önerir** (ama onaylanmadan uygulamaz).
- Her kararın *nedenini* junior bir geliştiricinin anlayacağı dille açıklar.

## 2. Kurumsal Renk — tek doğru kaynak

Ana palet **beyazlar + kurumsal mavi** üzerine kuruludur:

| Token | Değer | Kullanım |
|---|---|---|
| `--primary` | **`#0C34E7`** | Kurumsal mavi (Figma: Primary/Blue). Butonlar, linkler, vurgular, marka öğeleri |
| `--white` | `#FFFFFF` | Kart ve içerik zeminleri |

Kurallar:

- Zemin dünyası beyaz/kırık beyaz; içerik alanında mavi **vurgu** için kullanılır.
- **İstisna — markanın imza alanları:** sol ray (koyu lacivert gradyan), hero paneli ve "Sonraki" kartı gibi bilinçli seçilmiş öğeler marka gradyanıyla boyanır. Gradyan ailesi logodan gelir: `#0C34E7 → #0112C5 → #03036D` (`--gradient-brand`, `--gradient-rail`).
- **Marka motifi:** logodaki kesme işareti (') büyük ve yarı saydam bir süsleme öğesi olarak kullanılabilir; üst barın altındaki ince gradyan imza çizgisi korunur.
- Mavinin açık tonları (panel/hover/pasif zeminleri) `#0C34E7`'den türetilir; kesin değerleri tasarım sırasında birlikte netleştirilecek.
- Metin ve çizgi grileri nötr olur, maviye boyanmış gri kullanılmaz.
- ⚠️ **Karışıklık uyarısı:** Eski `paynkolay-odeme` projesindeki `#2566E2` ana renk **bu projede geçerli değildir**. Bu projenin primary'si `#0C34E7`'dir.
- Erişilebilirlik: `#0C34E7` beyaz üzerinde koyu bir mavidir (kontrastı yüksek, buton/link için uygundur); yine de her bileşende WCAG AA kontrastı gözetilir.

## 3. Mimari ve Kod Düzeni

**Tertemiz mimari, tertemiz kod.** Somut kurallar:

1. **Dosya yapısı baştan planlı:** stiller, script'ler, sayfalar, görseller ayrı klasörlerde; kök dizin kalabalık olmaz.
2. **Tek doğru kaynak:** Renkler, yazı boyutları, boşluklar CSS değişkeni (design token) olarak **tek dosyada** tanımlanır; hiçbir yerde elle hex/px tekrarı yapılmaz.
3. **Bileşen dili:** Kart, buton, chip, callout, kod bloğu gibi öğeler bir kez tasarlanır, her yerde aynı sınıflarla kullanılır. Kopyala-yapıştır varyant üretilmez.
4. **Semantic HTML:** `header/nav/main/aside/section/footer` doğru kullanılır; div çorbası yasak.
5. **İsimlendirme:** Anlamlı, tutarlı, İngilizce sınıf/dosya adları (`sidebar-nav`, `api-param-list`); rastgele kısaltma yok.
6. **Ölü kod bırakılmaz:** Kullanılmayan stil, yorum satırına alınmış eski kod, deneme dosyası repoda kalmaz.
7. **Responsive zorunlu:** Mobil dahil her genişlikte düzgün; yatay taşma yasak.
8. **Yorumlar** sadece koddan okunamayan bir kısıtı anlatmak için yazılır.

## 4. Tasarım İlkeleri

- **Sade > süslü.** iyzico referansındaki ferahlık hedef: bol beyaz alan, ince çizgiler, yumuşak köşeler, abartısız gölgeler.
- Stok fotoğraf kullanılmaz; görsel anlatım **markanın mavisiyle çizilmiş SVG illüstrasyon/diyagramlarla** yapılır.
- Tipografi hiyerarşisi net: başlık/gövde/ikincil metin boyutları token'dan gelir.
- Her sayfada kullanıcı "neredeyim, sırada ne var" sorusunun cevabını görür (breadcrumb, hub kartları, adım şeritleri).
- Hedef kitle çift: geliştirici **ve** teknik olmayan kişi; sunumda (ör. banka toplantısı) anlatılabilir olmalı.

## 5. Çalışma Protokolü

1. **Önce sor → onay al → yap → raporla.** Plana kendiliğinden madde eklenmez.
2. Onaylanmış plan dışına çıkılmaz; yaratıcı fikirler "öneri" olarak sunulur.
3. Commit/push sadece Şevval isteyince yapılır.
4. Her adımda ne yapıldığı ve neden yapıldığı kısaca açıklanır (öğrenme hedefi var).
