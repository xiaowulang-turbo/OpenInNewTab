// ==UserScript==
// @name         Open In New Tabs
// @namespace    https://github.com/xiaowulang-turbo/OpenInNewTabs
// @version      1.1.1
// @description  Force all links to open in new tabs using whitelist mode
// @author       Xiaowu
// @match        *://*/*
// @updateUrl    https://github.com/xiaowulang-turbo/OpenInNewTabs/blob/main/OpenInNewTabs.user.js
// @downloadURL  https://github.com/xiaowulang-turbo/OpenInNewTabs/blob/main/OpenInNewTabs.user.js
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

;(function () {
    "use strict"

    /**
     * Default whitelisted domains
     * These are the initial domains that will be included
     */
    const DEFAULT_DOMAINS = []

    /**
     * Get user whitelist from storage
     * @returns {Array} Array of whitelisted domains
     */
    function getUserWhitelist() {
        const stored = GM_getValue("userWhitelist", [])
        return Array.isArray(stored) ? stored : DEFAULT_DOMAINS
    }

    /**
     * Save user whitelist to storage
     * @param {Array} domains Array of domains to save
     */
    function saveUserWhitelist(domains) {
        GM_setValue("userWhitelist", domains)
    }

    /**
     * Check if current domain is in whitelist
     * @returns {boolean} True if domain is whitelisted
     */
    function isWhitelisted() {
        const currentDomain = window.location.hostname
        const userWhitelist = getUserWhitelist()
        return userWhitelist.some(
            (domain) =>
                currentDomain === domain || currentDomain.endsWith("." + domain)
        )
    }

    /**
     * Add current domain to whitelist
     */
    function addCurrentDomainToWhitelist() {
        const currentDomain = window.location.hostname
        const userWhitelist = getUserWhitelist()

        if (!userWhitelist.includes(currentDomain)) {
            userWhitelist.push(currentDomain)
            saveUserWhitelist(userWhitelist)
            alert(`${currentDomain} 已添加到白名单！`)
        } else {
            alert(`${currentDomain} 已在白名单中`)
        }
    }

    /**
     * Create whitelist management modal
     */
    function createWhitelistModal() {
        const modal = document.createElement("div")
        modal.className = "openinnewtabs-modal"
        modal.innerHTML = `
            <div class="openinnewtabs-modal-content">
                <div class="openinnewtabs-modal-header">
                    <h3>白名单管理</h3>
                    <button class="openinnewtabs-close">&times;</button>
                </div>
                <div class="openinnewtabs-modal-body">
                    <div class="openinnewtabs-input-group">
                        <input type="text" id="openinnewtabs-new-domain" placeholder="输入域名，如：example.com">
                        <button id="openinnewtabs-add-domain">添加</button>
                    </div>
                    <div class="openinnewtabs-domains-list" id="openinnewtabs-domains-list">
                        <!-- Domains will be added here -->
                    </div>
                </div>
            </div>
        `
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `

        const modalContent = modal.querySelector(".openinnewtabs-modal-content")
        modalContent.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `

        const header = modal.querySelector(".openinnewtabs-modal-header")
        header.style.cssText = `
            padding: 20px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            border-radius: 8px 8px 0 0;
        `

        const closeBtn = modal.querySelector(".openinnewtabs-close")
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        `

        const body = modal.querySelector(".openinnewtabs-modal-body")
        body.style.cssText = `
            padding: 20px;
        `

        const inputGroup = modal.querySelector(".openinnewtabs-input-group")
        inputGroup.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        `

        const input = modal.querySelector("#openinnewtabs-new-domain")
        input.style.cssText = `
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        `

        const addBtn = modal.querySelector("#openinnewtabs-add-domain")
        addBtn.style.cssText = `
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `

        document.body.appendChild(modal)

        // Event listeners
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none"
        })

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none"
            }
        })

        addBtn.addEventListener("click", () => {
            const input = modal.querySelector("#openinnewtabs-new-domain")
            const domain = input.value.trim()
            if (domain) {
                addDomainToWhitelist(domain)
                input.value = ""
                updateWhitelistDisplay()
            }
        })

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addBtn.click()
            }
        })

        return modal
    }

    /**
     * Add domain to whitelist
     * @param {string} domain Domain to add
     */
    function addDomainToWhitelist(domain) {
        const userWhitelist = getUserWhitelist()
        if (!userWhitelist.includes(domain)) {
            userWhitelist.push(domain)
            saveUserWhitelist(userWhitelist)
            alert(`${domain} 已添加到白名单！`)
        } else {
            alert(`${domain} 已在白名单中`)
        }
    }

    /**
     * Remove domain from whitelist
     * @param {string} domain Domain to remove
     */
    function removeDomainFromWhitelist(domain) {
        const userWhitelist = getUserWhitelist()
        const index = userWhitelist.indexOf(domain)
        if (index > -1) {
            userWhitelist.splice(index, 1)
            saveUserWhitelist(userWhitelist)
            alert(`${domain} 已从白名单移除`)
            updateWhitelistDisplay()
        }
    }

    /**
     * Update whitelist display in modal
     */
    function updateWhitelistDisplay() {
        const modal = document.querySelector(".openinnewtabs-modal")
        if (!modal) return

        const domainsList = modal.querySelector("#openinnewtabs-domains-list")
        const userWhitelist = getUserWhitelist()

        domainsList.innerHTML = userWhitelist
            .map(
                (domain) => `
            <div class="openinnewtabs-domain-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border: 1px solid #eee;
                margin-bottom: 5px;
                border-radius: 4px;
                background: #f9f9f9;
            ">
                <span>${domain}</span>
                <button class="openinnewtabs-remove-domain" data-domain="${domain}" style="
                    background: #f44336;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-size: 12px;
                ">移除</button>
            </div>
        `
            )
            .join("")

        // Add event listeners for remove buttons
        domainsList
            .querySelectorAll(".openinnewtabs-remove-domain")
            .forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const domain = e.target.getAttribute("data-domain")
                    removeDomainFromWhitelist(domain)
                })
            })
    }

    /**
     * Open whitelist management modal
     */
    function openWhitelistManager() {
        let modal = document.querySelector(".openinnewtabs-modal")
        if (!modal) {
            modal = createWhitelistModal()
        }
        modal.style.display = "block"
        updateWhitelistDisplay()
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
    function initialize() {
        // Register menu command for whitelist management
        GM_registerMenuCommand("管理白名单", openWhitelistManager)

        // Register menu command for adding current domain to whitelist
        GM_registerMenuCommand("添加白名单", addCurrentDomainToWhitelist)

        // Start forcing new tabs
        forceNewTabs()
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
