// Kaktüs tamamlama oyunu
let completedParts = 0;
const totalParts = 3; // 2 kol + 1 gövde

document.addEventListener('DOMContentLoaded', function() {
    // Kaktüs kollarına tıklama olayları
    const leftArm = document.querySelector('.cactus-arm.left-arm');
    const rightArm = document.querySelector('.cactus-arm.right-arm');
    
    leftArm.addEventListener('click', function() {
        if (!this.classList.contains('completed')) {
            this.classList.add('completed');
            completedParts++;
            updateProgress();
            checkCactusComplete();
        }
    });
    
    rightArm.addEventListener('click', function() {
        if (!this.classList.contains('completed')) {
            this.classList.add('completed');
            completedParts++;
            updateProgress();
            checkCactusComplete();
        }
    });
    
    // Hayır butonu - çalışmıyor
    const noBtn = document.getElementById('noBtn');
    noBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Buton çalışmıyor, hiçbir şey yapmıyor
    });
    
    // Buluşma önerileri form kontrolü
    const checkboxes = document.querySelectorAll('input[name="suggestion"]');
    const customSuggestion = document.getElementById('customSuggestion');
    const continueBtn = document.getElementById('continueBtn');
    
    function checkForm() {
        const hasChecked = Array.from(checkboxes).some(cb => cb.checked);
        const hasCustomText = customSuggestion.value.trim().length > 0;
        continueBtn.disabled = !(hasChecked || hasCustomText);
    }
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', checkForm);
    });
    
    customSuggestion.addEventListener('input', checkForm);
    
    // Tarih seçici için minimum tarih (bugünden itibaren)
    const datePicker = document.getElementById('datePicker');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    datePicker.min = tomorrow.toISOString().split('T')[0];
});

function updateProgress() {
    document.getElementById('progress').textContent = `${completedParts}/${totalParts}`;
}

function checkCactusComplete() {
    if (completedParts === 2) {
        // Kollar tamamlandı, gövdeyi göster
        const body = document.querySelector('.cactus-body');
        body.classList.add('show');
        completedParts++;
        updateProgress();
        
        // 1 saniye sonra bir sonraki ekrana geç
        setTimeout(() => {
            nextScreen();
        }, 1500);
    }
}

function nextScreen() {
    const screens = document.querySelectorAll('.screen');
    let currentIndex = -1;
    
    screens.forEach((screen, index) => {
        if (screen.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    if (currentIndex < screens.length - 1) {
        screens[currentIndex].classList.remove('active');
        screens[currentIndex + 1].classList.add('active');
    }
}

function submitForm() {
    const datePicker = document.getElementById('datePicker');
    const selectedDate = datePicker.value;
    
    if (!selectedDate) {
        alert('Lütfen bir tarih seçin');
        return;
    }
    
    // Tarihi formatla
    const date = new Date(selectedDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day} ${getMonthName(month)} ${year}`;
    
    // Teşekkür mesajını güncelle
    document.getElementById('selectedDateText').textContent = formattedDate;
    
    // Form verilerini topla
    const checkboxes = document.querySelectorAll('input[name="suggestion"]:checked');
    const customSuggestion = document.getElementById('customSuggestion').value;
    
    const meetingSuggestions = Array.from(checkboxes).map(cb => ({
        text: cb.value
    }));
    
    if (customSuggestion.trim()) {
        meetingSuggestions.push({
            text: customSuggestion.trim()
        });
    }
    
    const formData = {
        selectedDate: selectedDate,
        formattedDate: formattedDate,
        meetingSuggestions: meetingSuggestions
    };
    
    // Önce ekranı değiştir
    nextScreen();
    
    // Sonra Google Sheets'e kaydet (asenkron)
    setTimeout(() => {
        saveToGoogleSheets(formData);
    }, 500);
}

function getMonthName(month) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[month - 1];
}

function saveToGoogleSheets(data) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyebz3UEZ0ZC3xU4juHp0TOBV9RgMNZUQ53TYa-XrCe0AMBLFbGtAVxsNS_YrvjZz3POA/exec';
    
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(error => {
        console.error('Google Sheets kayıt hatası:', error);
        // Hata olsa bile sayfa ilerlemesi devam ediyor
    });
}
