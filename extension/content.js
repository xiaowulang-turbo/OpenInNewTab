/**
 * Content Script - Open In New Tabs Extension
 * Handles link modification and whitelist checking
 */

;(function () {
    "use strict"

    const MSG_OPEN_TAB = "OPEN_TAB"
    const PATCHED_ATTR = "data-oint-patched"
    const DEFAULT_DOMAINS = []

    let targetBlankObserver = null

    async function getUserWhitelist() {
        try {
            const result = await chrome.storage.sync.get(["userWhitelist"])
            const stored = result.userWhitelist
            return Array.isArray(stored) ? stored : DEFAULT_DOMAINS
        } catch (error) {
            console.error("Error getting whitelist:", error)
            return DEFAULT_DOMAINS
        }
    }

    async function getOpenInBackground() {
        try {
            const result = await chrome.storage.sync.get(["openInBackground"])
            return !!result.openInBackground
        } catch (error) {
            console.error("Error getting openInBackground:", error)
            return false
        }
    }

    async function isWhitelisted() {
        try {
            const currentDomain = window.location.hostname
            const userWhitelist = await getUserWhitelist()
            return userWhitelist.some(
                (domain) =>
                    currentDomain === domain ||
                    currentDomain.endsWith("." + domain)
            )
        } catch (error) {
            console.error("Error checking whitelist:", error)
            return false
        }
    }

    function shouldSkipLinkClick(event, link) {
        if (link.hasAttribute("download")) {
            return true
        }

        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.button === 1
        ) {
            return true
        }

        const href = link.getAttribute("href")
        if (
            !href ||
            href.startsWith("javascript:") ||
            href.startsWith("mailto:")
        ) {
            return true
        }

        if (href.startsWith("#")) {
            return true
        }

        return false
    }

    function patchLinkTarget(link) {
        if (link.target || link.hasAttribute("download") || link.hasAttribute(PATCHED_ATTR)) {
            return
        }
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        link.setAttribute(PATCHED_ATTR, "1")
    }

    function patchLinksUnder(root) {
        if (root.nodeType === Node.ELEMENT_NODE) {
            if (root.matches?.("a[href]")) {
                patchLinkTarget(root)
            }
            root.querySelectorAll?.("a[href]").forEach(patchLinkTarget)
        }
    }

    function removePatchedTargets() {
        document.querySelectorAll(`a[${PATCHED_ATTR}]`).forEach((link) => {
            link.removeAttribute("target")
            link.removeAttribute("rel")
            link.removeAttribute(PATCHED_ATTR)
        })
    }

    function enableTargetBlankPatching() {
        if (!document.body) {
            return
        }

        patchLinksUnder(document.body)

        if (targetBlankObserver) {
            return
        }

        targetBlankObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    patchLinksUnder(node)
                })
            })
        })

        targetBlankObserver.observe(document.body, {
            childList: true,
            subtree: true,
        })
    }

    function disableTargetBlankPatching() {
        if (targetBlankObserver) {
            targetBlankObserver.disconnect()
            targetBlankObserver = null
        }
        removePatchedTargets()
    }

    async function syncTargetBlankPatching() {
        if (await getOpenInBackground()) {
            disableTargetBlankPatching()
        } else {
            enableTargetBlankPatching()
        }
    }

    async function openLinkInNewTab(url, inBackground) {
        if (inBackground) {
            try {
                await chrome.runtime.sendMessage({
                    type: MSG_OPEN_TAB,
                    url,
                    active: false,
                })
                return
            } catch (error) {
                console.error("Error opening tab in background:", error)
            }
        }

        window.open(url, "_blank", "noopener,noreferrer")
    }

    async function handleLinkClick(event) {
        const link = event.target.closest("a[href]")
        if (!link || shouldSkipLinkClick(event, link)) {
            return
        }

        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        await openLinkInNewTab(link.href, await getOpenInBackground())
    }

    async function activateOnWhitelistedSite() {
        document.addEventListener("click", handleLinkClick, true)
        await syncTargetBlankPatching()
    }

    async function initialize() {
        try {
            if (!(await isWhitelisted())) {
                return
            }
            await activateOnWhitelistedSite()
        } catch (error) {
            console.error("Error initializing content script:", error)
        }
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "sync" || !changes.openInBackground) {
            return
        }
        isWhitelisted().then((whitelisted) => {
            if (whitelisted) {
                syncTargetBlankPatching()
            }
        })
    })

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
