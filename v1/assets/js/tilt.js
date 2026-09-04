/* Ürün hero'su 3B sahnesi: mouse konumuna göre tilt + spot ışığı.
   prefers-reduced-motion açıksa sahne sabit kalır. */
(function () {
  "use strict";

  var scene = document.querySelector("[data-tilt]");
  if (!scene) {
    return;
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var MAX_DEG = 10;

  scene.addEventListener("pointermove", function (event) {
    if (reduce.matches) {
      return;
    }
    var rect = scene.getBoundingClientRect();
    var px = (event.clientX - rect.left) / rect.width;
    var py = (event.clientY - rect.top) / rect.height;

    scene.style.setProperty("--rx", ((px - 0.5) * 2 * MAX_DEG).toFixed(2) + "deg");
    scene.style.setProperty("--ry", ((0.5 - py) * 2 * MAX_DEG).toFixed(2) + "deg");
    scene.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    scene.style.setProperty("--my", (py * 100).toFixed(1) + "%");
  });

  scene.addEventListener("pointerleave", function () {
    scene.style.setProperty("--rx", "0deg");
    scene.style.setProperty("--ry", "0deg");
    scene.style.setProperty("--mx", "50%");
    scene.style.setProperty("--my", "50%");
  });
})();
