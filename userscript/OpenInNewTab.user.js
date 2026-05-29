// ==UserScript==
// @name              Open In New Tab
// @name:zh-CN        Open In New Tab - 链接强制新标签页打开
// @namespace         https://github.com/xiaowulang-turbo/OpenInNewTab
// @version           1.6.1
// @description       Force links to open in a new tab on whitelisted sites only. One-click add or remove the current domain from the Tampermonkey menu, with subdomain matching, dynamic-content support, dark mode, and English/Chinese UI. Other sites stay untouched.
// @description:zh-CN 基于白名单的链接拦截脚本：仅在你勾选的网站把链接强制改为新标签页打开，其它网站完全不受影响。油猴菜单一键加入/移出当前域名，支持子域名匹配、深色模式与中英文界面。
// @author            Xiaowu
// @match             *://*/*
// @noframes
// @homepageURL       https://github.com/xiaowulang-turbo/OpenInNewTab
// @supportURL        https://github.com/xiaowulang-turbo/OpenInNewTab/issues
// @icon              https://raw.githubusercontent.com/xiaowulang-turbo/OpenInNewTab/main/extension/icons/icon128.png
// @updateURL         https://raw.githubusercontent.com/xiaowulang-turbo/OpenInNewTab/main/userscript/OpenInNewTab.user.js
// @downloadURL       https://raw.githubusercontent.com/xiaowulang-turbo/OpenInNewTab/main/userscript/OpenInNewTab.user.js
// @license           MIT
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM_addValueChangeListener
// @grant             GM_removeValueChangeListener
// @run-at            document-start
// ==/UserScript==

