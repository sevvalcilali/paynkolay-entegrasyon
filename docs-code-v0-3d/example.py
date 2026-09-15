# === V0 3D FLOW: PaymentInstallments → Payment (Python + requests) ===
# Taksit Bilgisi Paynkolay'a Ait — önce taksit sorgulanır, dönen EncodedValue ile ödeme başlatılır.
# Kurulum: pip install requests
# Çalıştırma: python3 example.py  →  http://localhost:8000/odeme
# Not: Canlı uç localhost'tan gelen istekleri reddeder; canlıda sunucunuzdan çalıştırın.
import base64
import hashlib
import ipaddress
import json
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer

import requests

# Kimlik bilgileri (size verilen değerler)
SX = "SX_DEGERINIZ"
MERCHANT_SECRET_KEY = "SECRET_KEY_DEGERINIZ"

# Test uçları — canlıda alan adı paynkolay.nkolayislem.com.tr olur
INSTALLMENTS_URL = "https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/PaymentInstallments"
PAYMENT_URL = "https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/Payment"


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


def post_form(url, fields):
    """form-data POST — files=(None, değer) biçimi isteği multipart/form-data gönderir."""
    response = requests.post(url, files={k: (None, v) for k, v in fields.items()}, timeout=30)
    return response.text


def parse_json(text):
    try:
        data = json.loads(text)
        return data if isinstance(data, dict) else None
    except ValueError:
        return None


def pay(card_holder_ip):
    """(HTTP durum, içerik tipi, gövde) döner."""
    client_ref_code = "789456|AB76"  # her işlemde benzersiz olmalı (ör. "ORDER-" + uuid)
    amount = "6.00"
    success_url = "https://siteniz.com/payment/callback"  # 3D sonucu buraya döner
    fail_url = "https://siteniz.com/payment/callback"
    host_url = "https://siteniz.com"
    customer_key = ""  # kart saklanmıyorsa boş
    card_number = "4546711234567894"

    # rnd: Türkiye saatiyle (UTC+3) dd-MM-yyyy HH:mm:ss
    rnd = datetime.now(timezone(timedelta(hours=3))).strftime("%d-%m-%Y %H:%M:%S")

    # Hash: sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|secretKey → SHA512 (ham bayt) → Base64
    hash_str = "|".join([SX, client_ref_code, amount, success_url, fail_url, rnd, customer_key, MERCHANT_SECRET_KEY])
    hash_datav2 = base64.b64encode(hashlib.sha512(hash_str.encode("utf-8")).digest()).decode("ascii")

    # --- ADIM 1: Taksit sorgulama ---
    inst_body = post_form(INSTALLMENTS_URL, {
        "sx": SX,
        "amount": amount,
        "cardNumber": card_number,
        "hosturl": host_url,
        "iscardvalid": "false",  # sadece BIN (ilk 8 hane) ile sorgu
    })

    inst_data = parse_json(inst_body) or {}
    bank_list = inst_data.get("PAYMENT_BANK_LIST")
    option = bank_list[0] if isinstance(bank_list, list) and bank_list else None  # gerçek entegrasyonda kullanıcının seçtiği opsiyon

    # PAYMENT_BANK_LIST boşsa Adım 2'ye geçilmez
    if not isinstance(option, dict) or not option.get("EncodedValue"):
        return 400, "text/plain", "Taksit bilgisi alınamadı: " + inst_body

    encoded_value = option["EncodedValue"]
    installment_no = str(option.get("INSTALLMENT", "1"))

    # --- ADIM 2: 3D ödeme ---
    pay_body = post_form(PAYMENT_URL, {
        "EncodedValue": encoded_value,  # ← V0'a özgü, Adım 1'den gelir
        "installmentNo": installment_no,
        "amount": amount,
        "sx": SX,
        "clientRefCode": client_ref_code,
        "successUrl": success_url,
        "failUrl": fail_url,
        "cardHolderName": "Tuna Çınar",
        "month": "12",
        "year": "2026",
        "cvv": "001",
        "cardNumber": card_number,
        "use3D": "true",  # ← 3D akışı
        "transactionType": "SALES",
        "hosturl": host_url,
        "cardHolderIP": card_holder_ip,
        "rnd": rnd,
        "hashDatav2": hash_datav2,
        "environment": "API",
    })

    # === 3D'ye özgü: BANK_REQUEST_MESSAGE'ı tarayıcıya bas (banka ACS'ye auto-submit olur) ===
    bank_form = (parse_json(pay_body) or {}).get("BANK_REQUEST_MESSAGE")
    if bank_form:
        return 200, "text/html", bank_form

    # Sonuç successUrl/failUrl callback'inde — hash doğrulaması orada zorunlu
    return 400, "text/plain", "3D formu alınamadı: " + pay_body


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/odeme":
            return self.reply(404, "text/plain", "Ödeme için /odeme adresini açın.")
        try:
            self.reply(*pay(client_ip(self)))
        except requests.RequestException as exc:
            self.reply(502, "text/plain", "Bağlantı hatası: {}".format(exc))

    def reply(self, status, content_type, text):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type + "; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print("http://localhost:8000/odeme")
    HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
