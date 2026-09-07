/* Hash Aracı: hashDatav2 üretimi tamamen tarayıcıda yapılır (SubtleCrypto).
   Hiçbir değer ağa gönderilmez. */
(function () {
  "use strict";

  var form = document.getElementById("hash-form");
  if (!form) {
    return;
  }

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

  function show(outId, strId, hashStr, hash) {
    document.getElementById(strId).textContent = hashStr;
    document.getElementById(outId.replace("out-", "hash-")).textContent = hash;
    document.getElementById(outId).hidden = false;
  }

  /* Ödeme formu */
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var parts = [
      val("f-sx"), val("f-ref"), val("f-amount"), val("f-success"),
      val("f-fail"), val("f-rnd"), val("f-customer"), val("f-secret")
    ];
    var hashStr = parts.join("|");
    show("out-payment", "str-payment", hashStr, await sha512b64(hashStr));
  });

  document.getElementById("fill-test").addEventListener("click", function () {
    document.getElementById("f-sx").value = "118591467|W8a1JLU8A5Cw+HfadVcO6HiR/GGGxr0NkWr2OGythr8fo0YWdw70cvnI6oKMqvzra3Qu+Wa5u0NRil9gRdJmjocVNd4XciDwfD9+pkVqDErw7/pVZfpcSO+GePg+ZvcqFbOO5A==";
    document.getElementById("f-ref").value = "TEST-0001";
    document.getElementById("f-amount").value = "10.00";
    document.getElementById("f-success").value = "https://ornek.com/success";
    document.getElementById("f-fail").value = "https://ornek.com/fail";
    var now = new Date();
    function pad(n) { return String(n).padStart(2, "0"); }
    document.getElementById("f-rnd").value = pad(now.getDate()) + "-" + pad(now.getMonth() + 1) + "-" +
      now.getFullYear() + " " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    document.getElementById("f-customer").value = "";
    document.getElementById("f-secret").value = "_viH5wUS4HiBmmw9uGybN";
  });

  /* Serbest mod */
  var freeForm = document.getElementById("free-form");
  freeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var text = document.getElementById("free-input").value;
    show("out-free", "str-free", text, await sha512b64(text));
  });
})();
