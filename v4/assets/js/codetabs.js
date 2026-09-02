/* V4 davranışları: kesikli sekmeler, akordeon, platform filtresi */
(function () {
  "use strict";

  /* --- Kesikli çerçeveli sekmeler (Kullanım / Örnek İstek / Yanıt) --- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".dashtab"));
  var panes = Array.prototype.slice.call(document.querySelectorAll(".dashpane"));

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-tab");

      tabs.forEach(function (other) {
        other.classList.toggle("is-active", other === tab);
      });
      panes.forEach(function (pane) {
        pane.classList.toggle("is-active", pane.getAttribute("data-pane") === key);
      });
    });
  });

  /* --- Akordeon (Entegrasyon Senaryoları) --- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".acc__item"));

  items.forEach(function (item) {
    var btn = item.querySelector(".acc__btn");

    btn.addEventListener("click", function () {
      var isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* --- Platform filtresi (görsel demo: aktif sekme değişir) --- */
  var ptabs = Array.prototype.slice.call(document.querySelectorAll(".ptab"));

  ptabs.forEach(function (ptab) {
    ptab.addEventListener("click", function () {
      ptabs.forEach(function (other) {
        other.classList.toggle("is-active", other === ptab);
      });
    });
  });
})();
