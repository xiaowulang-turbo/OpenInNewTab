/**
 * Background Script - Open In New Tabs Extension
 * Service worker for the extension
 */

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        // Extension installed for the first time
        console.log("Open In New Tabs extension installed")

        // Set default whitelist if not exists
        chrome.storage.sync.get(["userWhitelist"], (result) => {
            if (!result.userWhitelist) {
                chrome.storage.sync.set({
                    userWhitelist: [],
                })
            }
        })
    }
})

// Handle extension icon click (popup will be shown automatically)
chrome.action.onClicked.addListener((tab) => {
    // Popup will be shown automatically due to "default_popup" in manifest
    console.log("Extension icon clicked on tab:", tab.title)
})

// Listen for storage changes to sync across tabs
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.userWhitelist) {
        console.log("Whitelist updated:", changes.userWhitelist.newValue)
        // Could add additional logic here if needed
    }
})
