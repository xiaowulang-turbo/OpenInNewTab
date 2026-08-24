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
            "Available as Chrome extension and Tampermonkey userscript for opening each link in new tab.",
        btnGetStarted: "Get Started",
        btnViewGithub: "View on GitHub",
        badgeDarkMode: "Dark Mode",
        badgeI18n: "i18n Support",
        badgeLightweight: "Lightweight",
        badgeSecure: "Secure",

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
        versionUserscriptFeature1: "Menu-based management",
        versionUserscriptFeature2: "GM_* APIs for storage",
        versionUserscriptFeature3: "Modal interface",
        versionUserscriptFeature4: "Cross-browser support",
        versionUserscriptFeature5: "Easy to customize",
        versionUserscriptBestFor: "Best for:",
        versionUserscriptBestForText: "Developers, power users, quick testing",
        btnInstallUserscript: "Install Userscript →",

        versionExtensionTitle: "Chrome Extension",
        versionExtensionDesc:
            "Native Chrome extension with better performance and seamless browser integration.",
        versionExtensionFeatures: "Features:",
        versionExtensionFeature1: "Modern popup interface",
        versionExtensionFeature2: "Quick add current domain",
        versionExtensionFeature3: "chrome.storage sync",
        versionExtensionFeature4: "Auto-updates (Web Store)",
        versionExtensionFeature5: "Better performance",
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
        tabUserscript: "Userscript",
        tabExtension: "Extension",

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

        installExtensionStep1Title: "Visit Web Store",
        installExtensionStep1Desc: "Go to the official Chrome Web Store page.",
        installExtensionStep2Title: "Add to Chrome",
        installExtensionStep2Desc: "Click 'Add to Chrome' to install instantly.",
        installExtensionStep3Title: "Start Using",
        installExtensionStep3Desc: "Click the extension icon to manage your whitelist.",
        installExtensionStep4Title: "",
        installExtensionStep4Desc: "",
        installExtensionNote: "Tip:",
        installExtensionNoteText: "The extension is now available for one-click installation from the Chrome Web Store.",

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
            "Smart link management with whitelist control. Available as extension and userscript.",
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
        footerReleaseVersion: "Release v{version}",
        footerMadeWith: "Made with ❤️ by",

        // Privacy Policy Page
        footerTitle: "Open In New Tab",
        privacyPolicyTitle: "Privacy Policy for Open In New Tab",
        privacyLastUpdated: "Last updated:",
        privacyDataCollectionTitle: "Data Collection",
        privacyDataCollectionDesc:
            "Open In New Tab does not collect, store, or transmit any personal data to external servers.",
        privacySyncStorageTitle: "Chrome Sync Storage",
        privacySyncStorageDesc1:
            "The extension uses Chrome sync storage (chrome.storage.sync) to save these five fields:",
        privacySyncStorageItem1:
            "userWhitelist — your whitelist of domain names",
        privacySyncStorageItem2:
            "openInBackground — whether new tabs open in the background",
        privacySyncStorageItem3:
            "userTheme — your theme preference (light, dark, or auto)",
        privacySyncStorageItem4: "userLanguage — your language preference",
        privacySyncStorageItem5:
            "updateNoticeEnabled — whether to show update notices after extension updates",
        privacySyncStorageDesc2:
            "This data stays in Chrome's storage. When you're signed in to Chrome, Chrome may synchronize it across your signed-in browsers. We do not have access to this data.",
        privacyPermissionsTitle: "Permissions",
        privacyPermStorage:
            "Used to save the five fields listed above via chrome.storage.sync",
        privacyPermActiveTab:
            "Used to detect current tab's domain for quick-add feature",
        privacyPermHost:
            "Matches *://*/* for static content scripts. They load on matching pages, but modify links and intercept clicks only on whitelisted domains.",
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
        heroSubtitle2: "提供 Chrome 扩展和 Tampermonkey 用户脚本两个版本。",
        btnGetStarted: "立即开始",
        btnViewGithub: "查看仓库",
        badgeDarkMode: "深色模式",
        badgeI18n: "国际化支持",
        badgeLightweight: "轻量级",
        badgeSecure: "安全可靠",

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
        versionUserscriptFeature1: "基于菜单的管理",
        versionUserscriptFeature2: "GM_* 存储 API",
        versionUserscriptFeature3: "模态界面",
        versionUserscriptFeature4: "跨浏览器支持",
        versionUserscriptFeature5: "易于自定义",
        versionUserscriptBestFor: "最适合：",
        versionUserscriptBestForText: "开发者、高级用户、快速测试",
        btnInstallUserscript: "安装用户脚本 →",

        versionExtensionTitle: "Chrome 扩展",
        versionExtensionDesc:
            "原生 Chrome 扩展，具有更好的性能和无缝的浏览器集成。",
        versionExtensionFeatures: "功能特性：",
        versionExtensionFeature1: "现代化弹窗界面",
        versionExtensionFeature2: "快速添加当前域名",
        versionExtensionFeature3: "chrome.storage 同步",
        versionExtensionFeature4: "自动更新（应用商店）",
        versionExtensionFeature5: "更好的性能",
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
        tabUserscript: "用户脚本",
        tabExtension: "扩展程序",

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

        installExtensionStep1Title: "访问应用商店",
        installExtensionStep1Desc: "前往 Chrome 应用商店官方页面。",
        installExtensionStep2Title: "添加至 Chrome",
        installExtensionStep2Desc: '点击"添加至 Chrome"即可完成一键安装。',
        installExtensionStep3Title: "开始使用",
        installExtensionStep3Desc: "点击浏览器右上角的扩展图标即可管理白名单。",
        installExtensionStep4Title: "",
        installExtensionStep4Desc: "",
        installExtensionNote: "提示：",
        installExtensionNoteText: "扩展程序现已正式上线 Chrome 应用商店，推荐使用一键安装。",

        // Screenshots Section
        screenshotsTitle: "精美界面",
        screenshotsSubtitle: "支持深色模式的现代化 UI",
        screenshotExtensionPopup: "扩展弹窗",
        screenshotQuickAdd: "快速添加当前域名",
        screenshotDarkMode: "深色模式已支持",
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
        footerDesc: "智能链接管理与白名单控制。提供扩展和用户脚本两个版本。",
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
        footerReleaseVersion: "当前发布版本 v{version}",
        footerMadeWith: "用 ❤️ 制作 by",

        // Privacy Policy Page
        footerTitle: "Open In New Tab",
        privacyPolicyTitle: "Open In New Tab 隐私政策",
        privacyLastUpdated: "最后更新：",
        privacyDataCollectionTitle: "数据收集",
        privacyDataCollectionDesc:
            "Open In New Tab 不会收集、存储或向外部服务器传输任何个人数据。",
        privacySyncStorageTitle: "Chrome 同步存储",
        privacySyncStorageDesc1:
            "扩展使用 Chrome 同步存储（chrome.storage.sync）保存以下五个字段：",
        privacySyncStorageItem1:
            "userWhitelist — 您的白名单域名",
        privacySyncStorageItem2:
            "openInBackground — 是否在后台打开新标签页",
        privacySyncStorageItem3:
            "userTheme — 您的主题偏好（亮色、暗色或自动）",
        privacySyncStorageItem4: "userLanguage — 您的语言偏好",
        privacySyncStorageItem5:
            "updateNoticeEnabled — 更新扩展后是否显示更新说明",
        privacySyncStorageDesc2:
            "这些数据保存在 Chrome 存储中。登录 Chrome 后，Chrome 可能会在您登录的浏览器之间同步这些数据。我们无法访问这些数据。",
        privacyPermissionsTitle: "权限说明",
        privacyPermStorage:
            "用于通过 chrome.storage.sync 保存上述五个字段",
        privacyPermActiveTab: "用于检测当前标签页的域名，实现快速添加功能",
        privacyPermHost:
            "匹配 *://*/*，用于加载静态内容脚本。脚本会在匹配的页面加载，但仅在白名单域名上修改链接和拦截点击。",
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
