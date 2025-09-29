/**
 * Popup Script - Open In New Tabs Extension
 * Handles whitelist management in the extension popup
 */

;(function () {
    "use strict"

    /**
     * Language resources for internationalization
     */
    const languageResources = {
        en: {
            modalTitle: "Whitelist Management",
            inputPlaceholder: "Enter domain, e.g., example.com",
            addButton: "Add",
            removeButton: "Remove",
            closeButton: "×",
            addedToWhitelist: "Added to whitelist!",
            alreadyInWhitelist: "Already in whitelist",
            removedFromWhitelist: "Removed from whitelist",
            noDomains: "No domains in whitelist",
        },
        zh: {
            modalTitle: "白名单管理",
            inputPlaceholder: "输入域名，如：example.com",
            addButton: "添加",
            removeButton: "移除",
            closeButton: "×",
            addedToWhitelist: "已添加到白名单！",
            alreadyInWhitelist: "已在白名单中",
            removedFromWhitelist: "已从白名单移除",
            noDomains: "白名单中没有域名",
        },
    }

    let currentLanguage = "en"

    /**
     * Detect browser language setting
     * @returns {string} Language code ('en' or 'zh')
     */
    function detectLanguage() {
        const userLang = navigator.language || navigator.userLanguage || "en"
        return userLang.startsWith("zh") ? "zh" : "en"
    }

    /**
     * Get text by language
     * @param {string} key Text key
     * @returns {string} Localized text
     */
    function getText(key) {
        return (
            languageResources[currentLanguage]?.[key] ||
            languageResources.en[key] ||
            key
        )
    }

    /**
     * Update UI language
     */
    function updateLanguage() {
        currentLanguage = detectLanguage()

        // Update UI elements
        document.getElementById("modalTitle").textContent =
            getText("modalTitle")
        document.getElementById("newDomainInput").placeholder =
            getText("inputPlaceholder")
        document.getElementById("addDomainBtn").textContent =
            getText("addButton")
        document.getElementById("closeButton").textContent =
            getText("closeButton")

        // Update existing remove buttons
        document.querySelectorAll(".remove-btn").forEach((btn) => {
            btn.textContent = getText("removeButton")
        })

        // Refresh domains list to update language
        loadWhitelist()
    }

    /**
     * Get user whitelist from chrome storage
     * @returns {Promise<Array>} Array of whitelisted domains
     */
    async function getUserWhitelist() {
        try {
            const result = await chrome.storage.sync.get(["userWhitelist"])
            const stored = result.userWhitelist
            return Array.isArray(stored) ? stored : []
        } catch (error) {
            console.error("Error getting whitelist:", error)
            return []
        }
    }

    /**
     * Save user whitelist to chrome storage
     * @param {Array} domains Array of domains to save
     */
    async function saveUserWhitelist(domains) {
        try {
            await chrome.storage.sync.set({ userWhitelist: domains })
        } catch (error) {
            console.error("Error saving whitelist:", error)
        }
    }

    /**
     * Show notification message
     * @param {string} message Message to display
     */
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector(".notification")
        if (existingNotification) {
            existingNotification.remove()
        }

        // Create notification element
        const notification = document.createElement("div")
        notification.className = "notification"
        notification.textContent = message
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: inherit;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `

        document.body.appendChild(notification)

        // Animate in
        setTimeout(() => {
            notification.style.opacity = "1"
            notification.style.transform = "translateX(0)"
        }, 10)

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = "0"
            notification.style.transform = "translateX(100%)"
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove()
                }
            }, 300)
        }, 3000)
    }

    /**
     * Add domain to whitelist
     * @param {string} domain Domain to add
     */
    async function addDomainToWhitelist(domain) {
        try {
            const userWhitelist = await getUserWhitelist()

            if (!userWhitelist.includes(domain)) {
                userWhitelist.push(domain)
                await saveUserWhitelist(userWhitelist)
                showNotification(`${domain} ${getText("addedToWhitelist")}`)
                loadWhitelist()
            } else {
                showNotification(`${domain} ${getText("alreadyInWhitelist")}`)
            }
        } catch (error) {
            console.error("Error adding domain:", error)
            showNotification("Error adding domain")
        }
    }

    /**
     * Remove domain from whitelist
     * @param {string} domain Domain to remove
     */
    async function removeDomainFromWhitelist(domain) {
        try {
            const userWhitelist = await getUserWhitelist()
            const index = userWhitelist.indexOf(domain)

            if (index > -1) {
                userWhitelist.splice(index, 1)
                await saveUserWhitelist(userWhitelist)
                showNotification(`${domain} ${getText("removedFromWhitelist")}`)
                loadWhitelist()
            }
        } catch (error) {
            console.error("Error removing domain:", error)
            showNotification("Error removing domain")
        }
    }

    /**
     * Load and display whitelist
     */
    async function loadWhitelist() {
        try {
            const userWhitelist = await getUserWhitelist()
            const domainsList = document.getElementById("domainsList")

            if (userWhitelist.length === 0) {
                domainsList.innerHTML = `
                    <div class="empty-state">
                        ${getText("noDomains")}
                    </div>
                `
                return
            }

            domainsList.innerHTML = userWhitelist
                .map(
                    (domain) => `
                <div class="domain-item">
                    <span class="domain-name">${domain}</span>
                    <button class="remove-btn" data-domain="${domain}">
                        ${getText("removeButton")}
                    </button>
                </div>
            `
                )
                .join("")

            // Add event listeners for remove buttons
            domainsList.querySelectorAll(".remove-btn").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const domain = e.target.getAttribute("data-domain")
                    removeDomainFromWhitelist(domain)
                })
            })
        } catch (error) {
            console.error("Error loading whitelist:", error)
        }
    }

    /**
     * Initialize popup
     */
    async function initialize() {
        try {
            // Set up language
            updateLanguage()

            // Set up event listeners
            const addBtn = document.getElementById("addDomainBtn")
            const input = document.getElementById("newDomainInput")
            const closeBtn = document.getElementById("closeButton")

            addBtn.addEventListener("click", () => {
                const domain = input.value.trim()
                if (domain) {
                    addDomainToWhitelist(domain)
                    input.value = ""
                }
            })

            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    addBtn.click()
                }
            })

            closeBtn.addEventListener("click", () => {
                window.close()
            })

            // Load initial whitelist
            await loadWhitelist()

            // Focus input for better UX
            input.focus()
        } catch (error) {
            console.error("Error initializing popup:", error)
        }
    }

    // Initialize when DOM is loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
