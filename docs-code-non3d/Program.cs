// Paynkolay Sanal POS V1 — NON-3D ödeme örneği (.NET minimal API)
// Kurulum: dotnet new web -n PaynkolayNon3D → bu dosyayı Program.cs ile değiştirin → dotnet run
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

// Test ucu — canlı: https://paynkolay.nkolayislem.com.tr/Vpos/v1/Payment
const string ApiUrl = "https://paynkolaytest.nkolayislem.com.tr/Vpos/v1/Payment";

app.MapGet("/odeme", async (HttpContext ctx, IHttpClientFactory httpFactory) =>
{
    // Sipariş ve kart bilgileri (gerçekte ödeme formunuzdan gelir)
    var clientRefCode = "789456|AB76";                     // her işlemde benzersiz olmalı (ör. "ORDER-" + Guid)
    var amount = "6.00";
    var successUrl = "https://siteniz.com/payment/success"; // non-3D'de çağrılmaz ama zorunludur ve hash'e girer
    var failUrl = "https://siteniz.com/payment/fail";
    var customerKey = "";                                  // kart saklanmıyorsa boş

    // rnd: Türkiye saatiyle (UTC+3) dd-MM-yyyy HH:mm:ss
    var rnd = DateTime.UtcNow.AddHours(3).ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture);

    // hashDatav2: alanlar | ile birleşir → SHA512 (ham bayt) → Base64
    var hashStr = string.Join("|", Sx, clientRefCode, amount, successUrl, failUrl, rnd, customerKey, MerchantSecretKey);
    var hashDatav2 = Convert.ToBase64String(SHA512.HashData(Encoding.UTF8.GetBytes(hashStr)));

    var fields = new Dictionary<string, string>
    {
        ["sx"] = Sx,
        ["clientRefCode"] = clientRefCode,
        ["successUrl"] = successUrl,
        ["failUrl"] = failUrl,
        ["amount"] = amount,
        ["installmentNo"] = "1",
        ["cardHolderName"] = "Tuna Çınar",
        ["month"] = "12",
        ["year"] = "2026",
        ["cvv"] = "001",
        ["cardNumber"] = "4546711234567894",
        ["use3D"] = "false",                 // ← non-3D'yi belirleyen tek satır
        ["transactionType"] = "SALES",
        ["cardHolderIP"] = GetClientIp(ctx),
        ["rnd"] = rnd,
        ["hashDatav2"] = hashDatav2,
        ["environment"] = "API",
        ["currencyNumber"] = "949",
        ["MerchantCustomerNo"] = "",         // opsiyonel: temsilci / alt üye işyeri no
    };

    // Body: multipart/form-data
    using var form = new MultipartFormDataContent();
    foreach (var (key, value) in fields)
    {
        form.Add(new StringContent(value), key);
    }

    var http = httpFactory.CreateClient();
    http.Timeout = TimeSpan.FromSeconds(30);

    string body;
    try
    {
        using var response = await http.PostAsync(ApiUrl, form);
        body = await response.Content.ReadAsStringAsync();
    }
    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
    {
        return Results.Text($"Bağlantı hatası: {ex.Message}", "text/plain; charset=utf-8", statusCode: 502);
    }

    // Non-3D'ye özgü kısım: sonuç bu yanıtta, form/callback yok
    try
    {
        using var json = JsonDocument.Parse(body);
        var root = json.RootElement;

        if (root.TryGetProperty("RESPONSE_CODE", out var code) && code.ToString() == "2")
        {
            // Siparişi burada COMPLETED yap — callback bekleme
            var reference = root.TryGetProperty("REFERENCE_CODE", out var refCode) ? refCode.ToString() : "-";
            return Results.Text($"Ödeme başarılı. Referans: {reference}", "text/plain; charset=utf-8");
        }

        var message = root.TryGetProperty("RESPONSE_DATA", out var data) ? data.ToString() : body;
        return Results.Text($"Ödeme başarısız: {message}", "text/plain; charset=utf-8", statusCode: 400);
    }
    catch (JsonException)
    {
        return Results.Text($"Ödeme başarısız: {body}", "text/plain; charset=utf-8", statusCode: 400);
    }
});

app.Run();

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
