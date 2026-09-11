/* İptal/İade Deneme Konsolu: hash üretimi + cURL + test ortamına istek.
   Hesaplama tamamen tarayıcıda yapılır (SubtleCrypto); "İsteği Gönder"
   yalnızca TEST ortamına çağrı yapar. */
(function () {
  "use strict";

  var form = document.getElementById("cr-form");
  if (!form) {
    return;
  }

  var ENDPOINT = "https://paynkolaytest.nkolayislem.com.tr/Vpos/v1/CancelRefundPayment";

  async function sha512b64(text) {
    var buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(text));
    var bytes = new Uint8Array(buf);
    var bin = "";
    for (var i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin);
  }

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  function fields() {
    return {
      sx: val("cr-sx"),
      ref: val("cr-ref"),
      type: val("cr-type"),
      amount: val("cr-amount"),
      trxDate: val("cr-trxdate"),
      secret: val("cr-secret")
    };
  }

  async function compute() {
    var f = fields();
    var hashStr = [f.sx, f.ref, f.type, f.amount, f.trxDate, f.secret].join("|");
    var hash = await sha512b64(hashStr);

    document.getElementById("cr-str").textContent = hashStr;
    document.getElementById("cr-hash").textContent = hash;
    document.getElementById("cr-curl").textContent =
      'curl -X POST "' + ENDPOINT + '" \\\n' +
      '  -F "sx=' + f.sx + '" \\\n' +
      '  -F "referenceCode=' + f.ref + '" \\\n' +
      '  -F "type=' + f.type + '" \\\n' +
      '  -F "amount=' + f.amount + '" \\\n' +
      '  -F "trxDate=' + f.trxDate + '" \\\n' +
      '  -F "hashDatav2=' + hash + '"';
    document.getElementById("out-cr").hidden = false;
    return { fields: f, hash: hash };
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    compute();
  });

  document.getElementById("cr-fill").addEventListener("click", function () {
    document.getElementById("cr-sx").value = "118591467|W8a1JLU8A5Cw+HfadVcO6HiR/GGGxr0NkWr2OGythr8fo0YWdw70cvnI6oKMqvzra3Qu+Wa5u0NRil9gRdJmjocVNd4XciDwfD9+pkVqDErw7/pVZfpcSO+GePg+ZvcqFbOO5A==|yDUZaCk6rsoHZJWI3d471A/+TJA7C81X";
    document.getElementById("cr-ref").value = "IKSIRPF142277040";
    document.getElementById("cr-type").value = "cancel";
    document.getElementById("cr-amount").value = "10.00";
    var now = new Date();
    function pad(n) { return String(n).padStart(2, "0"); }
    document.getElementById("cr-trxdate").value = now.getFullYear() + "." + pad(now.getMonth() + 1) + "." + pad(now.getDate());
    document.getElementById("cr-secret").value = "_viH5wUS4HiBmmw9uGybN";
  });

  document.getElementById("cr-send").addEventListener("click", async function () {
    var out = await compute();
    var respEl = document.getElementById("cr-resp");
    document.getElementById("out-cr-resp").hidden = false;
    respEl.textContent = "Gönderiliyor…";

    var body = new FormData();
    body.append("sx", out.fields.sx);
    body.append("referenceCode", out.fields.ref);
    body.append("type", out.fields.type);
    body.append("amount", out.fields.amount);
    body.append("trxDate", out.fields.trxDate);
    body.append("hashDatav2", out.hash);

    try {
      var res = await fetch(ENDPOINT, { method: "POST", body: body });
      var text = await res.text();
      try {
        respEl.textContent = JSON.stringify(JSON.parse(text), null, 2);
      } catch (e) {
        respEl.textContent = "HTTP " + res.status + "\n" + text;
      }
    } catch (e) {
      respEl.textContent =
        "İstek tarayıcıdan gönderilemedi (büyük olasılıkla CORS engeli).\n" +
        "Yukarıdaki cURL komutunu kopyalayıp terminalden çalıştırın — komut aynı isteği gönderir.";
    }
  });
})();
