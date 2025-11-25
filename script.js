let currentScreen = 0;
const screens = ['rose-screen', 'appointment-question-screen', 'meeting-suggestions-screen', 'date-screen', 'thank-you-screen'];
let petalCount = 0;
const totalPetals = 10;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Gül yapraklarına pozisyon ve açı hesapla
    const petals = document.querySelectorAll('.petal');
    
    petals.forEach((petal, index) => {
        const angle = parseFloat(petal.getAttribute('data-angle') || '0');
        const distance = parseFloat(petal.style.getPropertyValue('--distance').replace('px', '') || '50');
        
        // Açıyı radyana çevir
        const angleRad = (angle * Math.PI) / 180;
        
        // X ve Y pozisyonlarını hesapla
        const x = Math.cos(angleRad) * distance;
        const y = Math.sin(angleRad) * distance;
        const rotation = angle + 45;
        
        // CSS custom properties ile pozisyonu ayarla
        petal.style.setProperty('--x', x + 'px');
        petal.style.setProperty('--y', y + 'px');
        petal.style.setProperty('--rotation', rotation + 'deg');
        
        // Her yaprağa tıklama eventi ekle
        petal.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (!this.classList.contains('active')) {
                this.classList.add('active');
                petalCount++;
                updateProgress();
                
                // Tüm yapraklar tamamlandıysa
                if (petalCount === totalPetals) {
                    completeRose();
                }
            }
        });
    });
    
    // Buluşma önerileri checkbox'ları
    const checkboxes = document.querySelectorAll('.suggestion-checkbox');
    const suggestionsBtn = document.getElementById('suggestions-btn');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // En az bir seçim yapıldıysa butonu aktif et
            const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
            suggestionsBtn.disabled = !anyChecked;
        });
    });
    
    // Tarih seçici ayarları
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
        
        // Tarih değiştiğinde
        dateInput.addEventListener('change', function() {
            const selectedDate = this.value;
            const confirmBtn = document.getElementById('confirm-btn');
            const dateDisplay = document.getElementById('selected-date-display');
            
            if (selectedDate) {
                const date = new Date(selectedDate);
                const options = { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                };
                const formattedDate = date.toLocaleDateString('tr-TR', options);
                
                dateDisplay.textContent = `Seçilen Tarih: ${formattedDate}`;
                dateDisplay.classList.add('show');
                confirmBtn.disabled = false;
            } else {
                dateDisplay.classList.remove('show');
                confirmBtn.disabled = true;
            }
        });
    }
});

// Form verilerini saklamak için global değişken
let formData = {
    meetingSuggestions: [],
    selectedDate: null,
    formattedDate: null,
    timestamp: null
};

function continueToDate() {
    // Seçilen önerileri kaydet
    const selectedSuggestions = Array.from(document.querySelectorAll('.suggestion-checkbox:checked'))
        .map(cb => {
            const text = cb.closest('.suggestion-item').querySelector('.suggestion-text').textContent.trim();
            return {
                value: cb.value,
                text: text
            };
        });
    
    formData.meetingSuggestions = selectedSuggestions;
    
    // Tarih seçimi sayfasına geç
    nextScreen();
}

function updateProgress() {
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `${petalCount} / ${totalPetals} yaprak`;
    
    if (petalCount === totalPetals) {
        progressText.textContent = 'Gül tamamlandı! 🌹✨';
        progressText.style.color = '#d63384';
        progressText.style.fontSize = '1.4em';
        progressText.style.fontWeight = '700';
    }
}

function completeRose() {
    // Gül merkezini göster
    const core = document.getElementById('rose-core');
    setTimeout(() => {
        core.classList.add('show');
    }, 300);
    
    // Sap ve yaprakları göster
    const stem = document.getElementById('rose-stem');
    const leafLeft = document.getElementById('leaf-left');
    const leafRight = document.getElementById('leaf-right');
    
    setTimeout(() => {
        stem.classList.add('show');
        leafLeft.classList.add('show');
        leafRight.classList.add('show');
    }, 800);
    
    // 2.5 saniye sonra randevu sorusuna geç
    setTimeout(() => {
        nextScreen();
    }, 2800);
}

function answerYes() {
    nextScreen();
}

