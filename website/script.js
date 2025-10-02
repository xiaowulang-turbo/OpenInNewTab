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

                // Remove active class from all tabs and panels
                tabs.forEach((t) => t.classList.remove("active"))
                panels.forEach((p) => p.classList.remove("active"))

                // Add active class to clicked tab and corresponding panel
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

                // Get current language for button text
                const currentLang =
                    localStorage.getItem("user-language") ||
                    (navigator.language?.startsWith("zh") ? "zh" : "en")
                const t = translations[currentLang]

                try {
                    await navigator.clipboard.writeText(textToCopy)
                    const originalText = button.textContent
                    button.textContent = t.btnCopied
                    button.style.background = "#4caf50"

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

                // Skip if it's just "#"
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
     * Add scroll-based animation to feature cards
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
            card.style.transform = "translateY(30px)"
            card.style.transition = `all 0.6s ease ${index * 0.1}s`
            observer.observe(card)
        })

        // Observe version cards
        const versionCards = document.querySelectorAll(".version-card")
        versionCards.forEach((card, index) => {
            card.style.opacity = "0"
            card.style.transform = "translateY(30px)"
            card.style.transition = `all 0.6s ease ${index * 0.2}s`
            observer.observe(card)
        })

        // Observe installation steps
        const steps = document.querySelectorAll(".step")
        steps.forEach((step, index) => {
            step.style.opacity = "0"
            step.style.transform = "translateX(-30px)"
            step.style.transition = `all 0.6s ease ${index * 0.1}s`
            observer.observe(step)
        })
    }

    /**
     * Add navbar background on scroll
     */
    function initNavbarScroll() {
        const nav = document.querySelector(".nav")
        let lastScroll = 0

        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset

            if (currentScroll > 100) {
                nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
            } else {
                nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)"
            }

            lastScroll = currentScroll
        })
    }

    /**
     * Language Management System
     */
    function initLanguageSystem() {
        const LANG_STORAGE_KEY = "user-language"
        const dropdownBtn = document.getElementById("langDropdownBtn")
        const dropdownMenu = document.getElementById("langDropdownMenu")
        const langCurrent = document.getElementById("langCurrent")
        const langOptions = document.querySelectorAll(".lang-option")

        /**
         * Get user's language preference
         * Priority: localStorage > browser language > English (default)
         */
        function getUserLanguage() {
            // Check localStorage first
            const savedLang = localStorage.getItem(LANG_STORAGE_KEY)
            if (savedLang && (savedLang === "en" || savedLang === "zh")) {
                return savedLang
            }

            // Check browser language
            const browserLang = navigator.language || navigator.userLanguage
            if (browserLang.startsWith("zh")) {
                return "zh"
            }
            return "en"
        }

        /**
         * Toggle dropdown menu
         */
        function toggleDropdown() {
            dropdownMenu.classList.toggle("show")
            dropdownBtn.classList.toggle("active")
        }

        /**
         * Close dropdown menu
         */
        function closeDropdown() {
            dropdownMenu.classList.remove("show")
            dropdownBtn.classList.remove("active")
        }

        /**
         * Apply language to all elements with data-i18n attribute
         */
        function applyLanguage(lang) {
            if (!translations || !translations[lang]) {
                console.error(`Language "${lang}" not found in translations`)
                return
            }

            // Update all elements with data-i18n attribute
            const elements = document.querySelectorAll("[data-i18n]")
            elements.forEach((element) => {
                const key = element.getAttribute("data-i18n")
                if (translations[lang][key]) {
                    element.textContent = translations[lang][key]
                }
            })

            // Handle special cases with complex HTML structures
            updateComplexElements(lang)

            // Update current language display
            langCurrent.textContent = lang === "zh" ? "中文" : "EN"

            // Update active state of language options
            langOptions.forEach((option) => {
                if (option.getAttribute("data-lang") === lang) {
                    option.classList.add("active")
                } else {
                    option.classList.remove("active")
                }
            })

            // Update HTML lang attribute
            document.documentElement.setAttribute("lang", lang)

            console.log(`🌍 Language switched to: ${lang}`)
        }

        /**
         * Update elements with complex HTML structures
         */
        function updateComplexElements(lang) {
            const t = translations[lang]

            // Update copy button text if needed
            const copyButtons = document.querySelectorAll(".copy-btn")
            copyButtons.forEach((btn) => {
                if (
                    btn.textContent.includes("Copy") ||
                    btn.textContent.includes("复制")
                ) {
                    btn.textContent = t.btnCopyLink
                }
            })

            // Update code header
            const codeHeaders = document.querySelectorAll(".code-header span")
            codeHeaders.forEach((span) => {
                if (
                    span.textContent.includes("Download") ||
                    span.textContent.includes("下载")
                ) {
                    span.textContent = t.installUserscriptDownload
                }
            })

            // Update install note
            const installNotes = document.querySelectorAll(".install-note")
            installNotes.forEach((note) => {
                const strong = note.querySelector("strong")
                if (strong) {
                    strong.textContent = t.installExtensionNote
                    const textNode = Array.from(note.childNodes).find(
                        (node) => node.nodeType === Node.TEXT_NODE
                    )
                    if (textNode) {
                        textNode.textContent = " " + t.installExtensionNoteText
                    }
                }
            })
        }

        /**
         * Handle language switch
         */
        function handleLanguageSwitch(lang) {
            // Apply language
            applyLanguage(lang)

            // Save to localStorage
            localStorage.setItem(LANG_STORAGE_KEY, lang)

            // Close dropdown
            closeDropdown()
        }

        // Initialize language on page load
        const initialLang = getUserLanguage()
        applyLanguage(initialLang)

        // Toggle dropdown when button is clicked
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            toggleDropdown()
        })

        // Add click event listeners to language options
        langOptions.forEach((option) => {
            option.addEventListener("click", (e) => {
                e.stopPropagation()
                const lang = option.getAttribute("data-lang")
                handleLanguageSwitch(lang)
            })
        })

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (
                !dropdownBtn.contains(e.target) &&
                !dropdownMenu.contains(e.target)
            ) {
                closeDropdown()
            }
        })

        // Close dropdown on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeDropdown()
            }
        })

        console.log(`🌍 Language initialized: ${initialLang}`)
    }

    /**
     * Theme Management System
     */
    function initThemeSystem() {
        const STORAGE_KEY = "user-theme"
        const themeToggle = document.getElementById("themeToggle")

        /**
         * Get user's theme preference
         * Priority: localStorage > system preference > light (default)
         */
        function getUserTheme() {
            // Check localStorage first
            const savedTheme = localStorage.getItem(STORAGE_KEY)
            if (savedTheme) {
                return savedTheme
            }

            // Check system preference
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
            return prefersDark ? "dark" : "light"
        }

        /**
         * Apply theme to document
         */
        function applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme)

            // Update checkbox state
            themeToggle.checked = theme === "dark"
        }

        /**
         * Handle theme toggle
         */
        function handleThemeChange() {
            const newTheme = themeToggle.checked ? "dark" : "light"

            // Apply new theme
            document.documentElement.setAttribute("data-theme", newTheme)

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, newTheme)

            console.log(`🎨 Theme switched to: ${newTheme} mode`)
        }

        // Initialize theme on page load
        const initialTheme = getUserTheme()
        applyTheme(initialTheme)

        // Add change event listener for checkbox
        themeToggle.addEventListener("change", handleThemeChange)

        // Listen for system theme changes (only if user hasn't manually set theme)
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                // Only auto-switch if no manual preference saved
                if (!localStorage.getItem(STORAGE_KEY)) {
                    const newTheme = e.matches ? "dark" : "light"
                    applyTheme(newTheme)
                    console.log(
                        `🎨 System theme changed to: ${newTheme} mode (auto)`
                    )
                }
            })

        console.log(`🎨 Theme initialized: ${initialTheme} mode`)
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function initialize() {
        initLanguageSystem()
        initThemeSystem()
        initInstallTabs()
        initCopyButtons()
        initSmoothScroll()
        initScrollAnimations()
        initNavbarScroll()

        console.log("🚀 Open In New Tab website loaded successfully!")
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
