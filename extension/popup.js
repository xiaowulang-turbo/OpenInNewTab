/**
 * Popup Script - Open In New Tab Extension
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
            currentDomainLabel: "Current Domain:",
            quickAddBtnText: "Add",
            quickAddBtnAdded: "Added",
            manualAddTitle: "Manual Add",
            whitelistTitle: "Whitelist",
            inputPlaceholder: "Enter domain, e.g., example.com",
            addButton: "Add",
            removeButton: "Remove",
            closeButton: "×",
            addedToWhitelist: "Added to whitelist!",
            alreadyInWhitelist: "Already in whitelist",
            removedFromWhitelist: "Removed from whitelist",
            noDomains: "No domains in whitelist",
            settingsTitle: "Settings",
            themeLabel: "Theme",
            themeLightText: "Light",
            themeDarkText: "Dark",
            themeAutoText: "Auto",
            languageLabel: "Language",
        },
        zh: {
            modalTitle: "白名单管理",
            currentDomainLabel: "当前域名：",
            quickAddBtnText: "添加",
            quickAddBtnAdded: "已添加",
            manualAddTitle: "手动添加",
            whitelistTitle: "白名单",
            inputPlaceholder: "输入域名，如：example.com",
            addButton: "添加",
            removeButton: "移除",
            closeButton: "×",
            addedToWhitelist: "已添加到白名单！",
            alreadyInWhitelist: "已在白名单中",
            removedFromWhitelist: "已从白名单移除",
            noDomains: "白名单中没有域名",
            settingsTitle: "设置",
            themeLabel: "主题",
            themeLightText: "亮色",
            themeDarkText: "暗色",
            themeAutoText: "自动",
            languageLabel: "语言",
        },
    }

    let currentDomain = ""

    let currentLanguage = "en"
    let currentTheme = "auto"

    /**
     * Get theme preference from storage
     * @returns {Promise<string>} Theme preference ('light', 'dark', or 'auto')
     */
    async function getThemePreference() {
        try {
            const result = await chrome.storage.sync.get(["userTheme"])
            return result.userTheme || "auto"
        } catch (error) {
            console.error("Error getting theme preference:", error)
            return "auto"
        }
    }

    /**
     * Set theme preference to storage
     * @param {string} theme Theme to save
     */
    async function setThemePreference(theme) {
        try {
            await chrome.storage.sync.set({ userTheme: theme })
            currentTheme = theme
        } catch (error) {
            console.error("Error saving theme preference:", error)
        }
    }

    /**
     * Apply theme to document
     * @param {string} theme Theme to apply ('light', 'dark', or 'auto')
     */
    function applyTheme(theme) {
        const body = document.body

        if (theme === "auto") {
            // Use system preference
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
            body.style.colorScheme = prefersDark ? "dark" : "light"
        } else {
            // Use manual theme
            body.style.colorScheme = theme
        }

        // Update active state of theme buttons
        document.querySelectorAll(".theme-option").forEach((btn) => {
            if (btn.getAttribute("data-theme") === theme) {
                btn.classList.add("active")
            } else {
                btn.classList.remove("active")
            }
        })
    }

    /**
     * Get language preference from storage
     * @returns {Promise<string>} Language code ('en' or 'zh')
     */
    async function getLanguagePreference() {
        try {
            const result = await chrome.storage.sync.get(["userLanguage"])
            if (result.userLanguage) {
                return result.userLanguage
            }
            // Fallback to browser detection
            return detectLanguage()
        } catch (error) {
            console.error("Error getting language preference:", error)
            return detectLanguage()
        }
    }

    /**
     * Set language preference to storage
     * @param {string} lang Language to save
     */
    async function setLanguagePreference(lang) {
        try {
            await chrome.storage.sync.set({ userLanguage: lang })
        } catch (error) {
            console.error("Error saving language preference:", error)
        }
    }

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
    async function updateLanguage(lang) {
        if (lang) {
            currentLanguage = lang
        } else {
            currentLanguage = await getLanguagePreference()
        }

        // Update main UI elements
        document.getElementById("modalTitle").textContent =
            getText("modalTitle")
        document.getElementById("currentDomainLabel").textContent =
            getText("currentDomainLabel")
        document.getElementById("manualAddTitle").textContent =
            getText("manualAddTitle")
        document.getElementById("whitelistTitle").textContent =
            getText("whitelistTitle")
        document.getElementById("newDomainInput").placeholder =
            getText("inputPlaceholder")
        document.getElementById("addDomainBtn").textContent =
            getText("addButton")
        document.getElementById("closeButton").textContent =
            getText("closeButton")

        // Update settings modal elements
        document.getElementById("settingsTitle").textContent =
            getText("settingsTitle")
        document.getElementById("themeLabel").textContent =
            getText("themeLabel")
        document.getElementById("themeLightText").textContent =
            getText("themeLightText")
        document.getElementById("themeDarkText").textContent =
            getText("themeDarkText")
        document.getElementById("themeAutoText").textContent =
            getText("themeAutoText")
        document.getElementById("languageLabel").textContent =
            getText("languageLabel")

        // Update language select value
        document.getElementById("languageSelect").value = currentLanguage

        // Update quick add button
        updateQuickAddButton()

        // Update existing remove buttons
        document.querySelectorAll(".remove-btn").forEach((btn) => {
            btn.textContent = getText("removeButton")
        })

        // Refresh domains list to update language
        loadWhitelist()
    }

    /**
     * Get current active tab domain
     * @returns {Promise<string>} Current domain
     */
    async function getCurrentDomain() {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            })
            if (tab && tab.url) {
                const url = new URL(tab.url)
                return url.hostname
            }
            return ""
        } catch (error) {
            console.error("Error getting current domain:", error)
            return ""
        }
    }

    /**
     * Update quick add button state
     */
    async function updateQuickAddButton() {
        const quickAddBtn = document.getElementById("quickAddBtn")
        const quickAddBtnText = document.getElementById("quickAddBtnText")
        const userWhitelist = await getUserWhitelist()

        if (currentDomain && userWhitelist.includes(currentDomain)) {
            quickAddBtn.classList.add("added")
            quickAddBtn.disabled = true
            quickAddBtnText.textContent = getText("quickAddBtnAdded")
            quickAddBtn.title = getText("alreadyInWhitelist")
        } else {
            quickAddBtn.classList.remove("added")
            quickAddBtn.disabled = false
            quickAddBtnText.textContent = getText("quickAddBtnText")
            quickAddBtn.title = "Add current domain to whitelist"
        }
    }

    /**
     * Reload current tab
     */
    async function reloadCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            })
            if (tab && tab.id) {
                await chrome.tabs.reload(tab.id)
            }
        } catch (error) {
            console.error("Error reloading current tab:", error)
        }
    }

    /**
     * Handle quick add button click
     */
    async function handleQuickAdd() {
        if (!currentDomain) {
            showNotification("Cannot detect current domain")
            return
        }

        const userWhitelist = await getUserWhitelist()

        if (!userWhitelist.includes(currentDomain)) {
            userWhitelist.push(currentDomain)
            await saveUserWhitelist(userWhitelist)
            showNotification(`${currentDomain} ${getText("addedToWhitelist")}`)
            await updateQuickAddButton()
            loadWhitelist()
            await reloadCurrentTab()
        } else {
            showNotification(
                `${currentDomain} ${getText("alreadyInWhitelist")}`
            )
        }
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
                // Update quick add button if the added domain is current domain
                if (domain === currentDomain) {
                    await updateQuickAddButton()
                    await reloadCurrentTab()
                }
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
                // Update quick add button if the removed domain is current domain
                if (domain === currentDomain) {
                    await updateQuickAddButton()
                    await reloadCurrentTab()
                }
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
     * Open settings modal
     */
    function openSettingsModal() {
        const modal = document.getElementById("settingsModal")
        modal.classList.add("show")
    }

    /**
     * Close settings modal
     */
    function closeSettingsModal() {
        const modal = document.getElementById("settingsModal")
        modal.classList.remove("show")
    }

    /**
     * Initialize settings modal
     */
    function initializeSettingsModal() {
        const settingsBtn = document.getElementById("settingsButton")
        const modalCloseBtn = document.getElementById("modalCloseBtn")
        const modal = document.getElementById("settingsModal")
        const themeButtons = document.querySelectorAll(".theme-option")
        const languageSelect = document.getElementById("languageSelect")

        // Open modal
        settingsBtn.addEventListener("click", openSettingsModal)

        // Close modal
        modalCloseBtn.addEventListener("click", closeSettingsModal)

        // Close modal when clicking outside
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeSettingsModal()
            }
        })

        // Theme selection
        themeButtons.forEach((btn) => {
            btn.addEventListener("click", async () => {
                const theme = btn.getAttribute("data-theme")
                await setThemePreference(theme)
                applyTheme(theme)
            })
        })

        // Language selection
        languageSelect.addEventListener("change", async (e) => {
            const lang = e.target.value
            await setLanguagePreference(lang)
            await updateLanguage(lang)
        })
    }

    /**
     * Initialize popup
     */
    async function initialize() {
        try {
            // Get current domain
            currentDomain = await getCurrentDomain()
            document.getElementById("currentDomainValue").textContent =
                currentDomain || "N/A"

            // Load and apply theme preference
            currentTheme = await getThemePreference()
            applyTheme(currentTheme)

            // Load and apply language preference
            await updateLanguage()

            // Initialize settings modal
            initializeSettingsModal()

            // Set up event listeners
            const quickAddBtn = document.getElementById("quickAddBtn")
            const addBtn = document.getElementById("addDomainBtn")
            const input = document.getElementById("newDomainInput")
            const closeBtn = document.getElementById("closeButton")

            quickAddBtn.addEventListener("click", handleQuickAdd)

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

            // Update quick add button state
            await updateQuickAddButton()

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