function answerNo() {
    // "Hayır" butonuna tıklandığında üzgün mesaj göster
    const messageBox = document.querySelector('#appointment-question-screen .message-box');
    messageBox.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 20px;">😢</div>
        <h2>Üzgünüm...</h2>
        <p>Belki başka bir zaman?</p>
    `;
    
    // 3 saniye sonra tekrar sor
    setTimeout(() => {
        location.reload();
    }, 3000);
}

let noButtonMoved = false;

function moveNoButton() {
    const noButton = document.querySelector('.btn-no');
    if (!noButton) return;
    
    // Her seferinde farklı bir yere kaç
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    noButton.style.transform = `translate(${randomX}px, ${randomY}px)`;
    noButton.style.transition = 'transform 0.4s ease';
    
    // 1 saniye sonra geri getir
    setTimeout(() => {
        noButton.style.transform = 'translate(0, 0)';
    }, 1000);
}

function answerNo() {
    // "Hayır" butonu çalışmıyor - sadece kaçıyor! 😊
    moveNoButton();
    // Hiçbir şey yapmıyor, sadece buton kaçıyor
}

function nextScreen() {
    const current = document.getElementById(screens[currentScreen]);
    current.classList.remove('active');
    
    currentScreen++;
    
    if (currentScreen < screens.length) {
        setTimeout(() => {
            const next = document.getElementById(screens[currentScreen]);
            next.classList.add('active');
        }, 300);
    }
}

function confirmDate() {
    const selectedDate = document.getElementById('appointment-date').value;
    
    if (selectedDate) {
        const date = new Date(selectedDate);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        const formattedDate = date.toLocaleDateString('tr-TR', options);
        
        // Form verilerini tamamla
        formData.selectedDate = selectedDate;
        formData.formattedDate = formattedDate;
        formData.timestamp = new Date().toISOString();
        
        // Verileri dosyaya kaydet
        saveFormDataToFile();
        
        // Son ekrana geç
        nextScreen();
        
        // Final mesajını güncelle
        setTimeout(() => {
            const finalTitle = document.getElementById('final-title');
            const finalMessage = document.getElementById('final-message');
            finalTitle.textContent = `Tamam ${formattedDate} akşamında size yazacağım`;
            finalMessage.textContent = '';
        }, 500);
        
        // Konsola da yazdır
        console.log('Form Verileri:', formData);
    }
}

// Google Sheets Web App URL'inizi buraya yapıştırın
// Örnek: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyebz3UEZ0ZC3xU4juHp0TOBV9RgMNZUQ53TYa-XrCe0AMBLFbGtAVxsNS_YrvjZz3POA/exec';

function saveFormDataToFile() {
    // JSON formatında veriyi hazırla
    const dataToSave = {
        ...formData,
        exportDate: new Date().toLocaleString('tr-TR')
    };
    
    // Hem Google Sheets'e gönder hem de dosya olarak indir
    saveToGoogleSheets(dataToSave);
    saveAsJSONFile(dataToSave);
}

function saveToGoogleSheets(data) {
    // Eğer URL ayarlanmamışsa sadece console'a yaz
    if (!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL.includes('BURAYA')) {
        console.log('Google Sheets URL ayarlanmamış. Veriler:', data);
        console.log('Lütfen script.js dosyasındaki GOOGLE_SHEETS_WEB_APP_URL değişkenini güncelleyin.');
        return;
    }
    
    // Google Sheets'e POST isteği gönder
    fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // CORS sorununu önlemek için
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('Veriler Google Sheets\'e gönderildi!');
    })
    .catch(error => {
        console.error('Google Sheets\'e gönderim hatası:', error);
        // Hata olsa bile devam et
    });
}

function saveAsJSONFile(data) {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Blob oluştur
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Dosya adı oluştur (tarih ile)
    const fileName = `randevu_daveti_${new Date().toISOString().split('T')[0]}.json`;
    
    // Dosyayı indir
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Form verileri dosyaya kaydedildi:', fileName);
}

// Klavye ile gezinme (Enter tuşu)
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && currentScreen < screens.length - 1) {
        const activeScreen = document.getElementById(screens[currentScreen]);
        const btn = activeScreen.querySelector('.btn-primary');
        if (btn && !btn.disabled) {
            btn.click();
        }
    }
});

