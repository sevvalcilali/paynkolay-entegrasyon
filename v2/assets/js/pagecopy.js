/* "Sayfayı Kopyala": makale metnini düz yazı olarak panoya alır */
(function () {
  "use strict";

  var btn = document.querySelector(".copybtn");
  var article = document.querySelector(".article");
  if (!btn || !article) {
    return;
  }

  btn.addEventListener("click", function () {
    navigator.clipboard.writeText(article.innerText).then(function () {
      var previous = btn.lastChild.textContent;
      btn.lastChild.textContent = " Kopyalandı ✓";
      setTimeout(function () {
        btn.lastChild.textContent = previous;
      }, 1600);
    });
  });
})();
