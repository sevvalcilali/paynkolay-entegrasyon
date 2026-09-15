# Paynkolay Sanal POS V1 — NON-3D ödeme örneği (Python + requests)
# Kurulum: pip install requests
# Çalıştırma: python3 example.py  →  http://localhost:8000/odeme
# Not: Canlı uç localhost'tan gelen istekleri reddeder; canlıda sunucunuzdan çalıştırın.
import base64
import hashlib
import ipaddress
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer

import requests

# Kimlik bilgileri (size verilen değerler)
SX = "SX_DEGERINIZ"
MERCHANT_SECRET_KEY = "SECRET_KEY_DEGERINIZ"

# Test ucu — canlı: https://paynkolay.nkolayislem.com.tr/Vpos/v1/Payment
API_URL = "https://paynkolaytest.nkolayislem.com.tr/Vpos/v1/Payment"


def client_ip(handler):
    """Müşteri IP'si: önce proxy başlıkları, yoksa bağlantı adresi."""
    for header in ("CF-Connecting-IP", "X-Forwarded-For", "X-Real-IP"):
        value = handler.headers.get(header)
        if value:
            ip = value.split(",")[0].strip()
            try:
                ipaddress.ip_address(ip)
                return ip
            except ValueError:
                pass
    return handler.client_address[0]


def pay(card_holder_ip):
    # Sipariş ve kart bilgileri (gerçekte ödeme formunuzdan gelir)
    client_ref_code = "789456|AB76"  # her işlemde benzersiz olmalı (ör. "ORDER-" + uuid)
    amount = "6.00"
    success_url = "https://siteniz.com/payment/success"  # non-3D'de çağrılmaz ama zorunludur ve hash'e girer
    fail_url = "https://siteniz.com/payment/fail"
    customer_key = ""  # kart saklanmıyorsa boş

    # rnd: Türkiye saatiyle (UTC+3) dd-MM-yyyy HH:mm:ss
    rnd = datetime.now(timezone(timedelta(hours=3))).strftime("%d-%m-%Y %H:%M:%S")

    # hashDatav2: alanlar | ile birleşir → SHA512 (ham bayt) → Base64
    hash_str = "|".join([SX, client_ref_code, amount, success_url, fail_url, rnd, customer_key, MERCHANT_SECRET_KEY])
    hash_datav2 = base64.b64encode(hashlib.sha512(hash_str.encode("utf-8")).digest()).decode("ascii")

    fields = {
        "sx": SX,
        "clientRefCode": client_ref_code,
        "successUrl": success_url,
        "failUrl": fail_url,
        "amount": amount,
        "installmentNo": "1",
        "cardHolderName": "Tuna Çınar",
        "month": "12",
        "year": "2026",
        "cvv": "001",
        "cardNumber": "4546711234567894",
        "use3D": "false",  # ← non-3D'yi belirleyen tek satır
        "transactionType": "SALES",
        "cardHolderIP": card_holder_ip,
        "rnd": rnd,
        "hashDatav2": hash_datav2,
        "environment": "API",
        "currencyNumber": "949",
        "MerchantCustomerNo": "",  # opsiyonel: temsilci / alt üye işyeri no
    }

    # files=(None, değer) biçimi isteği multipart/form-data gönderir
    response = requests.post(API_URL, files={k: (None, v) for k, v in fields.items()}, timeout=30)

    # Non-3D'ye özgü kısım: sonuç bu yanıtta, form/callback yok
    try:
        data = response.json()
    except ValueError:
        return False, "Ödeme başarısız: " + response.text

    if str(data.get("RESPONSE_CODE")) == "2":
        # Siparişi burada COMPLETED yap — callback bekleme
        return True, "Ödeme başarılı. Referans: {}".format(data.get("REFERENCE_CODE", "-"))
    return False, "Ödeme başarısız: {}".format(data.get("RESPONSE_DATA") or response.text)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/odeme":
            return self.reply(404, "Ödeme için /odeme adresini açın.")
        try:
            ok, message = pay(client_ip(self))
            self.reply(200 if ok else 400, message)
        except requests.RequestException as exc:
            self.reply(502, "Bağlantı hatası: {}".format(exc))

    def reply(self, status, text):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print("http://localhost:8000/odeme")
    HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
