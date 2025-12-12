# Profesyonel Tarayıcı Eklentisi Şablonu (Chrome & Firefox)

Bu proje, hem Chrome (Manifest V3) hem de Firefox ile uyumlu modern bir tarayıcı eklentisi şablonudur.

## Özellikler

- **Modern UI**: Glassmorphism tasarımı ve hoş gradiyanlar.
- **Manifest V3**: Güncel Chrome standartlarına uygun.
- **Cross-Browser**: Firefox desteği için yapılandırma hazır.
- **Service Worker / Background Script**: Arka plan işlemleri için hazır yapı.

## Kurulum

### Google Chrome (ve Chromium tabanlı tarayıcılar)
1. Chrome'u açın ve `chrome://extensions` adresine gidin.
2. Sağ üstteki **Geliştirici modu**nu (Developer mode) açın.
3. **Paketlenmemiş öğe yükle** (Load unpacked) butonuna tıklayın.
4. Bu klasörü seçin (`c:\Devkit\src\product\kedyy`).
   - *Not: Varsayılan olarak `manifest.json` dosyası Chrome uyumludur.*

### Mozilla Firefox
Firefox, Manifest V3'ü desteklese de arka plan scriptleri konusunda Chrome'dan farklı bir yapı (Script vs Service Worker) kullanabilir ve genelde `manifest.json` dosyasını arar.

1. `manifest.json` dosyasının yedeğini alın veya adını `manifest.chrome.json` olarak değiştirin.
2. `manifest.firefox.json` dosyasının adını `manifest.json` olarak değiştirin.
3. Firefox'u açın ve `about:debugging#/runtime/this-firefox` adresine gidin.
4. **Geçici Eklenti Yükle** (Load Temporary Add-on) butonuna tıklayın.
5. `manifest.json` dosyasını seçin.

## Dosya Yapısı

- `src/popup/`: Eklenti arayüzü (HTML/CSS/JS).
- `src/background.js`: Arka plan işlemleri (Eventler, mesajlaşma).
- `src/content.js`: Web sayfalarında çalışan script.
- `manifest.json`: Chrome yapılandırması.
- `manifest.firefox.json`: Firefox yapılandırması.

## Geliştirme İpuçları
- İkonlar için `icons/` klasörüne `icon-16.png`, `icon-48.png`, `icon-128.png` dosyalarını eklemeyi unutmayın.
