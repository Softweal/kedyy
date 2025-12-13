document.addEventListener('DOMContentLoaded', () => {
    console.log('kedyy popup opened');

    const container = document.getElementById('lottie-container');



    // Name handling
    const nameInput = document.getElementById('nameInput');
    const saveBtn = document.getElementById('saveBtn');

    // Color handling
    const colorRange = document.getElementById('colorRange');
    const lottieContainer = document.getElementById('lottie-container');

    // Theme handling
    const themeSelect = document.getElementById('themeSelect');

    // Cat handling
    const catSelect = document.getElementById('catSelect');

    // Load saved data
    chrome.storage.local.get(['userName', 'catHue', 'theme', 'selectedCat'], (result) => {
        if (result.userName) {
            nameInput.value = result.userName;
        } else {
            nameInput.value = 'hayat';
        }
        if (result.catHue) {
            colorRange.value = result.catHue;
            lottieContainer.style.filter = `hue-rotate(${result.catHue}deg)`;
        }
        if (result.theme) {
            themeSelect.value = result.theme;
        }

        let initialCat = 'kedy.json';
        if (result.selectedCat) {
            catSelect.value = result.selectedCat;
            initialCat = result.selectedCat;
        }

        loadAnimation(initialCat);
    });

    function loadAnimation(catFile) {
        if (!container || !window.lottie) return;

        // Clear previous animation content
        container.innerHTML = '';

        const animationUrl = chrome.runtime.getURL(`src/assets/${catFile}`);
        lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animationUrl
        });
    }

    // Save name
    saveBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        chrome.storage.local.set({ userName: name }, () => {
            saveBtn.textContent = 'Kaydedildi';
            setTimeout(() => saveBtn.textContent = 'Kaydet', 1000);
        });
    });

    // Save theme
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        chrome.storage.local.set({ theme: theme });
    });

    // Save cat
    catSelect.addEventListener('change', (e) => {
        const catFile = e.target.value;
        chrome.storage.local.set({ selectedCat: catFile });
        loadAnimation(catFile);
    });

    // Save color live
    colorRange.addEventListener('input', (e) => {
        const hue = e.target.value;
        lottieContainer.style.filter = `hue-rotate(${hue}deg)`;
        chrome.storage.local.set({ catHue: hue });
    });
});
