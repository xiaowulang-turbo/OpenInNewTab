/**
 * Background Script - Open In New Tabs Extension
 * Service worker for the extension
 */

const MSG_OPEN_TAB = "OPEN_TAB"

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        console.log("Open In New Tabs extension installed")

        chrome.storage.sync.get(
            ["userWhitelist", "openInBackground"],
            (result) => {
                const updates = {}
                if (!result.userWhitelist) {
                    updates.userWhitelist = []
                }
                if (result.openInBackground === undefined) {
                    updates.openInBackground = false
                }
                if (Object.keys(updates).length > 0) {
                    chrome.storage.sync.set(updates)
                }
            }
        )
    }
})

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message?.type !== MSG_OPEN_TAB || !message.url) {
        return
    }

    const createProperties = {
        url: message.url,
        active: message.active === true,
    }

    if (sender.tab?.index !== undefined) {
        createProperties.index = sender.tab.index + 1
    }

    chrome.tabs.create(createProperties)
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.userWhitelist) {
        console.log("Whitelist updated:", changes.userWhitelist.newValue)
    }
})
