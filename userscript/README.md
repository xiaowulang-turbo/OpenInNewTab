# Open In New Tab - Userscript Version

A Tampermonkey userscript that forces all links to open in new tab using a whitelist-based approach with dark mode and internationalization support.

📖 **[Official Website](https://open-in-new-tab.vercel.app/)** | 🎯 **[Install from Greasy Fork](https://greasyfork.org/zh-CN/scripts/551033-open-in-new-tab)** | 🌟 **[GitHub Repository](https://github.com/xiaowulang-turbo/OpenInNewTab)**

## Features

-   **Whitelist Mode**: Only applies to specified domains for better control and performance
-   **Dynamic Content Support**: Handles both existing and dynamically added links
-   **Security**: Adds `rel="noopener noreferrer"` for security
-   **Lightweight**: Minimal performance impact with efficient DOM monitoring
-   **User-Friendly Management**: Menu-based whitelist management
-   **Whitelist Manager**: Complete interface to view, add, modify, and remove domains
-   **Persistent Storage**: Uses Tampermonkey's GM\_\* APIs to store user preferences
-   **Dark Mode Support**: Automatically adapts to system dark/light mode preferences
-   **Modern UI**: Clean, responsive design with smooth animations and hover effects
-   **Internationalization**: Automatic language detection (English/Chinese) based on browser settings

## Installation

### Option 1: Install from Greasy Fork (Recommended)

1. **Install Tampermonkey:**

    - [Chrome/Edge](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
    - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. **Install the script:**
    - Visit [Greasy Fork](https://greasyfork.org/zh-CN/scripts/551033-open-in-new-tab)
    - Click the green "Install this script" button
    - Tampermonkey will open with the script details
    - Click "Install" to complete

### Option 2: Manual Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click the Tampermonkey icon in your browser toolbar
3. Select "Create a new script"
4. Copy the code from `OpenInNewTab.user.js`
5. Paste it into the editor
6. Save the script (Ctrl+S or File → Save)

## Configuration

### Initial Setup

The script comes with a set of default whitelisted domains (currently empty). You can modify the `DEFAULT_DOMAINS` array if needed.

### User Management

#### Quick Access via Menu

Right-click the Tampermonkey icon in your browser toolbar to access script commands.

#### Adding Current Domain (Quick Add)

1. Visit any website you want to add to whitelist
2. Right-click the Tampermonkey icon in your browser toolbar
3. Select "添加当前网站到白名单" (or "Add Current Site to Whitelist" in English)
4. The current domain will be instantly added
5. A notification will confirm the addition

#### Managing Your Whitelist

1. **Open Whitelist Manager:**

    - Right-click the Tampermonkey icon
    - Select "管理白名单" (or "Manage Whitelist" in English)
    - A modal dialog will open

2. **In the Whitelist Manager:**
    - **View all domains**: See your complete whitelist in a clean, organized list
    - **Add new domains**: Type a domain (e.g., `example.com`) and click "添加" / "Add"
    - **Remove domains**: Click the red "移除" / "Remove" button next to any domain
    - **Close**: Click the × button or click outside the modal

### Domain Matching

The script supports both exact domain matching and subdomain matching:

-   `example.com` matches `example.com` exactly
-   `example.com` also matches `sub.example.com`, `deep.sub.example.com`, etc.

## How It Works

1. **Initialization**: Script loads and registers menu commands for whitelist management
2. **Whitelist Check**: Checks if the current domain is in your personal whitelist
3. **Link Modification**: If whitelisted, modifies all existing links to open in new tabs
4. **Dynamic Monitoring**: Sets up a MutationObserver to handle dynamically added content
5. **Security Enhancement**: Adds security attributes (`rel="noopener noreferrer"`) to prevent security issues
6. **Persistent Storage**: Uses Tampermonkey's GM\_\* APIs to save your whitelist preferences

## Language Support

The script automatically detects your browser's language setting and displays the interface in the appropriate language:

-   **English** (Default): Used when browser language is not Chinese
-   **Chinese (中文)**: Used when browser language starts with 'zh' (e.g., zh-CN, zh-TW, zh-HK)

All user interface elements are internationalized including menu commands, modal dialogs, notifications, and domain displays.

## Dark Mode Support

The whitelist management interface automatically adapts to your system's dark/light mode preference:

-   **Light Mode**: Clean white interface with subtle shadows
-   **Dark Mode**: Dark theme with appropriate contrast for readability
-   **Smooth Transitions**: Seamless theme switching without jarring changes

## Security Considerations

-   The script only runs on whitelisted domains
-   Uses `rel="noopener noreferrer"` to prevent the new page from accessing the original page
-   Avoids modifying download links (those with `download` attribute)
-   User data is stored locally using Tampermonkey's secure storage APIs

## Browser Compatibility

-   Chrome/Chromium (with Tampermonkey)
-   Firefox (with Tampermonkey or Greasemonkey)
-   Safari (with Tampermonkey)
-   Edge (with Tampermonkey)

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Issues

If you encounter any issues or have suggestions, please create an issue on GitHub.

## Related Projects

-   [Chrome Extension Version](../extension/) - The same functionality as a browser extension
-   [Root README](../README.md) - Main project documentation
