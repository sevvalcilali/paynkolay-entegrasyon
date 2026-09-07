/* Sol panel davranışı: accordion aç/kapa + mobil çekmece */
(function () {
  "use strict";

  /* --- Accordion ---
     İki başlık biçimi desteklenir: düz buton (.nav__group-btn) ve
     sayfaya götüren etiket + ayrı chevron (.nav__group-toggle). */
  var groups = document.querySelectorAll(".nav__group");

  groups.forEach(function (group) {
    var btn = group.querySelector(".nav__group-btn, .nav__group-toggle");
    if (!btn) {
      return;
    }

    /* Mouse tıklaması odak halkası bırakmasın (klavye odağı etkilenmez) */
    btn.addEventListener("mousedown", function (event) {
      event.preventDefault();
    });

    btn.addEventListener("click", function () {
      var isOpen = group.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* Grup etiketi: alt başlıklar açıkken tıklanırsa gezinmek yerine kapatır;
     kapalıyken normal davranır (sayfaya gider, sayfa grubu açık getirir). */
  var groupLinks = document.querySelectorAll(".nav__group-link");

  groupLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var group = link.closest(".nav__group");
      if (group.classList.contains("is-open")) {
        event.preventDefault();
        group.classList.remove("is-open");
        var toggle = group.querySelector(".nav__group-toggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  /* --- Mobil çekmece --- */
  var sidebar = document.getElementById("sidebar");
  var hamburger = document.getElementById("hamburger");
  var overlay = document.getElementById("overlay");

  function openDrawer() {
    sidebar.classList.add("is-open");
    overlay.hidden = false;
    /* hidden kalkar kalkmaz geçişin oynaması için bir kare bekle */
    requestAnimationFrame(function () {
      overlay.classList.add("is-visible");
    });
    document.body.classList.add("drawer-locked");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    document.body.classList.remove("drawer-locked");
    hamburger.setAttribute("aria-expanded", "false");
    overlay.addEventListener(
      "transitionend",
      function () {
        overlay.hidden = true;
      },
      { once: true }
    );
  }

  hamburger.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
      closeDrawer();
    }
  });
})();
