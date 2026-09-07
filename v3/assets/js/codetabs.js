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
