/**
 * Content script: whitelist-gated click intercept and optional target=_blank patch.
 * Click handling stays synchronous (cached prefs + sendMessage) so the
 * service worker can open the tab without a lost user-activation race.
 * Injected after link-policy.js (same isolated world).
 */

const MSG_OPEN_TAB = "OPEN_TAB"
const PATCHED_ATTR = "data-oint-patched"

const state = {
    whitelist: [],
    openInBackground: false,
    intercepting: false,
    observer: null,
    pending: [],
    scheduled: false,
}

function handleLinkClick(event) {
    const target = event.target
    if (!target || typeof target.closest !== "function") {
        return
    }
    const link = target.closest("a[href]")
    if (!link || shouldSkipClick(event, link)) {
        return
    }

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    chrome.runtime.sendMessage({
        type: MSG_OPEN_TAB,
        url: link.href,
        active: !state.openInBackground,
    }).catch((error) => {
        console.error("Error opening tab:", error)
    })
}

function patchLinkTarget(link) {
    if (
        link.target ||
        link.hasAttribute("download") ||
        link.hasAttribute(PATCHED_ATTR)
    ) {
        return
    }
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.setAttribute(PATCHED_ATTR, "1")
}

function patchLinksUnder(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) {
        return
    }
    if (root.matches?.("a[href]")) {
        patchLinkTarget(root)
    }
    root.querySelectorAll?.("a[href]").forEach(patchLinkTarget)
}

function removePatchedTargets() {
    document.querySelectorAll(`a[${PATCHED_ATTR}]`).forEach((link) => {
        link.removeAttribute("target")
        link.removeAttribute("rel")
        link.removeAttribute(PATCHED_ATTR)
    })
}

function flushPendingPatches() {
    state.scheduled = false
    const batch = state.pending
    state.pending = []
    for (const node of batch) {
        patchLinksUnder(node)
    }
}

function schedulePatchFlush() {
    if (state.scheduled) {
        return
    }
    state.scheduled = true
    if (typeof requestIdleCallback === "function") {
        requestIdleCallback(flushPendingPatches, { timeout: 200 })
    } else {
        setTimeout(flushPendingPatches, 0)
    }
}

function startObserver() {
    if (state.observer || !document.body) {
        return
    }
    state.observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => state.pending.push(node))
            } else if (
                mutation.type === "attributes" &&
                mutation.target.nodeType === Node.ELEMENT_NODE &&
                mutation.target.matches?.("a[href]")
            ) {
                state.pending.push(mutation.target)
            }
        }
        schedulePatchFlush()
    })
    state.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["href"],
    })
}

function stopObserver() {
    if (state.observer) {
        state.observer.disconnect()
        state.observer = null
    }
    state.pending = []
    state.scheduled = false
}

function startPatching() {
    const onReady = () => {
        if (!state.intercepting || state.openInBackground) {
            return
        }
        patchLinksUnder(document.body)
        startObserver()
    }
    if (document.body) {
        onReady()
    } else {
        document.addEventListener("DOMContentLoaded", onReady, { once: true })
    }
}

function teardownPatching() {
    stopObserver()
    removePatchedTargets()
}

function syncPatching() {
    if (!state.intercepting || state.openInBackground) {
        teardownPatching()
        return
    }
    startPatching()
}

function applyToPage() {
    const should = isHostAllowed(location.hostname, state.whitelist)

    if (should && !state.intercepting) {
        document.addEventListener("click", handleLinkClick, true)
        state.intercepting = true
        syncPatching()
        return
    }

    if (!should && state.intercepting) {
        document.removeEventListener("click", handleLinkClick, true)
        teardownPatching()
        state.intercepting = false
        return
    }

    if (should && state.intercepting) {
        syncPatching()
    }
}

function applyStorage(result) {
    state.whitelist = Array.isArray(result.userWhitelist)
        ? result.userWhitelist
        : []
    state.openInBackground = !!result.openInBackground
    applyToPage()
}

chrome.storage.sync
    .get(["userWhitelist", "openInBackground"])
    .then(applyStorage)
    .catch((error) => {
        console.error("Error loading intercept state:", error)
    })

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") {
        return
    }
    if (changes.userWhitelist) {
        const next = changes.userWhitelist.newValue
        state.whitelist = Array.isArray(next) ? next : []
    }
    if (changes.openInBackground) {
        state.openInBackground = !!changes.openInBackground.newValue
    }
    if (changes.userWhitelist || changes.openInBackground) {
        applyToPage()
    }
})
