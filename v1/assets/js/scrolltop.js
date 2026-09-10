/* Sayfalar arası her geçiş sayfanın en üstünden başlar.
   Head içinde yüklenir; tarayıcının eski kaydırma konumunu geri
   yüklemesini kapatır. Çapalı adresler (arama sonuçları) korunur. */
(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  /* pageshow, geri/ileri (bfcache) dönüşlerinde de tetiklenir */
  window.addEventListener("pageshow", function () {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  });
})();
