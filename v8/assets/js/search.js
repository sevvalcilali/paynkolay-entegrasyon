/* Dokümanlarda arama: Ctrl/Cmd+K veya üst bardaki kutu.
   İndeks (assets/search-index.json) ilk açılışta bir kez yüklenir. */
(function () {
  "use strict";

  var src = document.currentScript.src;
  var root = src.slice(0, src.indexOf("assets/js/search.js"));
  var index = null;
  var box, input, list;
  var sel = 0;
  var results = [];

  function build() {
    box = document.createElement("div");
    box.className = "searchbox";
    box.hidden = true;
    box.innerHTML =
      '<div class="searchbox__panel" role="dialog" aria-label="Dokümanlarda ara">' +
      '<div class="searchbox__head">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input type="text" placeholder="Dokümanlarda ara..." aria-label="Arama" autocomplete="off" spellcheck="false">' +
      '<kbd>Esc</kbd></div>' +
      '<div class="searchbox__list scroll-slim" role="listbox"></div></div>';
    document.body.appendChild(box);
    input = box.querySelector("input");
    list = box.querySelector(".searchbox__list");

    box.addEventListener("click", function (event) {
      if (event.target === box) {
        close();
      }
    });
    input.addEventListener("input", function () {
      query(input.value);
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        move(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Enter" && results[sel]) {
        window.location.href = root + results[sel].u;
      }
    });
  }

  function open() {
    if (!box) {
      build();
    }
    box.hidden = false;
    input.focus();
    input.select();
    if (!index) {
      fetch(root + "assets/search-index.json")
        .then(function (r) { return r.json(); })
        .then(function (data) {
          index = data;
          query(input.value);
        });
    } else {
      query(input.value);
    }
  }

  function close() {
    if (box) {
      box.hidden = true;
    }
  }

  function norm(text) {
    return text.toLocaleLowerCase("tr");
  }

  function esc(text) {
    return text.replace(/[&<>]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch];
    });
  }

  function highlight(text, tokens) {
    var safe = esc(text);
    tokens.forEach(function (t) {
      var i = norm(safe).indexOf(t);
      if (i > -1) {
        safe = safe.slice(0, i) + "<mark>" + safe.slice(i, i + t.length) + "</mark>" + safe.slice(i + t.length);
      }
    });
    return safe;
  }

  function query(text) {
    if (!index) {
      return;
    }
    var tokens = norm(text).split(/\s+/).filter(Boolean);
    if (!tokens.length) {
      results = [];
      list.innerHTML = '<div class="searchbox__empty">Sayfa, bölüm veya servis adı yazın — ör. "hash", "iade", "taksit"</div>';
      return;
    }

    results = [];
    for (var i = 0; i < index.length && results.length < 12; i++) {
      var rec = index[i];
      var hay = norm(rec.t + " " + rec.b + " " + rec.d);
      var ok = tokens.every(function (t) { return hay.indexOf(t) > -1; });
      if (ok) {
        results.push(rec);
      }
    }
    // başlık eşleşmeleri öne
    results.sort(function (a, b) {
      var at = tokens.some(function (t) { return norm(a.t).indexOf(t) > -1; }) ? 0 : 1;
      var bt = tokens.some(function (t) { return norm(b.t).indexOf(t) > -1; }) ? 0 : 1;
      return at - bt;
    });

    sel = 0;
    if (!results.length) {
      list.innerHTML = '<div class="searchbox__empty">Sonuç bulunamadı</div>';
      return;
    }
    list.innerHTML = results.map(function (rec, i) {
      return '<a class="searchbox__item' + (i === 0 ? " is-sel" : "") + '" href="' + root + rec.u + '">' +
        '<span class="searchbox__crumb">' + esc(rec.b) + '</span>' +
        '<span class="searchbox__title">' + highlight(rec.t, tokens) + '</span></a>';
    }).join("");
  }

  function move(delta) {
    if (!results.length) {
      return;
    }
    sel = (sel + delta + results.length) % results.length;
    var items = list.querySelectorAll(".searchbox__item");
    items.forEach(function (el, i) {
      el.classList.toggle("is-sel", i === sel);
    });
    items[sel].scrollIntoView({ block: "nearest" });
  }

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    } else if (event.key === "Escape" && box && !box.hidden) {
      close();
    }
  });

  var trigger = document.querySelector(".search");
  if (trigger) {
    trigger.addEventListener("click", open);
  }
})();
