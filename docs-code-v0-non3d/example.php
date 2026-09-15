<?php
// === V0 NON-3D FLOW: PaymentInstallments → Payment ===
// Taksit Bilgisi Paynkolay'a Ait — önce taksit sorgulanır, dönen EncodedValue ile ödeme yapılır.
// Çalıştırma: php -S localhost:8000 example.php  →  http://localhost:8000
// Not: Canlı uç localhost'tan gelen istekleri reddeder; canlıda sunucunuzdan çalıştırın.

date_default_timezone_set('Europe/Istanbul'); // rnd Türkiye saatiyle üretilmeli

$merchantSecretKey = "SECRET_KEY_DEGERINIZ";
$sx                = "SX_DEGERINIZ";
$clientRefCode     = "789456|AB76";                         // her işlemde benzersiz olmalı (ör. "ORDER-" . uniqid())
$amount            = "6.00";
$successUrl        = "https://siteniz.com/payment/success"; // non-3D'de çağrılmaz ama zorunludur ve hash'e girer
$failUrl           = "https://siteniz.com/payment/fail";
$hostUrl           = "https://siteniz.com";
$rnd               = date("d-m-Y H:i:s");
$customerKey       = "";                                    // kart saklanmıyorsa boş
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

header('Content-Type: text/plain; charset=utf-8');

// --- ADIM 1: Taksit sorgulama (3D ile aynı) ---
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
    exit("Taksit bilgisi alınamadı: " . $instResponse);
}

$encodedValue  = $option['EncodedValue'];
$installmentNo = (string)($option['INSTALLMENT'] ?? '1');

// --- ADIM 2: Non-3D ödeme ---
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
    'use3D'           => 'false',            // ← non-3D'yi belirleyen tek satır
    'transactionType' => 'SALES',
    'cardHolderIP'    => getClientIp(),
    'rnd'             => $rnd,
    'hashDatav2'      => $hashDataV2,
    'environment'     => 'API',
]);

// === Non-3D'ye özgü: sonuç bu yanıtta, form/callback yok ===
$payData = json_decode($payResponse, true);

// Başarı = RESPONSE_CODE 2 VE AUTH_CODE gerçek bir değer (boş, 0 ya da 00 değil)
$authCode = (string)($payData['AUTH_CODE'] ?? '');

if (isset($payData['RESPONSE_CODE']) && $payData['RESPONSE_CODE'] == '2' && !in_array($authCode, ['', '0', '00'], true)) {
    echo "Ödeme başarılı. Referans: " . ($payData['REFERENCE_CODE'] ?? '-');
    // Siparişi burada COMPLETED yap — callback bekleme
} else {
    echo "Ödeme başarısız: " . ($payData['RESPONSE_DATA'] ?? $payResponse);
}
