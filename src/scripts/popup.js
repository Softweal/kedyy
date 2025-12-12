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
});
