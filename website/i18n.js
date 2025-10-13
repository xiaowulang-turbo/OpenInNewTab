/**
 * Internationalization (i18n) Configuration
 * Translations for English and Chinese
 */

const translations = {
    en: {
        // Navigation
        navHome: "Home",
        navFeatures: "Features",
        navVersions: "Versions",
        navInstall: "Installation",

        // Hero Section
        heroTitle: "Smart Link Management",
        heroTitleHighlight: "Your Way",
        heroSubtitle:
            "Force all links to open in new tab with intelligent whitelist control.",
        heroSubtitle2:
            "Available as Tampermonkey userscript and Chrome extension for opening each link in new tab.",
        btnGetStarted: "Get Started",
        btnViewGithub: "View on GitHub",
        badgeDarkMode: "✨ Dark Mode",
        badgeI18n: "🌍 i18n Support",
        badgeLightweight: "⚡ Lightweight",
        badgeSecure: "🔒 Secure",

        // Features Section
        featuresTitle: "Powerful Features",
        featuresSubtitle: "Everything you need for smart link management",

        featureWhitelistTitle: "Whitelist Mode",
        featureWhitelistDesc:
            "Only applies to specified domains for better control and performance. You decide which sites to enhance.",

        featureDynamicTitle: "Dynamic Content",
        featureDynamicDesc:
            "Handles both existing and dynamically added links using MutationObserver for real-time updates. Each link opens in new tab.",

        featureSecurityTitle: "Security First",
        featureSecurityDesc:
            'Adds rel="noopener noreferrer" to prevent security issues. Your browsing stays safe.',

        featureDarkModeTitle: "Dark Mode",
        featureDarkModeDesc:
            "Automatically adapts to system dark/light mode preferences with smooth transitions.",

        featureI18nTitle: "Internationalization",
        featureI18nDesc:
            "Auto language detection (English/Chinese) based on browser settings. More languages coming soon.",

        featureStorageTitle: "Persistent Storage",
        featureStorageDesc:
            "Your whitelist preferences are saved and synced across devices automatically.",

        // Versions Section
        versionsTitle: "Choose Your Version",
        versionsSubtitle: "Two implementations, same great features",

        versionUserscriptTitle: "Userscript Version",
        versionUserscriptDesc:
            "Perfect for quick testing, development, or users who prefer Tampermonkey/Greasemonkey.",
        versionUserscriptFeatures: "Features:",
        versionUserscriptBestFor: "Best for:",
        versionUserscriptBestForText: "Developers, power users, quick testing",
        btnInstallUserscript: "Install Userscript →",

        versionExtensionTitle: "Chrome Extension",
        versionExtensionDesc:
            "Native Chrome extension with better performance and seamless browser integration.",
        versionExtensionFeatures: "Features:",
        versionExtensionBestFor: "Best for:",
        versionExtensionBestForText:
            "Production use, end users, Web Store distribution",
        btnInstallExtension: "Install Extension →",
        badgeRecommended: "Recommended",

        // Comparison Table
        comparisonTitle: "Feature Comparison",
        comparisonFeature: "Feature",
        comparisonUserscript: "Userscript",
        comparisonExtension: "Extension",
        comparisonLinkManagement: "Link Management",
        comparisonWhitelist: "Whitelist Control",
        comparisonDarkMode: "Dark Mode",
        comparisonI18n: "Internationalization",
        comparisonInstallation: "Installation",
        comparisonInstallManual: "Manual Script",
        comparisonInstallOneClick: "One-Click",
        comparisonUpdates: "Updates",
        comparisonUpdatesManual: "Manual",
        comparisonUpdatesAuto: "Automatic",
        comparisonUIType: "UI Type",
        comparisonUIMenu: "Menu Commands",
        comparisonUIPopup: "Popup Interface",
        comparisonDistribution: "Distribution",
        comparisonDistGithub: "GitHub",
        comparisonDistWebStore: "Chrome Web Store",

        // Installation Section
        installTitle: "Quick Installation",
        tabUserscript: "🚀 Userscript",
        tabExtension: "🌐 Extension",

        installUserscriptStep1Title: "Install Tampermonkey",
        installUserscriptStep1Desc1: "Install the",
        installUserscriptStep1Desc2:
            "browser extension from your browser's extension store.",
        installUserscriptStep2Title: "One-Click Install",
        installUserscriptStep2Desc:
            "Click the install button below to go to Greasy Fork and install the script with one click.",
        installUserscriptBtnGreasyFork: "Install from Greasy Fork",
        installUserscriptBtnDirect: "Direct Install",
        installUserscriptStep3Title: "Start Using",
        installUserscriptStep3Desc:
            "Navigate to any website, open Tampermonkey menu to add domains to whitelist.",
        installUserscriptAlternative: "Alternative: Manual Installation",
        installUserscriptManualDesc:
            "If you prefer manual installation, download the script from GitHub and install it manually in Tampermonkey.",
        btnCopyLink: "Copy Link",
        btnCopied: "Copied!",
        btnCopyFailed: "Failed",

        installExtensionStep1Title: "Download Extension",
        installExtensionStep1Desc:
            "Clone or download the repository from GitHub",
        installExtensionStep2Title: "Enable Developer Mode",
        installExtensionStep2Desc: "Open Chrome → Go to",
        installExtensionStep2Desc2:
            '→ Enable "Developer mode" (toggle in top right)',
        installExtensionStep3Title: "Load Extension",
        installExtensionStep3Desc: 'Click "Load unpacked" → Select the',
        installExtensionStep3Desc2: "directory from the downloaded repository",
        installExtensionStep4Title: "Start Using",
        installExtensionStep4Desc:
            "Click the extension icon to open the popup and add domains to your whitelist",
        installExtensionNote: "💡 Note:",
        installExtensionNoteText:
            "The extension is currently available for developer mode installation. Chrome Web Store distribution coming soon!",

        // Screenshots Section
        screenshotsTitle: "Beautiful Interface",
        screenshotsSubtitle: "Modern UI with dark mode support",
        screenshotExtensionPopup: "Extension Popup",
        screenshotQuickAdd: "Quick add current domain",
        screenshotDarkMode: "Dark mode enabled",
        screenshotWhitelistManager: "Whitelist Manager",
        screenshotModalInterface: "Userscript modal interface",
        screenshotCaptionLight: "Chrome Extension - Light Mode",
        screenshotCaptionDark: "Chrome Extension - Dark Mode",
        screenshotCaptionUserscript: "Userscript - Modal Interface",

        // CTA Section
        ctaTitle: "Ready to Get Started?",
        ctaDesc:
            "Choose your preferred version and start managing your links smarter today.",
        btnInstallNow: "Install Now →",
        btnViewDocs: "View Documentation",

        // Footer
        footerDesc:
            "Smart link management with whitelist control. Available as userscript and extension.",
        footerQuickLinks: "Quick Links",
        footerGithubRepo: "GitHub Repository",
        footerReportIssues: "Report Issues",
        footerPrivacyPolicy: "Privacy Policy",
        footerLicense: "MIT License",
        footerResources: "Resources",
        footerUserscriptDocs: "Userscript Docs",
        footerExtensionDocs: "Extension Docs",
        footerMainDocs: "Main Documentation",
        footerCopyright: "© 2025 Open In New Tab. Released under MIT License.",
        footerMadeWith: "Made with ❤️ by",

        // Privacy Policy Page
        footerTitle: "Open In New Tab",
        privacyPolicyTitle: "Privacy Policy for Open In New Tab",
        privacyLastUpdated: "Last updated:",
        privacyDataCollectionTitle: "Data Collection",
        privacyDataCollectionDesc:
            "Open In New Tab does not collect, store, or transmit any personal data to external servers.",
        privacyLocalStorageTitle: "Local Storage",
        privacyLocalStorageDesc1:
            "The extension uses Chrome's local storage (chrome.storage.sync) to save:",
        privacyLocalStorageItem1: "User's whitelist of domain names",
        privacyLocalStorageDesc2:
            "This data is stored locally on your device and synchronized across your Chrome browsers if you're signed in. We do not have access to this data.",
        privacyPermissionsTitle: "Permissions",
        privacyPermStorage: "Used to save your whitelist preferences locally",
        privacyPermActiveTab:
            "Used to detect current tab's domain for quick-add feature",
        privacyPermScripting:
            "Used to inject content scripts on whitelisted domains",
        privacyPermHost: "Required to modify links on whitelisted websites",
        privacyThirdPartyTitle: "Third-Party Services",
        privacyThirdPartyDesc:
            "This extension does not use any third-party services, analytics, or tracking tools.",
        privacyChangesTitle: "Changes to This Policy",
        privacyChangesDesc:
            "We may update this privacy policy from time to time. Changes will be posted on this page.",
        privacyContactTitle: "Contact",
        privacyContactDesc:
            "For questions about this privacy policy, please visit:",
        privacyBackHome: "Back to Home",
    },

    zh: {
        // Navigation
        navHome: "首页",
        navFeatures: "功能特性",
        navVersions: "版本选择",
        navInstall: "安装指南",

        // Hero Section
        heroTitle: "智能链接管理",
        heroTitleHighlight: "随心所控",
        heroSubtitle: "通过智能白名单控制，强制每个链接在新标签页打开。",
        heroSubtitle2: "提供 Tampermonkey 用户脚本和 Chrome 扩展两个版本。",
        btnGetStarted: "立即开始",
        btnViewGithub: "查看 GitHub",
        badgeDarkMode: "✨ 深色模式",
        badgeI18n: "🌍 国际化支持",
        badgeLightweight: "⚡ 轻量级",
        badgeSecure: "🔒 安全可靠",

        // Features Section
        featuresTitle: "强大功能",
        featuresSubtitle: "智能链接管理所需的一切功能",

        featureWhitelistTitle: "白名单模式",
        featureWhitelistDesc:
            "仅应用于指定域名，实现更好的控制和性能。由你决定要增强哪些网站。",

        featureDynamicTitle: "动态内容",
        featureDynamicDesc:
            "使用 MutationObserver 处理现有和动态添加的链接，实现实时更新。",

        featureSecurityTitle: "安全优先",
        featureSecurityDesc:
            '自动添加 rel="noopener noreferrer" 属性以防止安全问题。让你的浏览更安全。',

        featureDarkModeTitle: "深色模式",
        featureDarkModeDesc:
            "自动适配系统深色/浅色模式偏好，并提供平滑过渡动画。",

        featureI18nTitle: "国际化",
        featureI18nDesc:
            "基于浏览器设置自动检测语言（英文/中文）。更多语言即将推出。",

        featureStorageTitle: "持久化存储",
        featureStorageDesc: "你的白名单偏好设置会自动保存并跨设备同步。",

        // Versions Section
        versionsTitle: "选择你的版本",
        versionsSubtitle: "两种实现方式，同样强大的功能",

        versionUserscriptTitle: "用户脚本版本",
        versionUserscriptDesc:
            "非常适合快速测试、开发或偏好使用 Tampermonkey/Greasemonkey 的用户。",
        versionUserscriptFeatures: "功能特性：",
        versionUserscriptBestFor: "最适合：",
        versionUserscriptBestForText: "开发者、高级用户、快速测试",
        btnInstallUserscript: "安装用户脚本 →",

        versionExtensionTitle: "Chrome 扩展",
        versionExtensionDesc:
            "原生 Chrome 扩展，具有更好的性能和无缝的浏览器集成。",
        versionExtensionFeatures: "功能特性：",
        versionExtensionBestFor: "最适合：",
        versionExtensionBestForText: "生产使用、普通用户、Web Store 分发",
        btnInstallExtension: "安装扩展 →",
        badgeRecommended: "推荐",

        // Comparison Table
        comparisonTitle: "功能对比",
        comparisonFeature: "功能",
        comparisonUserscript: "用户脚本",
        comparisonExtension: "扩展",
        comparisonLinkManagement: "链接管理",
        comparisonWhitelist: "白名单控制",
        comparisonDarkMode: "深色模式",
        comparisonI18n: "国际化",
        comparisonInstallation: "安装方式",
        comparisonInstallManual: "手动脚本",
        comparisonInstallOneClick: "一键安装",
        comparisonUpdates: "更新",
        comparisonUpdatesManual: "手动",
        comparisonUpdatesAuto: "自动",
        comparisonUIType: "界面类型",
        comparisonUIMenu: "菜单命令",
        comparisonUIPopup: "弹出界面",
        comparisonDistribution: "分发方式",
        comparisonDistGithub: "GitHub",
        comparisonDistWebStore: "Chrome 应用商店",

        // Installation Section
        installTitle: "快速安装",
        tabUserscript: "🚀 用户脚本",
        tabExtension: "🌐 扩展程序",

        installUserscriptStep1Title: "安装 Tampermonkey",
        installUserscriptStep1Desc1: "安装",
        installUserscriptStep1Desc2: "浏览器扩展。",
        installUserscriptStep2Title: "一键安装",
        installUserscriptStep2Desc:
            "点击下方安装按钮前往 Greasy Fork，一键安装脚本。",
        installUserscriptBtnGreasyFork: "从 Greasy Fork 安装",
        installUserscriptBtnDirect: "直接安装",
        installUserscriptStep3Title: "开始使用",
        installUserscriptStep3Desc:
            "访问任意网站，打开 Tampermonkey 菜单将域名添加到白名单。",
        installUserscriptAlternative: "备选方案：手动安装",
        installUserscriptManualDesc:
            "如果您偏好手动安装，可以从 GitHub 下载脚本并在 Tampermonkey 中手动安装。",
        btnCopyLink: "复制链接",
        btnCopied: "已复制！",
        btnCopyFailed: "复制失败",

        installExtensionStep1Title: "下载扩展",
        installExtensionStep1Desc: "从 GitHub 克隆或下载仓库",
        installExtensionStep2Title: "启用开发者模式",
        installExtensionStep2Desc: "打开 Chrome → 访问",
        installExtensionStep2Desc2: '→ 启用"开发者模式"（右上角开关）',
        installExtensionStep3Title: "加载扩展",
        installExtensionStep3Desc:
            '点击"加载已解压的扩展程序" → 选择下载的仓库中的',
        installExtensionStep3Desc2: "目录",
        installExtensionStep4Title: "开始使用",
        installExtensionStep4Desc:
            "点击扩展图标打开弹出窗口，将域名添加到你的白名单",
        installExtensionNote: "💡 注意：",
        installExtensionNoteText:
            "扩展目前仅支持开发者模式安装。Chrome 应用商店版本即将推出！",

        // Screenshots Section
        screenshotsTitle: "精美界面",
        screenshotsSubtitle: "支持深色模式的现代化 UI",
        screenshotExtensionPopup: "扩展弹窗",
        screenshotQuickAdd: "快速添加当前域名",
        screenshotDarkMode: "深色模式已启用",
        screenshotWhitelistManager: "白名单管理器",
        screenshotModalInterface: "用户脚本模态界面",
        screenshotCaptionLight: "Chrome 扩展 - 浅色模式",
        screenshotCaptionDark: "Chrome 扩展 - 深色模式",
        screenshotCaptionUserscript: "用户脚本 - 模态界面",

        // CTA Section
        ctaTitle: "准备好开始了吗？",
        ctaDesc: "选择你偏好的版本，立即开始更智能地管理你的链接。",
        btnInstallNow: "立即安装 →",
        btnViewDocs: "查看文档",

        // Footer
        footerDesc: "智能链接管理与白名单控制。提供用户脚本和扩展两个版本。",
        footerQuickLinks: "快速链接",
        footerGithubRepo: "GitHub 仓库",
        footerReportIssues: "报告问题",
        footerPrivacyPolicy: "隐私政策",
        footerLicense: "MIT 许可证",
        footerResources: "资源",
        footerUserscriptDocs: "用户脚本文档",
        footerExtensionDocs: "扩展文档",
        footerMainDocs: "主文档",
        footerCopyright: "© 2025 Open In New Tab. 基于 MIT 许可证发布。",
        footerMadeWith: "用 ❤️ 制作 by",

        // Privacy Policy Page
        footerTitle: "Open In New Tab",
        privacyPolicyTitle: "Open In New Tab 隐私政策",
        privacyLastUpdated: "最后更新：",
        privacyDataCollectionTitle: "数据收集",
        privacyDataCollectionDesc:
            "Open In New Tab 不会收集、存储或向外部服务器传输任何个人数据。",
        privacyLocalStorageTitle: "本地存储",
        privacyLocalStorageDesc1:
            "扩展使用 Chrome 的本地存储 (chrome.storage.sync) 来保存：",
        privacyLocalStorageItem1: "用户的白名单域名",
        privacyLocalStorageDesc2:
            "这些数据存储在您的设备本地，如果您已登录 Chrome，数据会在您的浏览器之间同步。我们无法访问这些数据。",
        privacyPermissionsTitle: "权限说明",
        privacyPermStorage: "用于在本地保存您的白名单配置",
        privacyPermActiveTab: "用于检测当前标签页的域名，实现快速添加功能",
        privacyPermScripting: "用于向白名单域名的页面注入内容脚本",
        privacyPermHost: "用于修改白名单网站上的链接",
        privacyThirdPartyTitle: "第三方服务",
        privacyThirdPartyDesc:
            "本扩展不使用任何第三方服务、分析工具或跟踪工具。",
        privacyChangesTitle: "政策更新",
        privacyChangesDesc:
            "我们可能会不时更新此隐私政策。更新内容将发布在本页面。",
        privacyContactTitle: "联系我们",
        privacyContactDesc: "如有关于此隐私政策的问题，请访问：",
        privacyBackHome: "返回首页",
    },
}

// Export to global scope for use in script.js
window.translations = translations
