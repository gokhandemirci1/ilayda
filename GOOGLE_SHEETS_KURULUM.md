# Google Sheets'e Bağlama Rehberi

## Adım 1: Google Sheets Oluşturma

1. [Google Sheets](https://sheets.google.com) adresine gidin
2. Yeni bir boş tablo oluşturun
3. İlk satıra (A1, B1, C1, D1, E1) şu başlıkları ekleyin:
   - **A1:** Tarih
   - **B1:** Saat
   - **C1:** Buluşma Önerileri
   - **D1:** Seçilen Tarih (Ham)
   - **E1:** Formatlanmış Tarih

## Adım 2: Google Apps Script Oluşturma

1. Google Sheets'te **Uzantılar** → **Apps Script** menüsüne tıklayın
2. Açılan editörde tüm kodu silin ve `google-apps-script.js` dosyasındaki kodu yapıştırın
3. **Kaydet** butonuna tıklayın (Ctrl+S veya Cmd+S)
4. Projeye bir isim verin (örn: "Randevu Daveti API")

## Adım 3: Web App Olarak Dağıtma

1. Apps Script editöründe **Dağıt** → **Yeni dağıtım** butonuna tıklayın
2. **Tür seç** bölümünden **Web uygulaması** seçin
3. Ayarları şu şekilde yapın:
   - **Açıklama:** "Randevu Daveti Form API" (isteğe bağlı)
   - **Çalıştır:** "Benim olarak" seçin
   - **Erişimi olan kullanıcılar:** "Herkes" seçin
4. **Dağıt** butonuna tıklayın
5. İlk kez dağıtıyorsanız **Yetkilendirmeleri gözden geçir** butonuna tıklayın
6. Google hesabınızı seçin
7. **Gelişmiş** → **Randevu Daveti API'ye git** linkine tıklayın
8. **İzin ver** butonuna tıklayın
9. **Dağıt** butonuna tekrar tıklayın
10. **Web uygulaması URL'si** kopyalanacak (örnek: `https://script.google.com/macros/s/ABC123.../exec`)

## Adım 4: Web Sitesine URL Ekleme

1. `script.js` dosyasını açın
2. Dosyanın başında şu satırı bulun:
   ```javascript
   const GOOGLE_SHEETS_WEB_APP_URL = 'BURAYA_GOOGLE_SHEETS_WEB_APP_URL_YAPIŞTIRIN';
   ```
3. Bu satırı kopyaladığınız URL ile değiştirin:
   ```javascript
   const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
4. Dosyayı kaydedin

## Adım 5: Test Etme

1. Web sitenizi açın
2. Formu doldurun ve gönderin
3. Google Sheets'e gidin ve yeni satırın eklendiğini kontrol edin
4. Ayrıca JSON dosyası da otomatik olarak indirilecek (yedek için)

## Sorun Giderme

### Veriler Google Sheets'e gitmiyorsa:

1. **Console'u kontrol edin:** Tarayıcıda F12 → Console sekmesine bakın
2. **URL'yi kontrol edin:** `script.js` dosyasındaki URL'nin doğru olduğundan emin olun
3. **Yetkilendirmeleri kontrol edin:** Apps Script'te tekrar yetkilendirme yapın
4. **Web App ayarlarını kontrol edin:** "Herkes" erişimine izin verildiğinden emin olun

### CORS Hatası:

- `mode: 'no-cors'` zaten eklenmiş durumda, bu sorunu çözmeli
- Eğer hala sorun varsa, Apps Script'te `doPost` fonksiyonunun doğru çalıştığından emin olun

## Güvenlik Notu

- Web App URL'si herkese açık olacak, bu yüzden sadece form verilerini kabul edecek şekilde tasarlandı
- İsterseniz Apps Script'e ekstra doğrulama ekleyebilirsiniz (örnek: belirli bir token kontrolü)



