// === V0 3D FLOW: PaymentInstallments → Payment (Node.js + axios + form-data) ===
// Taksit Bilgisi Paynkolay'a Ait — önce taksit sorgulanır, dönen EncodedValue ile ödeme başlatılır.
// Kurulum: npm install axios form-data
// Çalıştırma: node example.js  →  http://localhost:8000/odeme
// Not: Canlı uç localhost'tan gelen istekleri reddeder; canlıda sunucunuzdan çalıştırın.
const http = require('http');
const net = require('net');
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');

// Kimlik bilgileri (size verilen değerler)
const SX = 'SX_DEGERINIZ';
const MERCHANT_SECRET_KEY = 'SECRET_KEY_DEGERINIZ';

// Test uçları — canlıda alan adı paynkolay.nkolayislem.com.tr olur
const INSTALLMENTS_URL = 'https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/PaymentInstallments';
const PAYMENT_URL = 'https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/Payment';

// Müşteri IP'si: önce proxy başlıkları, yoksa bağlantı adresi
function clientIp(req) {
  for (const header of ['cf-connecting-ip', 'x-forwarded-for', 'x-real-ip']) {
    const value = req.headers[header];
    if (value) {
      const ip = String(value).split(',')[0].trim();
      if (net.isIP(ip)) return ip;
    }
  }
  return (req.socket.remoteAddress || '127.0.0.1').replace(/^::ffff:/, '');
}

// rnd: Türkiye saatiyle (UTC+3) dd-MM-yyyy HH:mm:ss
function turkeyTime() {
  const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}-${p(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ` +
    `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

// form-data POST (multipart/form-data) — gövdeyi metin olarak döner
async function postForm(url, fields) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);

  const response = await axios.post(url, form, {
    headers: form.getHeaders(),
    timeout: 30000,
    responseType: 'text',
    validateStatus: () => true, // HTTP durum kodundan bağımsız gövdeyi okuyalım
  });
  return response.data;
}

function parseJson(text) {
  try {
    const data = JSON.parse(text);
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

// { status, type, body } döner
async function pay(cardHolderIP) {
  const clientRefCode = '789456|AB76';                      // her işlemde benzersiz olmalı (ör. 'ORDER-' + Date.now())
  const amount = '6.00';
  const successUrl = 'https://siteniz.com/payment/callback'; // 3D sonucu buraya döner
  const failUrl = 'https://siteniz.com/payment/callback';
  const hostUrl = 'https://siteniz.com';
  const customerKey = '';                                   // kart saklanmıyorsa boş
  const cardNumber = '4546711234567894';
  const rnd = turkeyTime();

  // Hash: sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|secretKey → SHA512 (ham bayt) → Base64
  const hashStr = [SX, clientRefCode, amount, successUrl, failUrl, rnd, customerKey, MERCHANT_SECRET_KEY].join('|');
  const hashDatav2 = crypto.createHash('sha512').update(hashStr, 'utf8').digest('base64');

  // --- ADIM 1: Taksit sorgulama ---
  const instBody = await postForm(INSTALLMENTS_URL, {
    sx: SX,
    amount,
    cardNumber,
    hosturl: hostUrl,
    iscardvalid: 'false', // sadece BIN (ilk 8 hane) ile sorgu
  });

  const bankList = parseJson(instBody).PAYMENT_BANK_LIST;
  const option = Array.isArray(bankList) ? bankList[0] : undefined; // gerçek entegrasyonda kullanıcının seçtiği opsiyon

  // PAYMENT_BANK_LIST boşsa Adım 2'ye geçilmez
  if (!option || !option.EncodedValue) {
    return { status: 400, type: 'text/plain', body: `Taksit bilgisi alınamadı: ${instBody}` };
  }

  const encodedValue = option.EncodedValue;
  const installmentNo = String(option.INSTALLMENT ?? '1');

  // --- ADIM 2: 3D ödeme ---
  const payBody = await postForm(PAYMENT_URL, {
    EncodedValue: encodedValue,   // ← V0'a özgü, Adım 1'den gelir
    installmentNo,
    amount,
    sx: SX,
    clientRefCode,
    successUrl,
    failUrl,
    cardHolderName: 'Tuna Çınar',
    month: '12',
    year: '2026',
    cvv: '001',
    cardNumber,
    use3D: 'true',                // ← 3D akışı
    transactionType: 'SALES',
    hosturl: hostUrl,
    cardHolderIP,
    rnd,
    hashDatav2,
    environment: 'API',
  });

  // === 3D'ye özgü: BANK_REQUEST_MESSAGE'ı tarayıcıya bas (banka ACS'ye auto-submit olur) ===
  const bankForm = parseJson(payBody).BANK_REQUEST_MESSAGE;
  if (bankForm) {
    return { status: 200, type: 'text/html', body: bankForm };
  }

  // Sonuç successUrl/failUrl callback'inde — hash doğrulaması orada zorunlu
  return { status: 400, type: 'text/plain', body: `3D formu alınamadı: ${payBody}` };
}

http.createServer(async (req, res) => {
  const reply = (status, type, text) => {
    res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8` });
    res.end(text);
  };

  if (req.url !== '/odeme') return reply(404, 'text/plain', 'Ödeme için /odeme adresini açın.');

  try {
    const { status, type, body } = await pay(clientIp(req));
    reply(status, type, body);
  } catch (err) {
    reply(502, 'text/plain', `Bağlantı hatası: ${err.message}`);
  }
}).listen(8000, () => console.log('http://localhost:8000/odeme'));
