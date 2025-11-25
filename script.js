let currentScreen = 0;
const screens = ['cactus-screen', 'appointment-question-screen', 'meeting-suggestions-screen', 'date-screen', 'thank-you-screen'];
let petalCount = 0;
const totalPetals = 3; // 3 parça: sol kol, sağ kol, üst gövde

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Kaktüs segmentlerine pozisyon ve açı hesapla
    const petals = document.querySelectorAll('.cactus-segment');
    
    petals.forEach((petal, index) => {
        const angle = parseFloat(petal.getAttribute('data-angle') || '0');
        const distance = parseFloat(petal.style.getPropertyValue('--distance').replace('px', '') || '50');
        
        // Açıyı radyana çevir
        const angleRad = (angle * Math.PI) / 180;
        
        // X ve Y pozisyonlarını hesapla
        const x = Math.cos(angleRad) * distance;
        const y = Math.sin(angleRad) * distance;
        
        // Kaktüs parçaları için rotation: kollar yatay (0°), baş dikey (0°)
        let rotation = 0;
        if (petal.classList.contains('arm-left')) {
            rotation = 0; // Sol kol yatay
        } else if (petal.classList.contains('arm-right')) {
            rotation = 0; // Sağ kol yatay
        } else if (petal.classList.contains('cactus-head')) {
            rotation = 0; // Baş dikey
        }
        
        // CSS custom properties ile pozisyonu ayarla
        petal.style.setProperty('--x', x + 'px');
        petal.style.setProperty('--y', y + 'px');
        petal.style.setProperty('--rotation', rotation + 'deg');
        
        // Her parçaya tıklama eventi ekle
        petal.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (!this.classList.contains('active')) {
                this.classList.add('active');
                petalCount++;
                updateProgress();
                
                // Tüm parçalar tamamlandıysa
                if (petalCount === totalPetals) {
                    completeRose();
                }
            }
        });
    });
    
    // Buluşma önerileri checkbox'ları
    const checkboxes = document.querySelectorAll('.suggestion-checkbox');
    const suggestionsBtn = document.getElementById('suggestions-btn');
    const customInput = document.getElementById('custom-suggestion-input');
    
    function updateSuggestionsButton() {
        // En az bir checkbox seçildiyse veya custom input doluysa butonu aktif et
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        const hasCustomText = customInput && customInput.value.trim().length > 0;
        suggestionsBtn.disabled = !(anyChecked || hasCustomText);
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSuggestionsButton();
        });
    });
    
    // Custom input için event listener
    if (customInput) {
        customInput.addEventListener('input', function() {
            updateSuggestionsButton();
        });
    }
    
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
    
    // Custom öneri varsa ekle
    const customInput = document.getElementById('custom-suggestion-input');
    if (customInput && customInput.value.trim().length > 0) {
        selectedSuggestions.push({
            value: 'custom',
            text: customInput.value.trim()
        });
    }
    
    formData.meetingSuggestions = selectedSuggestions;
    
    // Tarih seçimi sayfasına geç
    nextScreen();
}

function updateProgress() {
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `${petalCount} / ${totalPetals} parça`;
    
    if (petalCount === totalPetals) {
        progressText.textContent = 'Kaktüs tamamlandı! 🌵✨';
        progressText.style.color = '#228b22';
        progressText.style.fontSize = '1.4em';
        progressText.style.fontWeight = '700';
    }
}

function completeRose() {
    // Ana gövdeyi göster (alttan çıkacak)
    const body = document.getElementById('cactus-body');
    setTimeout(() => {
        body.classList.add('show');
    }, 300);
    
    // Saksıyı göster
    const pot = document.getElementById('cactus-pot');
    
    setTimeout(() => {
        pot.classList.add('show');
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
        
        // Son ekrana geç (önce sayfa geçişi, sonra veri kaydı)
        nextScreen();
        
        // Verileri dosyaya kaydet (asenkron, sayfa ilerlemesini engellemez)
        setTimeout(() => {
            saveFormDataToFile();
        }, 100);
        
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
    
    // Sadece Google Sheets'e gönder
    saveToGoogleSheets(dataToSave);
}

function saveToGoogleSheets(data) {
    // Eğer URL ayarlanmamışsa sadece console'a yaz
    if (!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL.includes('BURAYA')) {
        console.log('Google Sheets URL ayarlanmamış. Veriler:', data);
        console.log('Lütfen script.js dosyasındaki GOOGLE_SHEETS_WEB_APP_URL değişkenini güncelleyin.');
        return;
    }
    
    // Google Sheets'e POST isteği gönder (async, hata olsa bile devam et)
    try {
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
            // Hata olsa bile devam et - form gönderimi engellenmemeli
        });
    } catch (error) {
        console.error('Google Sheets gönderim hatası:', error);
        // Hata olsa bile devam et
    }
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

