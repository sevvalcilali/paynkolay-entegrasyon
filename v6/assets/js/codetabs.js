/* Kod paneli davranışı: dil sekmeleri + panoya kopyalama */
(function () {
  "use strict";

  /* --- Dil sekmeleri --- */
  var boxes = Array.prototype.slice.call(document.querySelectorAll(".codebox"));

  boxes.forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll(".codebox__tab"));
    var panes = Array.prototype.slice.call(box.querySelectorAll(".codebox__pane"));

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
  });

  /* --- Kopyalama: aktif paneldeki düz metni panoya al --- */
  var copyButtons = Array.prototype.slice.call(
    document.querySelectorAll(".codebox__copy")
  );

  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".codebox");
      var active = box.querySelector(".codebox__pane.is-active");
      if (!active) {
        return;
      }

      navigator.clipboard.writeText(active.innerText).then(function () {
        var label = btn.querySelector("span");
        var previous = label.textContent;
        label.textContent = "Kopyalandı ✓";
        setTimeout(function () {
          label.textContent = previous;
        }, 1600);
      });
    });
  });
})();
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
