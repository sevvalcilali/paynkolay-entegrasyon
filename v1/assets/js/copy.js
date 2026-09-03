/* Kopyalanabilir değerler: [data-copy] değeri, [data-copy-code] yakın kod bloğunu kopyalar */
(function () {
  "use strict";

  function feedback(btn) {
    var label = btn.querySelector("span");
    var previous = label.textContent;
    btn.classList.add("is-done");
    label.textContent = "Kopyalandı ✓";
    setTimeout(function () {
      btn.classList.remove("is-done");
      label.textContent = previous;
    }, 1600);
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-copy]")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(btn.getAttribute("data-copy")).then(function () {
        feedback(btn);
      });
    });
  });

  Array.prototype.slice.call(document.querySelectorAll("[data-copy-code]")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var code = btn.closest(".codeblock").querySelector("code");
      navigator.clipboard.writeText(code.innerText).then(function () {
        feedback(btn);
      });
    });
  });
})();
