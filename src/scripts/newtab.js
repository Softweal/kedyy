document.addEventListener('DOMContentLoaded', () => {
    updateGreeting();
    loadPreferences();

    // Listen for theme changes from popup
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            if (changes.theme) {
                applyTheme(changes.theme.newValue);
            }
            if (changes.userName) {
                updateGreeting();
            }
            if (changes.selectedCat) {
                initLottie(changes.selectedCat.newValue);
            }
            if (changes.catHue) {
                const container = document.getElementById('kedy-container');
                if (container) container.style.filter = `hue-rotate(${changes.catHue.newValue}deg)`;
            }
        }
    });
});

function loadPreferences() {
    chrome.storage.local.get(['theme', 'selectedCat', 'catHue'], (result) => {
        if (result.theme) {
            applyTheme(result.theme);
        }

        const catFile = result.selectedCat || 'kedy.json';
        const hue = result.catHue || 0;

        // Pass only filename, initLottie will handle path
        initLottie(catFile, hue);
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    const hour = new Date().getHours();
    let text = '';

    if (hour >= 6 && hour < 12) {
        text = 'Günaydın';
    } else if (hour >= 12 && hour < 18) {
        text = 'İyi Günler';
    } else if (hour >= 18 && hour < 24) {
        text = 'İyi Akşamlar';
    } else {
        text = 'İyi Geceler';
    }

    // Optionally get the user name if stored
    chrome.storage.local.get(['userName'], (result) => {
        if (result.userName) {
            text += `, ${result.userName}`;
        }
        greetingElement.textContent = text;
    });
}

function initLottie(catFile = 'kedy.json', hue = 0) {
    const container = document.getElementById('kedy-container');
    const animationUrl = chrome.runtime.getURL(`src/assets/${catFile}`);

    // Clear previous if any
    container.innerHTML = '';

    if (hue) {
        container.style.filter = `hue-rotate(${hue}deg)`;
    }

    if (window.lottie) {
        const anim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: animationUrl
        });

        // Interactive behavior: Play on hover, stop on leave
        container.addEventListener('mouseenter', () => anim.play());
        container.addEventListener('mouseleave', () => anim.stop());

        // Optional: click to say meow or something (could add audio later)
        container.addEventListener('click', () => {
            anim.goToAndPlay(0);
        });
    } else {
        console.error('Lottie library not found');
    }
}
