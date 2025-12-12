// Background script (Service Worker in Chrome MV3, Background Script in Firefox)

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed successfully.');
    // Initialize storage if needed
    chrome.storage.local.get(['clickCount'], (result) => {
        if (result.clickCount === undefined) {
            chrome.storage.local.set({ clickCount: 0 });
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ACTION_CLICKED') {
        console.log(`Action clicked! New count: ${message.count}`);

        // You can perform other background tasks here
        // e.g. updating the icon badge
        chrome.action.setBadgeText({ text: message.count.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
    }
});
