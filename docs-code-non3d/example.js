// Paynkolay Sanal POS V1 — NON-3D ödeme örneği (Node.js + axios + form-data)
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

// Test ucu — canlı: https://paynkolay.nkolayislem.com.tr/Vpos/v1/Payment
const API_URL = 'https://paynkolaytest.nkolayislem.com.tr/Vpos/v1/Payment';

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

async function pay(cardHolderIP) {
  // Sipariş ve kart bilgileri (gerçekte ödeme formunuzdan gelir)
  const clientRefCode = '789456|AB76';                     // her işlemde benzersiz olmalı (ör. 'ORDER-' + Date.now())
  const amount = '6.00';
  const successUrl = 'https://siteniz.com/payment/success'; // non-3D'de çağrılmaz ama zorunludur ve hash'e girer
  const failUrl = 'https://siteniz.com/payment/fail';
  const customerKey = '';                                  // kart saklanmıyorsa boş
  const rnd = turkeyTime();

  // hashDatav2: alanlar | ile birleşir → SHA512 (ham bayt) → Base64
  const hashStr = [SX, clientRefCode, amount, successUrl, failUrl, rnd, customerKey, MERCHANT_SECRET_KEY].join('|');
  const hashDatav2 = crypto.createHash('sha512').update(hashStr, 'utf8').digest('base64');

  const fields = {
    sx: SX,
    clientRefCode,
    successUrl,
    failUrl,
    amount,
    installmentNo: '1',
    cardHolderName: 'Tuna Çınar',
    month: '12',
    year: '2026',
    cvv: '001',
    cardNumber: '4546711234567894',
    use3D: 'false',              // ← non-3D'yi belirleyen tek satır
    transactionType: 'SALES',
    cardHolderIP,
    rnd,
    hashDatav2,
    environment: 'API',
    currencyNumber: '949',
    MerchantCustomerNo: '',      // opsiyonel: temsilci / alt üye işyeri no
  };

  // Body: multipart/form-data
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);

  const response = await axios.post(API_URL, form, {
    headers: form.getHeaders(),
    timeout: 30000,
    responseType: 'text',
    validateStatus: () => true, // HTTP durum kodundan bağımsız gövdeyi okuyalım
  });
  const body = response.data;

  // Non-3D'ye özgü kısım: sonuç bu yanıtta, form/callback yok
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return { ok: false, message: `Ödeme başarısız: ${body}` };
  }

  if (String(data.RESPONSE_CODE) === '2') {
    // Siparişi burada COMPLETED yap — callback bekleme
    return { ok: true, message: `Ödeme başarılı. Referans: ${data.REFERENCE_CODE ?? '-'}` };
  }
  return { ok: false, message: `Ödeme başarısız: ${data.RESPONSE_DATA || body}` };
}

http.createServer(async (req, res) => {
  const reply = (status, text) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(text);
  };

  if (req.url !== '/odeme') return reply(404, 'Ödeme için /odeme adresini açın.');

  try {
    const { ok, message } = await pay(clientIp(req));
    reply(ok ? 200 : 400, message);
  } catch (err) {
    reply(502, `Bağlantı hatası: ${err.message}`);
  }
}).listen(8000, () => console.log('http://localhost:8000/odeme'));
