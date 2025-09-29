// ==UserScript==
// @name         Open In New Tabs
// @namespace    https://github.com/xiaowulang-turbo/OpenInNewTabs
// @version      1.0.1
// @description  Force all links to open in new tabs using whitelist mode
// @author       Xiaowu
// @match        *://*/*
// @updateUrl https://github.com/xiaowulang-turbo/OpenInNewTabs/blob/main/OpenInNewTabs.user.js
// @downloadURL https://github.com/xiaowulang-turbo/OpenInNewTabs/blob/main/OpenInNewTabs.user.js
// @grant        MIT
// @run-at       document-start
// ==/UserScript==

;(function () {
    "use strict"

    /**
     * Configuration for whitelisted domains
     * Only domains in this list will have the new tab behavior applied
     */
    const WHITELIST_DOMAINS = [
        "github.com",
        "stackoverflow.com",
        "wikipedia.org",
        "baidu.com",
        "google.com",
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "youtube.com",
    ]

    /**
     * Check if current domain is in whitelist
     * @returns {boolean} True if domain is whitelisted
     */
    function isWhitelisted() {
        const currentDomain = window.location.hostname
        return WHITELIST_DOMAINS.some(
            (domain) =>
                currentDomain === domain || currentDomain.endsWith("." + domain)
        )
    }

    /**
     * Force all links to open in new tabs
     */
    function forceNewTabs() {
        if (!isWhitelisted()) {
            return
        }

        // Handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const links = node.querySelectorAll("a[href]")
                        links.forEach((link) => {
                            if (
                                !link.target &&
                                !link.hasAttribute("download")
                            ) {
                                link.target = "_blank"
                                link.rel = "noopener noreferrer"
                            }
                        })
                    }
                })
            })
        })

        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })

        // Handle existing links immediately
        document.querySelectorAll("a[href]").forEach((link) => {
            if (!link.target && !link.hasAttribute("download")) {
                link.target = "_blank"
                link.rel = "noopener noreferrer"
            }
        })
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", forceNewTabs)
    } else {
        forceNewTabs()
    }
})()
