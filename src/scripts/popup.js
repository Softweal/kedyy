document.addEventListener('DOMContentLoaded', () => {
    console.log('kedyy popup opened');

    const container = document.getElementById('lottie-container');

    if (container && window.lottie) {
        const animationUrl = chrome.runtime.getURL('src/assets/kedy.json');
        lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animationUrl
        });
    }

    // Name handling
    const nameInput = document.getElementById('nameInput');
    const saveBtn = document.getElementById('saveBtn');

    // Color handling
    const colorRange = document.getElementById('colorRange');
    const lottieContainer = document.getElementById('lottie-container');

    // Load saved data
    chrome.storage.local.get(['userName', 'catHue'], (result) => {
        if (result.userName) {
            nameInput.value = result.userName;
        }
        if (result.catHue) {
            colorRange.value = result.catHue;
            lottieContainer.style.filter = `hue-rotate(${result.catHue}deg)`;
        }
    });

    // Save name
    saveBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        chrome.storage.local.set({ userName: name }, () => {
            saveBtn.textContent = 'Kaydedildi';
            setTimeout(() => saveBtn.textContent = 'Kaydet', 1000);
        });
    });

    // Save color live
    colorRange.addEventListener('input', (e) => {
        const hue = e.target.value;
        lottieContainer.style.filter = `hue-rotate(${hue}deg)`;
        chrome.storage.local.set({ catHue: hue });
    });
});
