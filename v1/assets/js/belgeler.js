/* Başvuru belgeleri kontrol listesi: şirket türüne göre evraklar listelenir,
   işaretler tarayıcıda (localStorage) saklanır. */
(function () {
  "use strict";

  var select = document.getElementById("belge-tur");
  var list = document.getElementById("belge-listesi");
  var progress = document.getElementById("belge-durum");
  if (!select || !list) {
    return;
  }

  var DOCS = {
    "bireysel": [
      "Müşteri Kimlik Önyüzü",
      "Müşteri Kimlik Arkayüzü",
      "Banka Ticari Hesap Bilgileri",
      "Vergi Muafiyet Yazısı"
    ],
    "adi-ortaklik": [
      "Ortaklık Sözleşmesi",
      "Gerçek Kişi Ortakların Kimlik Önyüzü ve Arkayüzü",
      "Ortakların İmza Sirküleri/Beyannamesi",
      "Tüzel Kişi Ortak İçin Ortağın Vergi Levhası",
      "Vergi Numarasını Gösterir Belge",
      "Yetkili Kişilerin Kimlik Önyüzü",
      "Yetkili Kişilerin Kimlik Arkayüzü"
    ],
    "kollektif": [
      "Vergi Levhası",
      "Firma Yetkilileri & Ortaklarının Kimlik Önyüzü",
      "Firma Yetkilileri & Ortaklarının Kimlik Arkayüzü",
      "İmza Sirküleri/Beyannamesi",
      "Şirket Ortağı Firma İse Vergi Levhası"
    ],
    "apartman": [
      "Karar Defteri Fotokopisi",
      "Yönetici Kimlik Belgesi Önyüzü",
      "Yönetici Kimlik Belgesi Arkayüzü",
      "Yöneticinin İmza Beyannamesi"
    ],
    "dernek-vakif": [
      "Vakıf Senedi / Dernek Karar Defteri",
      "Vakıf Sicil Belgesi / Dernek Faaliyet Belgesi",
      "Yetkili Kişilerin Kimlik Önyüzü",
      "Yetkili Kişilerin Kimlik Arkayüzü"
    ],
    "sahis": [
      "Vergi Levhası",
      "Firma Yetkilileri & Ortaklarının Kimlik Önyüzü",
      "Firma Yetkilileri & Ortaklarının Kimlik Arkayüzü",
      "İmza Sirküleri/Beyannamesi"
    ],
    "ltd": [
      "Vergi Levhası",
      "Ticaret Sicili Gazetesi",
      "Firma Yetkilileri & Ortaklarının Kimlik Önyüzü",
      "Firma Yetkilileri & Ortaklarının Kimlik Arkayüzü",
      "İmza Sirküleri/Beyannamesi"
    ],
    "as": [
      "Vergi Levhası",
      "Ticaret Sicili Gazetesi",
      "Firma Yetkilileri & Ortaklarının Kimlik Önyüzü",
      "Firma Yetkilileri & Ortaklarının Kimlik Arkayüzü",
      "İmza Sirküleri/Beyannamesi"
    ]
  };

  function storageKey() {
    return "pnk-docs:" + select.value;
  }

  function loadChecked() {
    try {
      return JSON.parse(localStorage.getItem(storageKey())) || {};
    } catch (e) {
      return {};
    }
  }

  function saveChecked(state) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(state));
    } catch (e) { /* gizli pencere vb. */ }
  }

  function updateProgress() {
    var boxes = list.querySelectorAll("input");
    var done = list.querySelectorAll("input:checked").length;
    progress.textContent = done + " / " + boxes.length + " belge hazır" + (done === boxes.length && boxes.length ? " 🎉" : "");
  }

  function render() {
    var docs = DOCS[select.value] || [];
    var checked = loadChecked();
    list.innerHTML = "";

    docs.forEach(function (name) {
      var li = document.createElement("li");
      var label = document.createElement("label");
      var box = document.createElement("input");
      box.type = "checkbox";
      box.checked = Boolean(checked[name]);
      box.addEventListener("change", function () {
        var state = loadChecked();
        state[name] = box.checked;
        saveChecked(state);
        li.classList.toggle("is-done", box.checked);
        updateProgress();
      });
      label.appendChild(box);
      label.appendChild(document.createTextNode(name));
      li.appendChild(label);
      li.classList.toggle("is-done", box.checked);
      list.appendChild(li);
    });

    updateProgress();
  }

  select.addEventListener("change", render);
  render();
})();
