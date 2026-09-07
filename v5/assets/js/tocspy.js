/* "Bu Sayfada" scroll-spy: görünür bölüme göre aktif TOC maddesi. */
(function () {
  "use strict";

  var links = document.querySelectorAll('.toc__list a[href^="#"]');
  if (!links.length) {
    return;
  }

  var map = new Map();
  links.forEach(function (link) {
    var el = document.getElementById(link.getAttribute("href").slice(1));
    if (el) {
      map.set(el, link);
    }
  });
  if (!map.size) {
    return;
  }

  function activate(link) {
    links.forEach(function (l) {
      l.classList.toggle("is-active", l === link);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        activate(map.get(entry.target));
      }
    });
  }, { rootMargin: "-15% 0px -75% 0px" });

  map.forEach(function (_link, el) {
    observer.observe(el);
  });
})();
