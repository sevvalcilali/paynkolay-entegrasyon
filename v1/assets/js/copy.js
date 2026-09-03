/* Kopyalanabilir değerler: [data-copy] butonları panoya yazar */
(function () {
  "use strict";

  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-copy]"));

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(btn.getAttribute("data-copy")).then(function () {
        var label = btn.querySelector("span");
        var previous = label.textContent;
        btn.classList.add("is-done");
        label.textContent = "Kopyalandı ✓";
        setTimeout(function () {
          btn.classList.remove("is-done");
          label.textContent = previous;
        }, 1600);
      });
    });
  });
})();
