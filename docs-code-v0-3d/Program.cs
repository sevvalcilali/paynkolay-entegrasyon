// === V0 3D FLOW: PaymentInstallments → Payment (.NET 8 minimal API) ===
// Taksit Bilgisi Paynkolay'a Ait — önce taksit sorgulanır, dönen EncodedValue ile ödeme başlatılır.
// Kurulum: dotnet new web -n PaynkolayV0ThreeD → bu dosyayı Program.cs ile değiştirin → dotnet run
// Test: tarayıcıda http://localhost:<port>/odeme (port konsolda yazar)
// Not: Canlı uç localhost'tan gelen istekleri reddeder; canlıda sunucunuzdan çalıştırın.
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
var app = builder.Build();

// Kimlik bilgileri (size verilen değerler)
const string Sx = "SX_DEGERINIZ";
const string MerchantSecretKey = "SECRET_KEY_DEGERINIZ";

// Test uçları — canlıda alan adı paynkolay.nkolayislem.com.tr olur
const string InstallmentsUrl = "https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/PaymentInstallments";
const string PaymentUrl = "https://paynkolaytest.nkolayislem.com.tr/Vpos/Payment/Payment";

app.MapGet("/odeme", async (HttpContext ctx, IHttpClientFactory httpFactory) =>
{
    var clientRefCode = "789456|AB76";                      // her işlemde benzersiz olmalı (ör. "ORDER-" + Guid)
    var amount = "6.00";
    var successUrl = "https://siteniz.com/payment/callback"; // 3D sonucu buraya döner
    var failUrl = "https://siteniz.com/payment/callback";
    var hostUrl = "https://siteniz.com";
    var customerKey = "";                                   // kart saklanmıyorsa boş
    var cardNumber = "4546711234567894";

    // rnd: Türkiye saatiyle (UTC+3) dd-MM-yyyy HH:mm:ss
    var rnd = DateTime.UtcNow.AddHours(3).ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture);

    // Hash: sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|secretKey → SHA512 (ham bayt) → Base64
    var hashStr = string.Join("|", Sx, clientRefCode, amount, successUrl, failUrl, rnd, customerKey, MerchantSecretKey);
    var hashDatav2 = Convert.ToBase64String(SHA512.HashData(Encoding.UTF8.GetBytes(hashStr)));

    var http = httpFactory.CreateClient();
    http.Timeout = TimeSpan.FromSeconds(30);

    try
    {
        // --- ADIM 1: Taksit sorgulama ---
        var instBody = await PostFormAsync(http, InstallmentsUrl, new()
        {
            ["sx"] = Sx,
            ["amount"] = amount,
            ["cardNumber"] = cardNumber,
            ["hosturl"] = hostUrl,
            ["iscardvalid"] = "false",   // sadece BIN (ilk 8 hane) ile sorgu
        });

        // PAYMENT_BANK_LIST boşsa Adım 2'ye geçilmez
        var option = FirstInstallmentOption(instBody); // gerçek entegrasyonda kullanıcının seçtiği opsiyon
        if (option is null)
        {
            return PlainText($"Taksit bilgisi alınamadı: {instBody}", 400);
        }
        var (encodedValue, installmentNo) = option.Value;

        // --- ADIM 2: 3D ödeme ---
        var payBody = await PostFormAsync(http, PaymentUrl, new()
        {
            ["EncodedValue"] = encodedValue,   // ← V0'a özgü, Adım 1'den gelir
            ["installmentNo"] = installmentNo,
            ["amount"] = amount,
            ["sx"] = Sx,
            ["clientRefCode"] = clientRefCode,
            ["successUrl"] = successUrl,
            ["failUrl"] = failUrl,
            ["cardHolderName"] = "Tuna Çınar",
            ["month"] = "12",
            ["year"] = "2026",
            ["cvv"] = "001",
            ["cardNumber"] = cardNumber,
            ["use3D"] = "true",                // ← 3D akışı
            ["transactionType"] = "SALES",
            ["hosturl"] = hostUrl,
            ["cardHolderIP"] = GetClientIp(ctx),
            ["rnd"] = rnd,
            ["hashDatav2"] = hashDatav2,
            ["environment"] = "API",
        });

        // === 3D'ye özgü: BANK_REQUEST_MESSAGE'ı tarayıcıya bas (banka ACS'ye auto-submit olur) ===
        var bankForm = ReadString(payBody, "BANK_REQUEST_MESSAGE");
        if (!string.IsNullOrEmpty(bankForm))
        {
            return Results.Content(bankForm, "text/html; charset=utf-8");
        }

        // Sonuç successUrl/failUrl callback'inde — hash doğrulaması orada zorunlu
        return PlainText($"3D formu alınamadı: {payBody}", 400);
    }
    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
    {
        return PlainText($"Bağlantı hatası: {ex.Message}", 502);
    }
});

app.Run();

static IResult PlainText(string message, int statusCode) =>
    Results.Text(message, "text/plain; charset=utf-8", statusCode: statusCode);

// form-data POST (multipart/form-data)
static async Task<string> PostFormAsync(HttpClient http, string url, Dictionary<string, string> fields)
{
    using var form = new MultipartFormDataContent();
    foreach (var (key, value) in fields)
    {
        form.Add(new StringContent(value), key);
    }
    using var response = await http.PostAsync(url, form);
    return await response.Content.ReadAsStringAsync();
}

// PAYMENT_BANK_LIST[0] → (EncodedValue, INSTALLMENT); liste boşsa null
static (string EncodedValue, string Installment)? FirstInstallmentOption(string body)
{
    try
    {
        using var json = JsonDocument.Parse(body);
        var root = json.RootElement;
        if (root.ValueKind != JsonValueKind.Object
            || !root.TryGetProperty("PAYMENT_BANK_LIST", out var list)
            || list.ValueKind != JsonValueKind.Array
            || list.GetArrayLength() == 0)
        {
            return null;
        }

        var first = list[0];
        if (first.ValueKind != JsonValueKind.Object || !first.TryGetProperty("EncodedValue", out var encoded))
        {
            return null;
        }

        var encodedValue = encoded.ToString();
        if (string.IsNullOrEmpty(encodedValue))
        {
            return null;
        }

        var installment = first.TryGetProperty("INSTALLMENT", out var inst) ? inst.ToString() : "1";
        return (encodedValue, installment);
    }
    catch (JsonException)
    {
        return null;
    }
}

// JSON yanıttan tek bir alanı metin olarak okur; yoksa null
static string? ReadString(string body, string property)
{
    try
    {
        using var json = JsonDocument.Parse(body);
        return json.RootElement.ValueKind == JsonValueKind.Object
            && json.RootElement.TryGetProperty(property, out var value)
            ? value.ToString()
            : null;
    }
    catch (JsonException)
    {
        return null;
    }
}

// Müşteri IP'si: önce proxy başlıkları, yoksa bağlantı adresi
static string GetClientIp(HttpContext ctx)
{
    foreach (var header in new[] { "CF-Connecting-IP", "X-Forwarded-For", "X-Real-IP" })
    {
        var value = ctx.Request.Headers[header].ToString();
        if (string.IsNullOrWhiteSpace(value)) continue;

        var ip = value.Split(',')[0].Trim();
        if (IPAddress.TryParse(ip, out _)) return ip;
    }

    var remote = ctx.Connection.RemoteIpAddress;
    if (remote is null) return "127.0.0.1";
    return (remote.IsIPv4MappedToIPv6 ? remote.MapToIPv4() : remote).ToString();
}
