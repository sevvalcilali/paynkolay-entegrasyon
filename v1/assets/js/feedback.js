/* "Bu sayfa yardımcı oldu mu?" — seçim tarayıcıda (localStorage) hatırlanır. */
(function () {
  "use strict";

  var box = document.querySelector("[data-feedback]");
  if (!box) {
    return;
  }

  var key = "pnk-fb:" + window.location.pathname;
  var thanksUp = box.querySelector(".feedback__thanks--up");
  var thanksDown = box.querySelector(".feedback__thanks--down");

  function done(vote) {
    box.setAttribute("data-done", "");
    (vote === "down" ? thanksDown : thanksUp).hidden = false;
  }

  var saved = null;
  try {
    saved = localStorage.getItem(key);
  } catch (e) { /* gizli pencere vb. */ }
  if (saved) {
    done(saved);
    return;
  }

  box.querySelectorAll(".feedback__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var vote = btn.getAttribute("data-vote");
      try {
        localStorage.setItem(key, vote);
      } catch (e) { /* yoksay */ }
      done(vote);
    });
  });
})();
