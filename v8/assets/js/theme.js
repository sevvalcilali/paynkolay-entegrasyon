/* Tema seçimi: açık / sistem / koyu.
   Head içinde senkron yüklenir ki sayfa ilk boyamada doğru temayla gelsin. */
(function () {
  "use strict";

  var KEY = "pnk-theme";
  var ORDER = ["light", "system", "dark"];
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return ORDER.indexOf(v) === -1 ? "system" : v;
    } catch (e) {
      return "system";
    }
  }

  function apply(choice) {
    var dark = choice === "dark" || (choice === "system" && media.matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  apply(stored());

  media.addEventListener("change", function () {
    if (stored() === "system") {
      apply("system");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".theme-switch__btn");
    if (buttons.length !== ORDER.length) {
      return;
    }

    function sync(choice) {
      buttons.forEach(function (btn, i) {
        btn.classList.toggle("is-active", ORDER[i] === choice);
      });
    }

    sync(stored());

    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        try {
          localStorage.setItem(KEY, ORDER[i]);
        } catch (e) { /* gizli pencere vb. */ }
        apply(ORDER[i]);
        sync(ORDER[i]);
      });
    });
  });
})();
