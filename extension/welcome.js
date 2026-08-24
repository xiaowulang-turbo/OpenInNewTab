/**
 * Welcome Script - Open In New Tab Extension
 * Shown once on first install. Mirrors the options page i18n/theme handling.
 */

;(function () {
    "use strict"

    const languageResources = {
        en: {
            heroBadge: "Installed",
            welcomeTitle: "Welcome to Open In New Tab",
            welcomeSubtitle:
                "Force links to open in new tabs — only on the sites you choose.",
            howItWorksHeading: "How it works",
            howItWorksDesc:
                "This extension uses a whitelist. By default it does nothing — links behave normally everywhere. Add a domain to your whitelist and every link on that site will open in a new tab.",
            getStartedHeading: "Get started in 3 steps",
            step1Title: "Pin the extension",
            step1Desc:
                "Click the puzzle icon in the toolbar and pin Open In New Tab for quick access.",
            step2Title: "Add a website",
            step2Desc:
                "Open any site, click the extension icon, then press Add to whitelist the current domain.",
            step3Title: "Enjoy new tabs",
            step3Desc:
                "Every link on whitelisted sites now opens in a new tab. Manage sites anytime from Settings.",
            openOptionsBtnText: "Open Settings",
            visitSiteBtnText: "Visit Website",
            updateHeroBadge: "What's new",
            updatePageTitle: "What's new in Open In New Tab",
            updatePageSubtitle:
                "See what changed in version {version}.",
            updateVersionText: "Version {version}",
            updatePreviousVersionText: "Updated from {version}",
            updateDateText: "Released {date}",
            updateHighlightsHeading: "Highlights",
            updateMigrationHeading: "What you need to know",
            disableUpdateNoticesText:
                "Don't automatically open important update notices",
            footerText: "Open In New Tab Extension v{version}",
        },
        zh: {
            heroBadge: "安装成功",
            welcomeTitle: "欢迎使用 Open In New Tab",
            welcomeSubtitle: "强制链接在新标签页打开 —— 仅作用于你选择的网站。",
            howItWorksHeading: "工作原理",
            howItWorksDesc:
                "本扩展采用白名单模式。默认情况下不做任何事，所有网站的链接行为保持不变。将某个域名加入白名单后，该网站上的每个链接都会在新标签页打开。",
            getStartedHeading: "三步上手",
            step1Title: "固定扩展",
            step1Desc:
                "点击工具栏的拼图图标，将 Open In New Tab 固定下来，方便随时使用。",
            step2Title: "添加网站",
            step2Desc:
                "打开任意网站，点击扩展图标，再点「添加」即可把当前域名加入白名单。",
            step3Title: "享受新标签页",
            step3Desc:
                "白名单网站上的每个链接都会在新标签页打开。随时可在设置中管理网站。",
            openOptionsBtnText: "打开设置",
            visitSiteBtnText: "访问官网",
            updateHeroBadge: "更新说明",
            updatePageTitle: "Open In New Tab 更新说明",
            updatePageSubtitle: "了解 v{version} 的更新内容。",
            updateVersionText: "当前版本：{version}",
            updatePreviousVersionText: "从 {version} 更新",
            updateDateText: "发布日期：{date}",
            updateHighlightsHeading: "重点变化",
            updateMigrationHeading: "你需要了解",
            disableUpdateNoticesText: "以后不再自动打开重要更新说明",
            footerText: "Open In New Tab 扩展 v{version}",
        },
    }

    let currentLanguage = "en"
    let updateContext = null

    /**
     * Detect browser language setting
     * @returns {string} Language code ('en' or 'zh')
     */
    function detectLanguage() {
        const userLang = navigator.language || navigator.userLanguage || "en"
        return userLang.startsWith("zh") ? "zh" : "en"
    }

    /**
     * Get language preference from storage, falling back to browser language
     * @returns {Promise<string>} Language code ('en' or 'zh')
     */
    async function getLanguagePreference() {
        try {
            const result = await chrome.storage.sync.get(["userLanguage"])
            return result.userLanguage || detectLanguage()
        } catch (error) {
            console.error("Error getting language preference:", error)
            return detectLanguage()
        }
    }

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
     * Apply theme to document
     * @param {string} theme Theme to apply ('light', 'dark', or 'auto')
     */
    function applyTheme(theme) {
        if (theme === "auto") {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
            document.body.style.colorScheme = prefersDark ? "dark" : "light"
        } else {
            document.body.style.colorScheme = theme
        }
    }

    /**
     * Get localized text by key
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

    function getUpdateContext() {
        const params = new URLSearchParams(window.location.search)
        if (params.get("mode") !== "update") {
            return null
        }

        const version =
            params.get("version") || chrome.runtime.getManifest().version
        const notice =
            globalThis.OpenInNewTabUpdateNotices?.getUpdateNotice(version)
        if (!notice?.showUpdateNotice) {
            return null
        }

        return {
            from: params.get("from") || "",
            notice,
            version,
        }
    }

    function applyPageMode() {
        if (!updateContext) {
            return
        }

        document.body.classList.add("update-mode")
        document
            .querySelectorAll(".install-only-section")
            .forEach((section) => {
                section.hidden = true
            })
        document.getElementById("updateNoticeSection").hidden = false
    }

    function renderUpdateNotice() {
        if (!updateContext) {
            return
        }

        const copy =
            updateContext.notice[currentLanguage] ||
            updateContext.notice.en
        document.getElementById("updateVersionText").textContent = getText(
            "updateVersionText",
            { version: updateContext.version }
        )
        document.getElementById("updatePreviousVersionText").textContent =
            updateContext.from
                ? getText("updatePreviousVersionText", {
                      version: updateContext.from,
                  })
                : ""
        document.getElementById("updateDateText").textContent = getText(
            "updateDateText",
            { date: updateContext.notice.releaseDate }
        )
        document.getElementById("updateNoticeTitle").textContent = copy.title
        document.getElementById("updateNoticeSummary").textContent =
            copy.summary

        const highlights = document.getElementById("updateHighlights")
        highlights.replaceChildren()
        copy.highlights.forEach((item) => {
            const listItem = document.createElement("li")
            listItem.textContent = item
            highlights.append(listItem)
        })

        const migration = document.getElementById("updateMigration")
        if (copy.migrationNote) {
            migration.hidden = false
            document.getElementById("updateMigrationText").textContent =
                copy.migrationNote
        } else {
            migration.hidden = true
        }
    }

    /**
     * Apply localized text to all known elements
     */
    function updateLanguage() {
        const keys = [
            "heroBadge",
            "welcomeTitle",
            "welcomeSubtitle",
            "howItWorksHeading",
            "howItWorksDesc",
            "getStartedHeading",
            "step1Title",
            "step1Desc",
            "step2Title",
            "step2Desc",
            "step3Title",
            "step3Desc",
            "openOptionsBtnText",
            "visitSiteBtnText",
            "updateHighlightsHeading",
            "updateMigrationHeading",
            "disableUpdateNoticesText",
        ]

        keys.forEach((key) => {
            const el = document.getElementById(key)
            if (el) {
                el.textContent = getText(key)
            }
        })

        document.getElementById("footerText").textContent = getText(
            "footerText",
            { version: chrome.runtime.getManifest().version }
        )

        document.documentElement.lang = currentLanguage === "zh" ? "zh" : "en"

        if (updateContext) {
            document.getElementById("heroBadge").textContent = getText(
                "updateHeroBadge"
            )
            document.getElementById("welcomeTitle").textContent = getText(
                "updatePageTitle"
            )
            document.getElementById("welcomeSubtitle").textContent = getText(
                "updatePageSubtitle",
                { version: updateContext.version }
            )
            renderUpdateNotice()
        }
    }

    /**
     * Initialize welcome page
     */
    async function initialize() {
        try {
            updateContext = getUpdateContext()
            applyPageMode()
            applyTheme(await getThemePreference())
            currentLanguage = await getLanguagePreference()
            updateLanguage()

            document
                .getElementById("openOptionsBtn")
                .addEventListener("click", () => {
                    chrome.runtime.openOptionsPage()
                })

            if (updateContext) {
                const toggle = document.getElementById(
                    "disableUpdateNotices"
                )
                try {
                    const result = await chrome.storage.sync.get([
                        "updateNoticeEnabled",
                    ])
                    toggle.checked = result.updateNoticeEnabled === false
                } catch (error) {
                    console.error(
                        "Error loading update notice preference:",
                        error
                    )
                    toggle.checked = false
                }
                toggle.addEventListener("change", async () => {
                    try {
                        await chrome.storage.sync.set({
                            updateNoticeEnabled: !toggle.checked,
                        })
                    } catch (error) {
                        toggle.checked = !toggle.checked
                        console.error(
                            "Error saving update notice preference:",
                            error
                        )
                    }
                })
            }
        } catch (error) {
            console.error("Error initializing welcome page:", error)
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
