/* Açılır sol menü: accordion + drawer aç/kapa + aktif sayfayı işaretleme. */
(function () {
  "use strict";

  /* --- Accordion --- */
  document.querySelectorAll(".nav__group").forEach(function (group) {
    var btn = group.querySelector(".nav__group-btn, .nav__group-toggle");
    if (!btn) {
      return;
    }
    btn.addEventListener("mousedown", function (event) {
      event.preventDefault();
    });
    btn.addEventListener("click", function () {
      var isOpen = group.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* Açık grubun etiketine tıklanınca gezinmek yerine kapatır */
  document.querySelectorAll(".nav__group-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var group = link.closest(".nav__group");
      if (group && group.classList.contains("is-open")) {
        event.preventDefault();
        group.classList.remove("is-open");
        var toggle = group.querySelector(".nav__group-toggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  var drawer = document.getElementById("sidebar");
  var toggle = document.getElementById("hamburger");
  var overlay = document.getElementById("overlay");
  var closeBtn = document.querySelector(".drawer__close");
  if (!drawer || !toggle || !overlay) {
    return;
  }

  /* --- Aktif sayfa: URL'ye göre işaretle, atalarını aç --- */
  drawer.querySelectorAll(".nav a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (/^(https?:|#|mailto:)/.test(href)) {
      return;
    }
    if (new URL(href, location.href).pathname === location.pathname) {
      a.classList.add("is-active");
      var node = a.closest(".nav__group");
      var outer = null;
      while (node) {
        node.classList.add("is-open");
        var t = node.querySelector(":scope > .nav__group-head > .nav__group-toggle, :scope > .nav__group-btn");
        if (t) {
          t.setAttribute("aria-expanded", "true");
        }
        outer = node;
        node = node.parentElement ? node.parentElement.closest(".nav__group") : null;
      }
      if (outer) {
        outer.classList.add("is-current");
      }
    }
  });

  /* --- Drawer aç/kapa --- */
  function open() {
    drawer.classList.add("is-open");
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add("is-visible");
    });
    document.body.classList.add("drawer-locked");
    toggle.setAttribute("aria-expanded", "true");
  }

  function close() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    document.body.classList.remove("drawer-locked");
    toggle.setAttribute("aria-expanded", "false");
    overlay.addEventListener("transitionend", function handler() {
      overlay.hidden = true;
      overlay.removeEventListener("transitionend", handler);
    });
  }

  toggle.addEventListener("click", function () {
    if (drawer.classList.contains("is-open")) {
      close();
    } else {
      open();
    }
  });

  overlay.addEventListener("click", close);
  if (closeBtn) {
    closeBtn.addEventListener("click", close);
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) {
      close();
    }
  });
})();
