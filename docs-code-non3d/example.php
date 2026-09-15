<?php
// === NON-3D FLOW — Paynkolay V1 ===
// Çalıştırma: php -S localhost:8000 example.php  →  http://localhost:8000
// Not: Canlı uç (https://paynkolay.nkolayislem.com.tr/Vpos/v1/Payment) localhost'tan gelen istekleri reddeder.

date_default_timezone_set('Europe/Istanbul'); // rnd Türkiye saatiyle üretilmeli

$merchantSecretKey = "SECRET_KEY_DEGERINIZ";
$sx                = "SX_DEGERINIZ";
$clientRefCode     = "789456|AB76";                        // her işlemde benzersiz olmalı (ör. "ORDER-" . uniqid())
$amount            = "6.00";
$successUrl        = "https://siteniz.com/payment/success"; // non-3D'de çağrılmaz ama zorunludur ve hash'e girer
$failUrl           = "https://siteniz.com/payment/fail";
$rnd               = date("d-m-Y H:i:s");
$customerKey       = "";                                   // kart saklanmıyorsa boş

// Müşteri IP'si: önce proxy başlıkları, yoksa bağlantı adresi
function getClientIp(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP'] as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = trim(explode(',', $_SERVER[$header])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

// Hash: sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|secretKey → SHA512 (ham bayt) → Base64
$hashstr    = "$sx|$clientRefCode|$amount|$successUrl|$failUrl|$rnd|$customerKey|$merchantSecretKey";
$hashDataV2 = base64_encode(hash("sha512", $hashstr, true));

$postData = [
    'sx'                 => $sx,
    'clientRefCode'      => $clientRefCode,
    'successUrl'         => $successUrl,
    'failUrl'            => $failUrl,
    'amount'             => $amount,
    'installmentNo'      => '1',
    'cardHolderName'     => 'Tuna Çınar',
    'month'              => '12',
    'year'               => '2026',
    'cvv'                => '001',
    'cardNumber'         => '4546711234567894',
    'use3D'              => 'false',             // ← non-3D'yi belirleyen tek satır
    'transactionType'    => 'SALES',
    'cardHolderIP'       => getClientIp(),
    'hashDatav2'         => $hashDataV2,
    'rnd'                => $rnd,
    'environment'        => 'API',
    'currencyNumber'     => '949',
    'MerchantCustomerNo' => '',                  // opsiyonel: temsilci / alt üye işyeri no
];

// POSTFIELDS dizi olarak verilince istek multipart/form-data gider
$curl = curl_init('https://paynkolaytest.nkolayislem.com.tr/Vpos/v1/Payment');
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $postData,
    CURLOPT_TIMEOUT        => 30,
]);
$response = curl_exec($curl);
$error    = curl_error($curl);
curl_close($curl);

header('Content-Type: text/plain; charset=utf-8');

if ($response === false) {
    exit("Bağlantı hatası: " . $error);
}

// === Non-3D'ye özgü kısım: sonuç bu response'ta, form/callback yok ===
$data = json_decode($response, true);

if (isset($data['RESPONSE_CODE']) && $data['RESPONSE_CODE'] == '2') {
    echo "Ödeme başarılı. Referans: " . ($data['REFERENCE_CODE'] ?? '-');
    // Siparişi burada COMPLETED yap — callback bekleme
} else {
    echo "Ödeme başarısız: " . ($data['RESPONSE_DATA'] ?? $response);
}
