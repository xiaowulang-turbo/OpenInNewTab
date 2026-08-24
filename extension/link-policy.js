/**
 * Pure host / click policy shared by the content script and Node tests.
 * Classic script: Chrome content_scripts cannot use ESM. Tests load via require.
 * No DOM writes, no chrome APIs.
 */

/* global module */

/**
 * @param {string} hostname
 * @param {unknown} whitelist
 * @returns {boolean}
 */
function isHostAllowed(hostname, whitelist) {
    if (!hostname || !Array.isArray(whitelist)) {
        return false
    }
    const host = hostname.toLowerCase()
    return whitelist.some((entry) => {
        if (typeof entry !== "string" || !entry) {
            return false
        }
        const domain = entry.toLowerCase()
        return host === domain || host.endsWith("." + domain)
    })
}

/**
 * @param {string|null} href
 * @returns {boolean}
 */
function shouldSkipHref(href) {
    if (!href) {
        return true
    }
    return (
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
    )
}

/**
 * @param {Pick<MouseEvent, "ctrlKey"|"metaKey"|"shiftKey"|"button">} event
 * @param {{ hasAttribute: (name: string) => boolean, getAttribute: (name: string) => string|null }} link
 * @returns {boolean}
 */
function shouldSkipClick(event, link) {
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
    return shouldSkipHref(link.getAttribute("href"))
}

if (typeof module === "object" && module.exports) {
    module.exports = {
        isHostAllowed,
        shouldSkipHref,
        shouldSkipClick,
    }
}
