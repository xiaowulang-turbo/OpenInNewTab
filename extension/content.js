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
     * Handle link click in capture phase to intercept framework routing
     * @param {MouseEvent} event Click event
     */
    function handleLinkClick(event) {
        // Find closest anchor element
        const link = event.target.closest("a[href]")
        if (!link) return

        // Skip download links
        if (link.hasAttribute("download")) return

        // Skip if user is holding modifier keys (Ctrl/Cmd/Shift) or middle click
        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.button === 1
        )
            return

        // Skip javascript: and mailto: links
        const href = link.getAttribute("href")
        if (
            !href ||
            href.startsWith("javascript:") ||
            href.startsWith("mailto:")
        )
            return

        // Skip anchor links (same page)
        if (href.startsWith("#")) return

        // Intercept and force open in new tab
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        // Open in new tab
        window.open(link.href, "_blank", "noopener,noreferrer")
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

            // Add click listener in capture phase to intercept before frameworks
            document.addEventListener("click", handleLinkClick, true)

            // Wait for body to exist before setting up observer
            if (!document.body) {
                return
            }

            // Backup strategy: Set target attribute for links
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
