/**
 * Content Script - Open In New Tabs Extension
 * Handles link modification and whitelist checking
 */

;(function () {
    "use strict"

    /**
     * Default whitelisted domains
     */
    const DEFAULT_DOMAINS = []

    /**
     * Get user whitelist from chrome storage
     * @returns {Promise<Array>} Array of whitelisted domains
     */
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

    /**
     * Check if current domain is in whitelist
     * @returns {Promise<boolean>} True if domain is whitelisted
     */
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

    /**
     * Force all links to open in new tabs
     */
    async function forceNewTabs() {
        try {
            const whitelisted = await isWhitelisted()
            if (!whitelisted) {
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
        } catch (error) {
            console.error("Error in forceNewTabs:", error)
        }
    }

    // Initialize when DOM is ready
    async function initialize() {
        try {
            await forceNewTabs()
        } catch (error) {
            console.error("Error initializing content script:", error)
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
