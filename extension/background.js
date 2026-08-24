/**
 * Background Script - Open In New Tabs Extension
 * Service worker: lifecycle handling, update notices, tab creation.
 */

globalThis.importScripts("update-notices.js")

const MSG_OPEN_TAB = "OPEN_TAB"
const UPDATE_NOTICE_ENABLED = "updateNoticeEnabled"
const updateNotices = globalThis.OpenInNewTabUpdateNotices

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.storage.sync.get(
            ["userWhitelist", "openInBackground", UPDATE_NOTICE_ENABLED],
            (result) => {
                const updates = {}
                if (!result.userWhitelist) {
                    updates.userWhitelist = []
                }
                if (result.openInBackground === undefined) {
                    updates.openInBackground = false
                }
                if (result[UPDATE_NOTICE_ENABLED] === undefined) {
                    updates[UPDATE_NOTICE_ENABLED] = true
                }
                if (Object.keys(updates).length > 0) {
                    chrome.storage.sync.set(updates)
                }
            }
        )

        chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") })
        return
    }

    if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        openUpdateNotice(details)
    }
})

async function openUpdateNotice(details) {
    const version = chrome.runtime.getManifest().version
    const notice = updateNotices.getUpdateNotice(version)

    if (!notice?.showUpdateNotice) {
        return
    }

    try {
        const result = await chrome.storage.sync.get([UPDATE_NOTICE_ENABLED])
        if (
            !updateNotices.shouldShowUpdateNotice(
                notice,
                result[UPDATE_NOTICE_ENABLED] !== false
            )
        ) {
            return
        }

        const pageUrl = new URL(chrome.runtime.getURL("welcome.html"))
        pageUrl.searchParams.set("mode", "update")
        pageUrl.searchParams.set("version", version)
        if (details.previousVersion) {
            pageUrl.searchParams.set("from", details.previousVersion)
        }
        await chrome.tabs.create({ url: pageUrl.toString() })
    } catch (error) {
        console.error("Error opening update notice:", error)
    }
}

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