;(function () {
    "use strict"

    // ─────────────────────────────────────────────────────────────
    // Constants & module state (mirrored from extension/content.js)
    // ─────────────────────────────────────────────────────────────
    const STORAGE_KEY_WHITELIST = "userWhitelist"
    const PATCHED_ATTR = "data-oint-patched"

    /** @type {{ isApplied: boolean, observer: MutationObserver|null, menuIds: any[], pendingNodes: Node[], scheduled: boolean, listenerId: any }} */
    const state = {
        isApplied: false,
        observer: null,
        menuIds: [],
        pendingNodes: [],
        scheduled: false,
        listenerId: null,
    }

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
        const lang = detectLanguage()

        if (!userWhitelist.includes(currentDomain)) {
            userWhitelist.push(currentDomain)
            saveUserWhitelist(userWhitelist)
            alert(`${currentDomain} ${getText("addedToWhitelist", lang)}`)
        } else {
            alert(`${currentDomain} ${getText("alreadyInWhitelist", lang)}`)
        }
    }

    /**
     * Remove current domain from whitelist (exact host match only).
     * Note: matches domain in storage exactly equal to hostname; will not
     * remove a parent-domain entry that current page inherited via suffix match.
     */
    function removeCurrentDomainFromWhitelist() {
        const currentDomain = window.location.hostname
        const userWhitelist = getUserWhitelist()
        const lang = detectLanguage()
        const idx = userWhitelist.indexOf(currentDomain)

        if (idx > -1) {
            userWhitelist.splice(idx, 1)
            saveUserWhitelist(userWhitelist)
            alert(`${currentDomain} ${getText("removedFromWhitelist", lang)}`)
        } else {
            alert(`${currentDomain} ${getText("notInWhitelist", lang)}`)
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
            notInWhitelist: "Not in whitelist",
            noDomains: "No domains in whitelist",
            addToWhitelist: "Add to Whitelist",
            removeFromWhitelist: "Remove from Whitelist",
            manageWhitelist: "Manage Whitelist",
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
            notInWhitelist: "不在白名单中",
            noDomains: "白名单中没有域名",
            addToWhitelist: "添加白名单",
            removeFromWhitelist: "移出白名单",
            manageWhitelist: "管理白名单",
        },
    }

    /**
     * Get text by language
     * @param {string} key Text key
     * @param {string} lang Language code
     * @returns {string} Localized text
     */
    function getText(key, lang = null) {
        const language = lang || detectLanguage()
        return (
            languageResources[language]?.[key] ||
            languageResources.en[key] ||
            key
        )
    }

    /**
     * Detect if the browser is in dark mode
     * @returns {boolean} True if in dark mode
     */
    function isDarkMode() {
        return (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        )
    }

    /**
     * Get CSS variables based on theme
     * @returns {Object} CSS color variables
     */
    function getThemeColors() {
        const isDark = isDarkMode()
        return {
            bgPrimary: isDark ? "#1a1a1a" : "#ffffff",
            bgSecondary: isDark ? "#2d2d2d" : "#f8f9fa",
            textPrimary: isDark ? "#ffffff" : "#333333",
            textSecondary: isDark ? "#cccccc" : "#666666",
            borderColor: isDark ? "#404040" : "#dddddd",
            shadowColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)",
            inputBg: isDark ? "#333333" : "#ffffff",
            inputBorder: isDark ? "#555555" : "#dddddd",
            inputText: isDark ? "#ffffff" : "#333333",
        }
    }

    /**
     * Create whitelist management modal
     */
    function createWhitelistModal() {
        const lang = detectLanguage()
        const modal = document.createElement("div")
        modal.className = "openinnewtabs-modal"
        modal.innerHTML = `
            <div class="openinnewtabs-modal-content">
                <div class="openinnewtabs-modal-header">
                    <h3>${getText("modalTitle", lang)}</h3>
                    <button class="openinnewtabs-close">${getText(
                        "closeButton",
                        lang
                    )}</button>
                </div>
                <div class="openinnewtabs-modal-body">
                    <div class="openinnewtabs-input-group">
                        <input type="text" id="openinnewtabs-new-domain" placeholder="${getText(
                            "inputPlaceholder",
                            lang
                        )}">
                        <button id="openinnewtabs-add-domain">${getText(
                            "addButton",
                            lang
                        )}</button>
                    </div>
                    <div class="openinnewtabs-domains-list" id="openinnewtabs-domains-list">
                        <!-- Domains will be added here -->
                    </div>
                </div>
            </div>
        `

        const colors = getThemeColors()

        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
                sans-serif;
        `

        const modalContent = modal.querySelector(".openinnewtabs-modal-content")
        modalContent.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${colors.bgPrimary};
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 12px;
            box-shadow: 0 8px 32px ${colors.shadowColor};
            border: 1px solid ${colors.borderColor};
        `

        const header = modal.querySelector(".openinnewtabs-modal-header")
        header.style.cssText = `
            padding: 20px 24px;
            border-bottom: 1px solid ${colors.borderColor};
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: ${colors.bgSecondary};
            border-radius: 12px 12px 0 0;
        `

        const headerTitle = header.querySelector("h3")
        headerTitle.style.cssText = `
            margin: 0;
            color: ${colors.textPrimary};
            font-size: 18px;
            font-weight: 600;
        `

        const closeBtn = modal.querySelector(".openinnewtabs-close")
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: ${colors.textSecondary};
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        `

        const body = modal.querySelector(".openinnewtabs-modal-body")
        body.style.cssText = `
            padding: 24px;
            color: ${colors.textPrimary};
        `

        const inputGroup = modal.querySelector(".openinnewtabs-input-group")
        inputGroup.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
        `

        const input = modal.querySelector("#openinnewtabs-new-domain")
        input.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            border: 2px solid ${colors.inputBorder};
            border-radius: 8px;
            font-size: 14px;
            background: ${colors.inputBg};
            color: ${colors.inputText};
            outline: none;
            transition: border-color 0.2s ease;
        `

        const addBtn = modal.querySelector("#openinnewtabs-add-domain")
        addBtn.style.cssText = `
            padding: 12px 24px;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        `

        // Add hover effects
        closeBtn.addEventListener("mouseover", () => {
            closeBtn.style.background = isDarkMode() ? "#404040" : "#e9ecef"
            closeBtn.style.color = colors.textPrimary
        })

        closeBtn.addEventListener("mouseout", () => {
            closeBtn.style.background = "none"
            closeBtn.style.color = colors.textSecondary
        })

        addBtn.addEventListener("mouseover", () => {
            addBtn.style.transform = "translateY(-1px)"
            addBtn.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.4)"
        })

        addBtn.addEventListener("mouseout", () => {
            addBtn.style.transform = "translateY(0)"
            addBtn.style.boxShadow = "0 2px 8px rgba(76, 175, 80, 0.3)"
        })

        input.addEventListener("focus", () => {
            input.style.borderColor = "#4caf50"
        })

        input.addEventListener("blur", () => {
            input.style.borderColor = colors.inputBorder
        })

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
        const lang = detectLanguage()

        if (!userWhitelist.includes(domain)) {
            userWhitelist.push(domain)
            saveUserWhitelist(userWhitelist)
            alert(`${domain} ${getText("addedToWhitelist", lang)}`)
        } else {
            alert(`${domain} ${getText("alreadyInWhitelist", lang)}`)
        }
    }

    /**
     * Remove domain from whitelist
     * @param {string} domain Domain to remove
     */
    function removeDomainFromWhitelist(domain) {
        const userWhitelist = getUserWhitelist()
        const lang = detectLanguage()
        const index = userWhitelist.indexOf(domain)

        if (index > -1) {
            userWhitelist.splice(index, 1)
            saveUserWhitelist(userWhitelist)
            alert(`${domain} ${getText("removedFromWhitelist", lang)}`)
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
        const colors = getThemeColors()
        const lang = detectLanguage()

        if (userWhitelist.length === 0) {
            domainsList.innerHTML = `
                <div style="
                    text-align: center;
                    color: ${colors.textSecondary};
                    font-size: 14px;
                    padding: 32px 16px;
                ">
                    ${getText("noDomains", lang)}
                </div>
            `
            return
        }

        domainsList.innerHTML = userWhitelist
            .map(
                (domain) => `
            <div class="openinnewtabs-domain-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border: 1px solid ${colors.borderColor};
                margin-bottom: 8px;
                border-radius: 8px;
                background: ${colors.bgSecondary};
                transition: all 0.2s ease;
            ">
                <span style="
                    color: ${colors.textPrimary};
                    font-size: 14px;
                    font-weight: 500;
                    flex: 1;
                ">${domain}</span>
                <button class="openinnewtabs-remove-domain" data-domain="${domain}" style="
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
                ">${getText("removeButton", lang)}</button>
            </div>
        `
            )
            .join("")

        // Add event listeners and hover effects for remove buttons
        domainsList
            .querySelectorAll(".openinnewtabs-remove-domain")
            .forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const domain = e.target.getAttribute("data-domain")
                    removeDomainFromWhitelist(domain)
                })

                btn.addEventListener("mouseover", () => {
                    btn.style.transform = "translateY(-1px)"
                    btn.style.boxShadow = "0 4px 12px rgba(244, 67, 54, 0.4)"
                })

                btn.addEventListener("mouseout", () => {
                    btn.style.transform = "translateY(0)"
                    btn.style.boxShadow = "0 2px 8px rgba(244, 67, 54, 0.3)"
                })
            })

        // Add hover effects for domain items
        domainsList
            .querySelectorAll(".openinnewtabs-domain-item")
            .forEach((item) => {
                item.addEventListener("mouseover", () => {
                    item.style.transform = "translateY(-1px)"
                    item.style.boxShadow = `0 4px 12px ${colors.shadowColor}`
                })

                item.addEventListener("mouseout", () => {
                    item.style.transform = "translateY(0)"
                    item.style.boxShadow = "none"
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

    // ─────────────────────────────────────────────────────────────
    // Core: link interception + target patching + page lifecycle
    // MIRROR: extension/content.js
    //   Diffs vs extension:
    //     - openInBackground 不支持，统一走 window.open
    //     - 用 GM_* 替代 chrome.storage / chrome.runtime
    //     - 跨 tab reload 不可行，由 GM_addValueChangeListener 在每页本地等价
    // Keep in sync when extension version changes.
    // ─────────────────────────────────────────────────────────────

    /**
     * Decide whether a click should bypass our interception.
     * MIRROR: extension/content.js#shouldSkipLinkClick
     * @param {MouseEvent} event
     * @param {HTMLAnchorElement} link
     * @returns {boolean}
     */
    function shouldSkipLinkClick(event, link) {
        if (link.hasAttribute("download")) return true

        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.button === 1
        ) {
            return true
        }

        const href = link.getAttribute("href")
        if (
            !href ||
            href.startsWith("javascript:") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("#")
        ) {
            return true
        }

        return false
    }

    /**
     * Capture-phase click handler. Synchronous so window.open stays in the
     * user-gesture stack (popup blockers won't fire).
     * @param {MouseEvent} event
     */
    function handleLinkClick(event) {
        const target = event.target
        if (!target || typeof target.closest !== "function") return
        const link = target.closest("a[href]")
        if (!link || shouldSkipLinkClick(event, link)) return

        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        window.open(link.href, "_blank", "noopener,noreferrer")
    }

    /**
     * Patch a single anchor with target=_blank + safe rel, marked for rollback.
     * MIRROR: extension/content.js#patchLinkTarget
     * @param {HTMLAnchorElement} link
     */
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

    /**
     * Walk a subtree and patch every anchor descendant.
     * @param {Node} root
     */
    function patchLinksUnder(root) {
        if (!root || root.nodeType !== Node.ELEMENT_NODE) return
        if (root.matches?.("a[href]")) patchLinkTarget(root)
        root.querySelectorAll?.("a[href]").forEach(patchLinkTarget)
    }

    /**
     * Roll back all anchors we previously patched.
     * MIRROR: extension/content.js#removePatchedTargets
     */
    function removePatchedTargets() {
        document.querySelectorAll(`a[${PATCHED_ATTR}]`).forEach((link) => {
            link.removeAttribute("target")
            link.removeAttribute("rel")
            link.removeAttribute(PATCHED_ATTR)
        })
    }

    /** Idle-batched flush for collected mutations. */
    function flushPendingPatches() {
        state.scheduled = false
        const batch = state.pendingNodes
        state.pendingNodes = []
        for (const node of batch) patchLinksUnder(node)
    }

    function schedulePatchFlush() {
        if (state.scheduled) return
        state.scheduled = true
        if (typeof requestIdleCallback === "function") {
            requestIdleCallback(flushPendingPatches, { timeout: 200 })
        } else {
            setTimeout(flushPendingPatches, 0)
        }
    }

    function startObserver() {
        if (state.observer || !document.body) return
        state.observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === "childList") {
                    m.addedNodes.forEach((n) => state.pendingNodes.push(n))
                } else if (
                    m.type === "attributes" &&
                    m.target.nodeType === Node.ELEMENT_NODE &&
                    m.target.matches?.("a[href]")
                ) {
                    state.pendingNodes.push(m.target)
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
        state.pendingNodes = []
        state.scheduled = false
    }

    /**
     * Mount or unmount the page-level integration based on current whitelist hit.
     * Idempotent — safe to call repeatedly (init, storage change, menu action).
     */
    function applyToCurrentPage() {
        const shouldApply = isWhitelisted()

        if (shouldApply && !state.isApplied) {
            // Click capture works without DOM ready, bind ASAP.
            document.addEventListener("click", handleLinkClick, true)

            const onBodyReady = () => {
                if (!state.isApplied) return
                patchLinksUnder(document.body)
                startObserver()
            }
            if (document.body) {
                onBodyReady()
            } else {
                document.addEventListener("DOMContentLoaded", onBodyReady, {
                    once: true,
                })
            }

            state.isApplied = true
            return
        }

        if (!shouldApply && state.isApplied) {
            document.removeEventListener("click", handleLinkClick, true)
            stopObserver()
            removePatchedTargets()
            state.isApplied = false
        }
    }

    /**
     * Re-register tampermonkey menu commands so the visible label reflects
     * current whitelist status. Falls back gracefully when
     * GM_unregisterMenuCommand is unavailable (registers both add+remove).
     */
    function refreshMenu() {
        const lang = detectLanguage()
        const canUnregister = typeof GM_unregisterMenuCommand === "function"
        const inWhitelist = isWhitelisted()

        if (canUnregister) {
            for (const id of state.menuIds) {
                try {
                    GM_unregisterMenuCommand(id)
                } catch (_e) {
                    /* ignore: menu may already be cleared */
                }
            }
            state.menuIds = []

            if (inWhitelist) {
                state.menuIds.push(
                    GM_registerMenuCommand(
                        getText("removeFromWhitelist", lang),
                        removeCurrentDomainFromWhitelist
                    )
                )
            } else {
                state.menuIds.push(
                    GM_registerMenuCommand(
                        getText("addToWhitelist", lang),
                        addCurrentDomainToWhitelist
                    )
                )
            }
            state.menuIds.push(
                GM_registerMenuCommand(
                    getText("manageWhitelist", lang),
                    openWhitelistManager
                )
            )
            return
        }

        // Fallback: legacy managers without unregister support — set once.
        if (state.menuIds.length === 0) {
            state.menuIds.push(
                GM_registerMenuCommand(
                    getText("addToWhitelist", lang),
                    addCurrentDomainToWhitelist
                ),
                GM_registerMenuCommand(
                    getText("removeFromWhitelist", lang),
                    removeCurrentDomainFromWhitelist
                ),
                GM_registerMenuCommand(
                    getText("manageWhitelist", lang),
                    openWhitelistManager
                )
            )
        }
    }

    /**
     * Bridge GM storage changes to in-page reactions.
     * Cross-tab updates arrive with `remote === true`; same-tab saves arrive
     * with `remote === false`. Both should re-evaluate page state and menu.
     */
    function setupStorageListener() {
        if (typeof GM_addValueChangeListener !== "function") return
        try {
            state.listenerId = GM_addValueChangeListener(
                STORAGE_KEY_WHITELIST,
                () => {
                    applyToCurrentPage()
                    refreshMenu()
                    const modal = document.querySelector(
                        ".openinnewtabs-modal"
                    )
                    if (modal && modal.style.display !== "none") {
                        updateWhitelistDisplay()
                    }
                }
            )
        } catch (e) {
            console.warn("[OpenInNewTab] storage listener unavailable:", e)
        }
    }

    /** Entry point. */
    function initialize() {
        try {
            refreshMenu()
            applyToCurrentPage()
            setupStorageListener()
        } catch (e) {
            console.error("[OpenInNewTab] init failed:", e)
        }
    }

    // Bind ASAP — initialize is safe to call before DOMContentLoaded.
    initialize()
})()
