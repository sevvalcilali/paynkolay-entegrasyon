<?php
// === V0 3D FLOW: PaymentInstallments → Payment ===
// Taksit Bilgisi Paynkolay'a Ait — önce taksit sorgulanır, dönen EncodedValue ile ödeme başlatılır.
// Çalıştırma: php -S localhost:8000 example.php  →  http://localhost:8000
// Not: Canlı uç localhost'tan gelen istekleri reddeder; canlıda sunucunuzdan çalıştırın.

date_default_timezone_set('Europe/Istanbul'); // rnd Türkiye saatiyle üretilmeli

$merchantSecretKey = "SECRET_KEY_DEGERINIZ";
$sx                = "SX_DEGERINIZ";
$clientRefCode     = "789456|AB76";                          // her işlemde benzersiz olmalı (ör. "ORDER-" . uniqid())
$amount            = "6.00";
$successUrl        = "https://siteniz.com/payment/callback"; // 3D sonucu buraya döner
$failUrl           = "https://siteniz.com/payment/callback";
$hostUrl           = "https://siteniz.com";
$rnd               = date("d-m-Y H:i:s");
$customerKey       = "";                                     // kart saklanmıyorsa boş
$cardNumber        = "4546711234567894";

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

// form-data POST — dizi verilince istek multipart/form-data gider
function postForm(string $url, array $fields): string
{
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $fields,
        CURLOPT_TIMEOUT        => 30,
    ]);
    $response = curl_exec($curl);
    $error    = curl_error($curl);
    curl_close($curl);

    if ($response === false) {
        header('Content-Type: text/plain; charset=utf-8');
        exit("Bağlantı hatası: " . $error);
    }
    return $response;
}

// Hash: sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|secretKey → SHA512 (ham bayt) → Base64
$hashstr    = "$sx|$clientRefCode|$amount|$successUrl|$failUrl|$rnd|$customerKey|$merchantSecretKey";
$hashDataV2 = base64_encode(hash("sha512", $hashstr, true));

// --- ADIM 1: Taksit sorgulama ---
$instResponse = postForm('https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/PaymentInstallments', [
    'sx'          => $sx,
    'amount'      => $amount,
    'cardNumber'  => $cardNumber,
    'hosturl'     => $hostUrl,
    'iscardvalid' => 'false',   // sadece BIN (ilk 8 hane) ile sorgu
]);

$instData = json_decode($instResponse, true);
$option   = $instData['PAYMENT_BANK_LIST'][0] ?? null;  // gerçek entegrasyonda kullanıcının seçtiği opsiyon

// PAYMENT_BANK_LIST boşsa Adım 2'ye geçilmez
if (!is_array($option) || empty($option['EncodedValue'])) {
    header('Content-Type: text/plain; charset=utf-8');
    exit("Taksit bilgisi alınamadı: " . $instResponse);
}

$encodedValue  = $option['EncodedValue'];
$installmentNo = (string)($option['INSTALLMENT'] ?? '1');

// --- ADIM 2: 3D ödeme ---
$payResponse = postForm('https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/Payment', [
    'EncodedValue'    => $encodedValue,      // ← V0'a özgü, Adım 1'den gelir
    'installmentNo'   => $installmentNo,
    'amount'          => $amount,
    'sx'              => $sx,
    'clientRefCode'   => $clientRefCode,
    'successUrl'      => $successUrl,
    'failUrl'         => $failUrl,
    'cardHolderName'  => 'Tuna Çınar',
    'month'           => '12',
    'year'            => '2026',
    'cvv'             => '001',
    'cardNumber'      => $cardNumber,
    'use3D'           => 'true',             // ← 3D akışı
    'transactionType' => 'SALES',
    'hosturl'         => $hostUrl,
    'cardHolderIP'    => getClientIp(),
    'rnd'             => $rnd,
    'hashDatav2'      => $hashDataV2,
    'environment'     => 'API',
]);

$payData = json_decode($payResponse, true);

// === 3D'ye özgü: BANK_REQUEST_MESSAGE'ı tarayıcıya bas ===
if (!empty($payData['BANK_REQUEST_MESSAGE'])) {
    header('Content-Type: text/html; charset=utf-8');
    echo $payData['BANK_REQUEST_MESSAGE'];   // banka ACS'ye auto-submit olur
    exit;
}

header('Content-Type: text/plain; charset=utf-8');
echo "3D formu alınamadı: " . $payResponse;
// Sonuç successUrl/failUrl callback'inde — hash doğrulaması orada zorunlu
