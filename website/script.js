/**
 * Open In New Tab - Website JavaScript
 * Interactive functionality for the landing page
 */
;(function () {
    "use strict"

    /**
     * Tab switching functionality for installation section
     */
    function initInstallTabs() {
        const tabs = document.querySelectorAll(".install-tab")
        const panels = document.querySelectorAll(".install-panel")

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const targetTab = tab.getAttribute("data-tab")

                tabs.forEach((t) => t.classList.remove("active"))
                panels.forEach((p) => p.classList.remove("active"))

                tab.classList.add("active")
                const targetPanel = document.getElementById(
                    `install-${targetTab}`
                )
                if (targetPanel) {
                    targetPanel.classList.add("active")
                }
            })
        })
    }

    /**
     * Copy to clipboard functionality
     */
    function initCopyButtons() {
        const copyButtons = document.querySelectorAll(".copy-btn")

        copyButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const copyType = button.getAttribute("data-copy")
                let textToCopy = ""

                if (copyType === "userscript") {
                    textToCopy =
                        "https://github.com/xiaowulang-turbo/OpenInNewTab/blob/main/userscript/OpenInNewTab.user.js"
                }

                const currentLang =
                    localStorage.getItem("user-language") ||
                    (navigator.language?.startsWith("zh") ? "zh" : "en")
                const t = translations[currentLang]

                try {
                    await navigator.clipboard.writeText(textToCopy)
                    const originalText = button.textContent
                    button.textContent = t.btnCopied
                    button.style.background =
                        "color-mix(in srgb, var(--color-accent) 25%, transparent)"

                    setTimeout(() => {
                        button.textContent = originalText
                        button.style.background = ""
                    }, 2000)
                } catch (err) {
                    console.error("Failed to copy:", err)
                    button.textContent = t.btnCopyFailed
                    setTimeout(() => {
                        button.textContent = t.btnCopyLink
                    }, 2000)
                }
            })
        })
    }

    /**
     * Smooth scroll for navigation links
     */
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]')

        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href")
                if (href === "#") return

                e.preventDefault()

                const targetId = href.substring(1)
                const targetElement = document.getElementById(targetId)

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }
            })
        })
    }

    /**
     * Add scroll-based animation to cards and elements
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1"
                    entry.target.style.transform = "translateY(0)"
                    observer.unobserve(entry.target)
                }
            })
        }, observerOptions)

        // Observe feature cards
        const featureCards = document.querySelectorAll(".feature-card")
        featureCards.forEach((card, index) => {
            card.style.opacity = "0"
            card.style.transform = "translateY(20px)"
            card.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`
            observer.observe(card)
        })

        // Observe version cards
        const versionCards = document.querySelectorAll(".version-card")
        versionCards.forEach((card, index) => {
            card.style.opacity = "0"
            card.style.transform = "translateY(20px)"
            card.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`
            observer.observe(card)
        })

        // Observe installation steps
        const steps = document.querySelectorAll(".step")
        steps.forEach((step, index) => {
            step.style.opacity = "0"
            step.style.transform = "translateY(15px)"
            step.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`
            observer.observe(step)
        })

        // Observe screenshot cards
        const screenshotCards = document.querySelectorAll(".screenshot-card")
        screenshotCards.forEach((card, index) => {
            card.style.opacity = "0"
            card.style.transform = "translateY(20px)"
            card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`
            observer.observe(card)
        })
    }

    /**
     * Navbar scroll effect - border brightness changes
     */
    function initNavbarScroll() {
        const nav = document.querySelector(".nav")

        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset

            if (currentScroll > 50) {
                nav.style.borderBottomColor = "var(--color-border-hover)"
            } else {
                nav.style.borderBottomColor = "var(--color-border)"
            }
        })
    }

    /**
     * Language Management System (Single Button)
     */
    function initLanguageSystem() {
        const LANG_STORAGE_KEY = "user-language"
        const langToggle = document.getElementById("langToggle")
        const langIcon = langToggle?.querySelector(".lang-icon")

        function getUserLanguage() {
            const savedLang = localStorage.getItem(LANG_STORAGE_KEY)
            if (savedLang && (savedLang === "en" || savedLang === "zh")) {
                return savedLang
            }

            const browserLang = navigator.language || navigator.userLanguage
            if (browserLang.startsWith("zh")) {
                return "zh"
            }
            return "en"
        }

        function updateIcon(lang) {
            if (langIcon) {
                langIcon.textContent = lang === "en" ? "中文" : "EN"
            }
        }

        function applyLanguage(lang) {
            if (!translations || !translations[lang]) {
                console.error(`Language "${lang}" not found in translations`)
                return
            }

            const elements = document.querySelectorAll("[data-i18n]")
            elements.forEach((element) => {
                const key = element.getAttribute("data-i18n")
                if (translations[lang][key]) {
                    element.textContent = translations[lang][key]
                }
            })

            updateComplexElements(lang)
            updateIcon(lang)
            document.documentElement.setAttribute("lang", lang)
        }

        function updateFooterReleaseVersion(lang) {
            const el = document.getElementById("footerReleaseVersion")
            if (!el) {
                return
            }
            const meta = document.querySelector('meta[name="app-version"]')
            const v = meta?.getAttribute("content")?.trim() ?? ""
            const t = translations[lang] || translations.en
            const template =
                t.footerReleaseVersion ||
                translations.en.footerReleaseVersion ||
                ""
            el.textContent = template.replace("{version}", v)
        }

        function updateComplexElements(lang) {
            const t = translations[lang]

            updateFooterReleaseVersion(lang)

            const langPrefix = lang === "zh" ? "zh-CN" : "en"
            const greasyForkUrl = `https://greasyfork.org/${langPrefix}/scripts/551033-open-in-new-tab`
            document.querySelectorAll("[data-greasyfork-link]").forEach((el) => {
                el.href = greasyForkUrl
            })

            const copyButtons = document.querySelectorAll(".copy-btn")
            copyButtons.forEach((btn) => {
                if (
                    btn.textContent.includes("Copy") ||
                    btn.textContent.includes("复制")
                ) {
                    btn.textContent = t.btnCopyLink
                }
            })

            const codeHeaders = document.querySelectorAll(".code-header span")
            codeHeaders.forEach((span) => {
                if (
                    span.textContent.includes("Download") ||
                    span.textContent.includes("下载")
                ) {
                    span.textContent = t.installUserscriptDownload
                }
            })
        }

        function toggleLanguage() {
            const currentLang = document.documentElement.getAttribute("lang")
            const newLang = currentLang === "en" ? "zh" : "en"
            applyLanguage(newLang)
            localStorage.setItem(LANG_STORAGE_KEY, newLang)
        }

        const initialLang = getUserLanguage()
        applyLanguage(initialLang)

        if (langToggle) {
            langToggle.addEventListener("click", toggleLanguage)
        }
    }

    /**
     * Theme Management System (Single Icon)
     */
    function initThemeSystem() {
        const STORAGE_KEY = "user-theme"
        const themeToggle = document.getElementById("themeToggle")

        function getUserTheme() {
            const savedTheme = localStorage.getItem(STORAGE_KEY)
            if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
                return savedTheme
            }
            return "dark" // Default to dark
        }

        // Icon swap is handled purely via [data-theme] CSS selectors.
        function applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme)
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute("data-theme")
            const newTheme = currentTheme === "dark" ? "light" : "dark"
            applyTheme(newTheme)
            localStorage.setItem(STORAGE_KEY, newTheme)
        }

        const initialTheme = getUserTheme()
        applyTheme(initialTheme)

        if (themeToggle) {
            themeToggle.addEventListener("click", toggleTheme)
        }

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    const newTheme = e.matches ? "dark" : "light"
                    applyTheme(newTheme)
                }
            })
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function updateCopyrightYear() {
        const year = new Date().getFullYear()
        const footerCopyright = document.getElementById("footerCopyright")
        if (footerCopyright) {
            const currentLang = document.documentElement.getAttribute("lang") || "en"
            const suffix = currentLang === "zh"
                ? " Open In New Tab. 基于 MIT 许可证发布。"
                : " Open In New Tab. Released under MIT License."
            footerCopyright.innerHTML = `&copy; ${year}${suffix}`
        }
    }

    function initialize() {
        initLanguageSystem()
        initThemeSystem()
        initInstallTabs()
        initCopyButtons()
        initSmoothScroll()
        initScrollAnimations()
        initNavbarScroll()
        updateCopyrightYear()
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
