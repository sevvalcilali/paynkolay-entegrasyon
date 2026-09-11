/* Sol menü: accordion + masaüstünde aç/kapa (tercih hatırlanır) + mobil çekmece */
(function () {
  "use strict";

  /* --- Accordion ---
     İki başlık biçimi desteklenir: düz buton (.nav__group-btn) ve
     sayfaya götüren etiket + ayrı chevron (.nav__group-toggle). */
  document.querySelectorAll(".nav__group").forEach(function (group) {
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
  document.querySelectorAll(".nav__group-link").forEach(function (link) {
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

  var root = document.documentElement;
  var sidebar = document.getElementById("sidebar");
  var toggle = document.getElementById("hamburger");
  var overlay = document.getElementById("overlay");
  var desktop = window.matchMedia("(min-width: 1024px)");

  function syncExpanded() {
    var expanded = desktop.matches
      ? !root.classList.contains("sidebar-collapsed")
      : sidebar.classList.contains("is-open");
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  /* --- Masaüstü: menüyü daralt / aç --- */
  function setCollapsed(collapsed) {
    root.classList.toggle("sidebar-collapsed", collapsed);
    try {
      localStorage.setItem("pnk-sidebar", collapsed ? "collapsed" : "open");
    } catch (e) { /* gizli pencere vb. */ }
    syncExpanded();
  }

  /* --- Mobil çekmece --- */
  function openDrawer() {
    sidebar.classList.add("is-open");
    overlay.hidden = false;
    /* hidden kalkar kalkmaz geçişin oynaması için bir kare bekle */
    requestAnimationFrame(function () {
      overlay.classList.add("is-visible");
    });
    document.body.classList.add("drawer-locked");
    syncExpanded();
  }

  function closeDrawer() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    document.body.classList.remove("drawer-locked");
    overlay.addEventListener(
      "transitionend",
      function () {
        overlay.hidden = true;
      },
      { once: true }
    );
    syncExpanded();
  }

  toggle.addEventListener("click", function () {
    if (desktop.matches) {
      setCollapsed(!root.classList.contains("sidebar-collapsed"));
    } else if (sidebar.classList.contains("is-open")) {
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

  /* Pencere mobil → masaüstü genişlerse açık çekmece kapanır */
  desktop.addEventListener("change", function () {
    if (desktop.matches && sidebar.classList.contains("is-open")) {
      closeDrawer();
    }
    syncExpanded();
  });

  syncExpanded();
})();
