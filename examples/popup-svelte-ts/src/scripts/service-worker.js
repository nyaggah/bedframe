chrome.runtime.onInstalled.addListener((details) => {
    console.log("[service-worker.ts] > onInstalled", details);
});
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id ?? 0, {
        type: "browser-action",
        action: "open-or-close-extension",
    }, (response) => {
        console.log("chrome.action.onClicked.addListener > response:", response);
    });
});
export {};
//# sourceMappingURL=service-worker.js.map