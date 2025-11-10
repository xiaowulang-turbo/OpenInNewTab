/**
 * Options Script - Open In New Tab Extension
 * Handles extension settings and whitelist management
 */

;(function () {
    "use strict"

    /**
     * Language resources for internationalization
     */
    const languageResources = {
        en: {
            optionsTitle: "Extension Settings",
            optionsSubtitle: "Configure your preferences and manage whitelist",
            appearanceHeading: "Appearance & Language",
            themeLabel: "Theme",
            themeDesc: "Choose your preferred theme",
            themeLightText: "Light",
            themeDarkText: "Dark",
            themeAutoText: "Auto",
            languageLabel: "Language",
            languageDesc: "Select your language",
            whitelistHeading: "Whitelist Management",
            importExportLabel: "Import / Export",
            importExportDesc: "Backup or restore your whitelist",
            exportBtnText: "Export",
            importBtnText: "Import",
            addDomainLabel: "Add Domain",
            addDomainDesc: "Add a new domain to whitelist",
            addBtnText: "Add",
            removeButton: "Remove",
            domainsCount: "{count} domains",
            noDomains: "No domains in whitelist",
            footerText: "Open In New Tab Extension v1.2.0",
            exportSuccess: "Whitelist exported successfully!",
            importSuccess: "Whitelist imported successfully!",
            importError: "Failed to import whitelist",
            addedToWhitelist: "Added to whitelist!",
            alreadyInWhitelist: "Already in whitelist",
            removedFromWhitelist: "Removed from whitelist",
            inputPlaceholder: "example.com",
        },
        zh: {
            optionsTitle: "扩展设置",
            optionsSubtitle: "配置您的偏好设置和管理白名单",
            appearanceHeading: "外观和语言",
            themeLabel: "主题",
            themeDesc: "选择您的偏好主题",
            themeLightText: "亮色",
            themeDarkText: "暗色",
            themeAutoText: "自动",
            languageLabel: "语言",
            languageDesc: "选择您的语言",
            whitelistHeading: "白名单管理",
            importExportLabel: "导入 / 导出",
            importExportDesc: "备份或恢复您的白名单",
            exportBtnText: "导出",
            importBtnText: "导入",
            addDomainLabel: "添加域名",
            addDomainDesc: "添加一个新域名到白名单",
            addBtnText: "添加",
            removeButton: "移除",
            domainsCount: "{count} 个域名",
            noDomains: "白名单中没有域名",
            footerText: "Open In New Tab 扩展 v1.2.0",
            exportSuccess: "白名单导出成功！",
            importSuccess: "白名单导入成功！",
            importError: "导入白名单失败",
            addedToWhitelist: "已添加到白名单！",
            alreadyInWhitelist: "已在白名单中",
            removedFromWhitelist: "已从白名单移除",
            inputPlaceholder: "example.com",
        },
    }

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
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
            body.style.colorScheme = prefersDark ? "dark" : "light"
        } else {
            body.style.colorScheme = theme
        }

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
     * @param {Object} params Parameters to replace in text
     * @returns {string} Localized text
     */
    function getText(key, params = {}) {
        let text =
            languageResources[currentLanguage]?.[key] ||
            languageResources.en[key] ||
            key

        Object.keys(params).forEach((param) => {
            text = text.replace(`{${param}}`, params[param])
        })

        return text
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

        document.getElementById("optionsTitle").textContent =
            getText("optionsTitle")
        document.getElementById("optionsSubtitle").textContent =
            getText("optionsSubtitle")
        document.getElementById("appearanceHeading").textContent =
            getText("appearanceHeading")
        document.getElementById("themeLabel").textContent =
            getText("themeLabel")
        document.getElementById("themeDesc").textContent = getText("themeDesc")
        document.getElementById("themeLightText").textContent =
            getText("themeLightText")
        document.getElementById("themeDarkText").textContent =
            getText("themeDarkText")
        document.getElementById("themeAutoText").textContent =
            getText("themeAutoText")
        document.getElementById("languageLabel").textContent =
            getText("languageLabel")
        document.getElementById("languageDesc").textContent =
            getText("languageDesc")
        document.getElementById("whitelistHeading").textContent =
            getText("whitelistHeading")
        document.getElementById("importExportLabel").textContent =
            getText("importExportLabel")
        document.getElementById("importExportDesc").textContent =
            getText("importExportDesc")
        document.getElementById("exportBtnText").textContent =
            getText("exportBtnText")
        document.getElementById("importBtnText").textContent =
            getText("importBtnText")
        document.getElementById("addDomainLabel").textContent =
            getText("addDomainLabel")
        document.getElementById("addDomainDesc").textContent =
            getText("addDomainDesc")
        document.getElementById("addBtnText").textContent =
            getText("addBtnText")
        document.getElementById("footerText").textContent =
            getText("footerText")
        document.getElementById("newDomainInput").placeholder =
            getText("inputPlaceholder")

        document.getElementById("languageSelect").value = currentLanguage

        document.querySelectorAll(".remove-btn").forEach((btn) => {
            btn.textContent = getText("removeButton")
        })

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
        const existingNotification = document.querySelector(".notification")
        if (existingNotification) {
            existingNotification.remove()
        }

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
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: inherit;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `

        document.body.appendChild(notification)

        setTimeout(() => {
            notification.style.opacity = "1"
            notification.style.transform = "translateY(0)"
        }, 10)

        setTimeout(() => {
            notification.style.opacity = "0"
            notification.style.transform = "translateY(-20px)"
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove()
                }
            }, 300)
        }, 3000)
    }

    /**
     * Reload tabs matching the domain
     * @param {string} domain Domain to match
     */
    async function reloadMatchingTabs(domain) {
        try {
            const tabs = await chrome.tabs.query({})
            for (const tab of tabs) {
                if (tab.url) {
                    try {
                        const url = new URL(tab.url)
                        const hostname = url.hostname
                        if (
                            hostname === domain ||
                            hostname.endsWith("." + domain)
                        ) {
                            await chrome.tabs.reload(tab.id)
                        }
                    } catch (error) {
                        // Skip invalid URLs
                        continue
                    }
                }
            }
        } catch (error) {
            console.error("Error reloading matching tabs:", error)
        }
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
                await reloadMatchingTabs(domain)
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
                await reloadMatchingTabs(domain)
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
            const domainsCount = document.getElementById("domainsCount")

            domainsCount.textContent = getText("domainsCount", {
                count: userWhitelist.length,
            })

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
     * Export whitelist to JSON file
     */
    async function exportWhitelist() {
        try {
            const userWhitelist = await getUserWhitelist()
            const data = {
                version: "1.2.0",
                exportDate: new Date().toISOString(),
                whitelist: userWhitelist,
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `open-in-new-tab-whitelist-${Date.now()}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            showNotification(getText("exportSuccess"))
        } catch (error) {
            console.error("Error exporting whitelist:", error)
            showNotification("Error exporting whitelist")
        }
    }

    /**
     * Import whitelist from JSON file
     * @param {File} file JSON file to import
     */
    async function importWhitelist(file) {
        try {
            const text = await file.text()
            const data = JSON.parse(text)

            if (data.whitelist && Array.isArray(data.whitelist)) {
                await saveUserWhitelist(data.whitelist)
                showNotification(getText("importSuccess"))
                loadWhitelist()
            } else {
                showNotification(getText("importError"))
            }
        } catch (error) {
            console.error("Error importing whitelist:", error)
            showNotification(getText("importError"))
        }
    }

    /**
     * Initialize options page
     */
    async function initialize() {
        try {
            currentTheme = await getThemePreference()
            applyTheme(currentTheme)

            await updateLanguage()

            const themeButtons = document.querySelectorAll(".theme-option")
            themeButtons.forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const theme = btn.getAttribute("data-theme")
                    await setThemePreference(theme)
                    applyTheme(theme)
                })
            })

            const languageSelect = document.getElementById("languageSelect")
            languageSelect.addEventListener("change", async (e) => {
                const lang = e.target.value
                await setLanguagePreference(lang)
                await updateLanguage(lang)
            })

            const addBtn = document.getElementById("addDomainBtn")
            const input = document.getElementById("newDomainInput")

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

            const exportBtn = document.getElementById("exportBtn")
            exportBtn.addEventListener("click", exportWhitelist)

            const importBtn = document.getElementById("importBtn")
            const importFileInput = document.getElementById("importFileInput")

            importBtn.addEventListener("click", () => {
                importFileInput.click()
            })

            importFileInput.addEventListener("change", (e) => {
                const file = e.target.files[0]
                if (file) {
                    importWhitelist(file)
                    importFileInput.value = ""
                }
            })

            await loadWhitelist()
        } catch (error) {
            console.error("Error initializing options:", error)
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
