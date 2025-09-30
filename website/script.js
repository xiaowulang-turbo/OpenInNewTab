/**
 * Open In New Tabs - Website JavaScript
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
                        "https://github.com/xiaowulang-turbo/OpenInNewTabs/blob/main/userscript/OpenInNewTabs.user.js"
                }

                try {
                    await navigator.clipboard.writeText(textToCopy)
                    const originalText = button.textContent
                    button.textContent = "Copied!"
                    button.style.background = "#4caf50"

                    setTimeout(() => {
                        button.textContent = originalText
                        button.style.background = ""
                    }, 2000)
                } catch (err) {
                    console.error("Failed to copy:", err)
                    button.textContent = "Failed"
                    setTimeout(() => {
                        button.textContent = "Copy Link"
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
     * Initialize all functionality when DOM is ready
     */
    function initialize() {
        initInstallTabs()
        initCopyButtons()
        initSmoothScroll()
        initScrollAnimations()
        initNavbarScroll()

        console.log("🚀 Open In New Tabs website loaded successfully!")
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
