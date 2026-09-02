/* Ortak açılır menü davranışı: üst menü + dil kutusu */
(function () {
  "use strict";

  var dropdowns = Array.prototype.slice.call(document.querySelectorAll(".dropdown"));

  function close(dropdown) {
    dropdown.classList.remove("is-open");
    var btn = dropdown.querySelector("[data-dropdown]");
    if (btn) {
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function closeAll(except) {
    dropdowns.forEach(function (dropdown) {
      if (dropdown !== except) {
        close(dropdown);
      }
    });
  }

  dropdowns.forEach(function (dropdown) {
    var btn = dropdown.querySelector("[data-dropdown]");

    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      var isOpen = dropdown.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      closeAll(isOpen ? dropdown : null);
    });
  });

  /* Dışarı tıklayınca ve Esc ile kapan */
  document.addEventListener("click", function () {
    closeAll(null);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAll(null);
    }
  });

  /* Dil seçimi — görsel demo: etiket değişir, içerik çevirisi Faz 3+ */
  var langLabel = document.getElementById("lang-label");
  var langItems = Array.prototype.slice.call(
    document.querySelectorAll(".dropdown__item[data-lang]")
  );

  langItems.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      langItems.forEach(function (other) {
        other.classList.remove("is-selected");
      });
      item.classList.add("is-selected");
      langLabel.textContent = item.getAttribute("data-lang");
    });
  });
})();
