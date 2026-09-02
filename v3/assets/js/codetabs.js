/* Response paneli: JSON'u panoya kopyalama */
(function () {
  "use strict";

  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-copy-resp]"));

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".respbox");
      var code = box.querySelector(".respbox__code");
      if (!code) {
        return;
      }

      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.classList.add("is-done");
        btn.setAttribute("title", "Kopyalandı ✓");
        setTimeout(function () {
          btn.classList.remove("is-done");
          btn.setAttribute("title", "Kopyala");
        }, 1600);
      });
    });
  });
})();
