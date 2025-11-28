// Google Apps Script - Web App olarak dağıtılacak
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Tarih ve saat
    const now = new Date();
    const dateTime = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm:ss');
    
    // Buluşma önerilerini virgülle ayırarak birleştir
    const suggestions = data.meetingSuggestions.map(s => s.text).join(', ');
    
    // Yeni satır ekle
    sheet.appendRow([
      dateTime,
      now.toLocaleTimeString('tr-TR'),
      suggestions,
      data.selectedDate || '',
      data.formattedDate || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Veri kaydedildi'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test için GET fonksiyonu
function doGet(e) {
  return ContentService
    .createTextOutput('Google Sheets API çalışıyor!')
    .setMimeType(ContentService.MimeType.TEXT);
}




