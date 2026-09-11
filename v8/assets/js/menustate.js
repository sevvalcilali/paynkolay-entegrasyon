/* Sol menü tercihi (açık/kapalı): head içinde senkron yüklenir ki
   kapalı bırakılan menü sayfa geçişlerinde bir an açık görünmesin. */
(function () {
  "use strict";

  try {
    if (localStorage.getItem("pnk-sidebar") === "collapsed") {
      document.documentElement.classList.add("sidebar-collapsed");
    }
  } catch (e) { /* gizli pencere vb. */ }
})();
