/* Kod bloklarında dil sekmeleri + aktif paneli kopyalama. */
(function () {
  "use strict";

  document.querySelectorAll("[data-codetabs]").forEach(function (box) {
    var tabs = box.querySelectorAll(".codetabs__tab");
    var panels = box.querySelectorAll(".codetabs__panel");

    tabs.forEach(function (tab, i) {
      tab.addEventListener("mousedown", function (event) {
        event.preventDefault();
      });
      tab.addEventListener("click", function () {
        tabs.forEach(function (t, j) {
          t.classList.toggle("is-active", j === i);
          t.setAttribute("aria-selected", j === i ? "true" : "false");
        });
        panels.forEach(function (p, j) {
          p.classList.toggle("is-active", j === i);
        });
      });
    });

    var copy = box.querySelector(".codetabs__copy");
    copy.addEventListener("click", function () {
      var code = box.querySelector(".codetabs__panel.is-active code");
      navigator.clipboard.writeText(code.textContent).then(function () {
        var label = copy.querySelector("span");
        var old = label.textContent;
        label.textContent = "Kopyalandı ✓";
        setTimeout(function () {
          label.textContent = old;
        }, 1600);
      });
    });
  });
})();
