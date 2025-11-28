# Deployment Rehberi

## GitHub'a Push Etme

### 1. Git Repository Oluşturma

Eğer henüz git repository oluşturmadıysanız:

```bash
git init
git add .
git commit -m "Initial commit: Randevu daveti web sitesi"
```

### 2. GitHub Repository'ye Bağlama

```bash
git remote add origin https://github.com/gokhandemirci1/ilayda.git
git branch -M main
git push -u origin main
```

### 3. Sonraki Güncellemeler İçin

```bash
git add .
git commit -m "Update: Açıklama buraya"
git push
```

## Vercel Deployment

### Yöntem 1: Vercel CLI ile (Önerilen)

1. Vercel CLI'yi yükleyin:
```bash
npm i -g vercel
```

2. Vercel'e giriş yapın:
```bash
vercel login
```

3. Projeyi deploy edin:
```bash
vercel
```

4. Production'a deploy:
```bash
vercel --prod
```

### Yöntem 2: Vercel Web Arayüzü ile

1. [Vercel](https://vercel.com) adresine gidin ve giriş yapın
2. **Add New Project** butonuna tıklayın
3. GitHub repository'nizi seçin: `gokhandemirci1/ilayda`
4. **Import** butonuna tıklayın
5. Vercel otomatik olarak ayarları algılayacak:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (boş bırakın)
   - **Output Directory:** ./
6. **Deploy** butonuna tıklayın
7. Deployment tamamlandığında URL'nizi alacaksınız

### Otomatik Deployment

Vercel, GitHub repository'nize her push yaptığınızda otomatik olarak yeni bir deployment oluşturacak.

## Önemli Notlar

### Google Sheets URL

`script.js` dosyasındaki Google Sheets Web App URL'si production'da çalışacak şekilde ayarlanmış. URL zaten eklenmiş durumda.

### CORS Ayarları

Google Apps Script'te `doPost` fonksiyonu CORS sorunlarını önlemek için `mode: 'no-cors'` ile çalışıyor. Bu production'da da sorunsuz çalışacak.

### Domain Ayarları

Vercel size ücretsiz bir domain verecek (örn: `ilayda.vercel.app`). İsterseniz kendi domain'inizi de ekleyebilirsiniz:
1. Vercel Dashboard → Project Settings → Domains
2. Domain'inizi ekleyin
3. DNS ayarlarını yapın

## Sorun Giderme

### Build Hatası

Eğer Vercel'de build hatası alırsanız:
- `vercel.json` dosyasının doğru olduğundan emin olun
- Static site olduğu için build command'a gerek yok

### Google Sheets Bağlantı Sorunu

- Google Apps Script URL'sinin doğru olduğundan emin olun
- Browser console'da (F12) hata mesajlarını kontrol edin
- Google Apps Script'te "Herkes" erişimine izin verildiğinden emin olun

## Test Etme

Deployment sonrası:
1. Vercel'den aldığınız URL'yi açın
2. Formu doldurun
3. Google Sheets'inize gidin ve verilerin geldiğini kontrol edin



