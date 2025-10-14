# Open In New Tab - Chrome Extension Version

A Chrome extension that forces all links to open in new tab using a whitelist-based approach with dark mode and internationalization support.

📖 **[Official Website](https://open-in-new-tab.vercel.app/)** | 🎯 **[Greasy Fork Script](https://greasyfork.org/zh-CN/scripts/551033-open-in-new-tab)** | 🌟 **[GitHub Repository](https://github.com/xiaowulang-turbo/OpenInNewTab)**

## Features

-   **Whitelist Mode**: Only applies to specified domains for better control and performance
-   **Dynamic Content Support**: Handles both existing and dynamically added links
-   **Security**: Adds `rel="noopener noreferrer"` for security
-   **Lightweight**: Minimal performance impact with efficient DOM monitoring
-   **User-Friendly Management**: Popup-based whitelist management
-   **Whitelist Manager**: Complete interface to view, add, modify, and remove domains
-   **Persistent Storage**: Uses Chrome's storage APIs to store user preferences
-   **Dark Mode Support**: Automatically adapts to system dark/light mode preferences
-   **Modern UI**: Clean, responsive design with smooth animations and hover effects
-   **Internationalization**: Automatic language detection (English/Chinese) based on browser settings

## Installation

### Option 1: Chrome Web Store (Coming Soon)

The extension will be available on Chrome Web Store soon. Stay tuned!

### Option 2: Developer Mode Installation

1. **Clone or download the project:**

    ```bash
    git clone https://github.com/xiaowulang-turbo/OpenInNewTab.git
    cd OpenInNewTab/extension
    ```

2. **Install the extension:**
    - Open Chrome and go to `chrome://extensions/`
    - Enable "Developer mode" (toggle in top right)
    - Click "Load unpacked"
    - Select the `extension` directory
    - The extension will be installed and ready to use

### Web Store Distribution

1. **Package the extension:**

    - Create a ZIP file containing all extension files
    - Ensure `manifest.json` is at the root level

2. **Submit to Chrome Web Store:**
    - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
    - Create a new item and upload your package
    - Fill in the required information
    - Submit for review

## Configuration

### Initial Setup

The extension comes with an empty default whitelist. Users can add domains through the popup interface.

### User Management

#### Quick Access

Click the extension icon in the browser toolbar to open the popup interface.

#### Adding Current Domain (Quick Add)

-   The popup automatically detects the current website domain
-   Click the green "Add" button next to the current domain
-   The domain is instantly added to your whitelist

#### Managing Your Whitelist

**Via Extension Popup:**

1. Click the extension icon in the browser toolbar
2. The popup shows all your whitelisted domains
3. **Add new domains**: Type a domain (e.g., `example.com`) in the input field and click "Add"
4. **Remove domains**: Click the red "Remove" button next to any domain
5. **View all domains**: See all your whitelisted domains in a clean, organized list

**Via Options Page:**

1. Click the settings icon (⚙️) in the popup
2. Click "More Options" button at the bottom
3. Access the full configuration page with:
    - Theme settings (Light/Dark/Auto)
    - Language settings (English/中文)
    - Complete whitelist management
    - Import/Export whitelist data

### Domain Matching

The extension supports both exact domain matching and subdomain matching:

-   `example.com` matches `example.com` exactly
-   `example.com` also matches `sub.example.com`, `deep.sub.example.com`, etc.

## How It Works

1. **Initialization**: Extension loads and registers content scripts
2. **Whitelist Check**: Checks if the current domain is in your personal whitelist
3. **Link Modification**: If whitelisted, modifies all existing links to open in new tabs
4. **Dynamic Monitoring**: Sets up a MutationObserver to handle dynamically added content
5. **Security Enhancement**: Adds security attributes (`rel="noopener noreferrer"`) to prevent security issues
6. **Persistent Storage**: Uses Chrome's storage APIs to save your whitelist preferences

## Architecture

### Extension Structure

```
/extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker
├── content.js             # Content script (link modification logic)
├── popup.html             # Popup interface
├── popup.js               # Popup functionality
├── popup.css              # Popup styling with dark mode support
└── icons/                 # Extension icons (16x16, 24x24, 32x32, 64x64, 128x128)
    ├── icon16.png
    ├── icon24.png
    ├── icon32.png
    ├── icon64.png
    └── icon128.png
```

### Component Responsibilities

-   **manifest.json**: Defines extension metadata, permissions, and structure
-   **background.js**: Service worker for extension lifecycle management
-   **content.js**: Injected into web pages to modify link behavior
-   **popup.html/js/css**: User interface for whitelist management
-   **icons/**: Extension icons for different sizes

## Language Support

The extension automatically detects your browser's language setting and displays the interface in the appropriate language:

-   **English** (Default): Used when browser language is not Chinese
-   **Chinese (中文)**: Used when browser language starts with 'zh' (e.g., zh-CN, zh-TW, zh-HK)

All user interface elements are internationalized including popup interface, notifications, and settings.

## Dark Mode Support

The extension popup automatically adapts to your system's dark/light mode preference:

-   **Light Mode**: Clean white interface with subtle shadows
-   **Dark Mode**: Dark theme with appropriate contrast for readability
-   **Smooth Transitions**: Seamless theme switching without jarring changes

## Security Considerations

-   The extension only runs on whitelisted domains
-   Uses `rel="noopener noreferrer"` to prevent the new page from accessing the original page
-   Avoids modifying download links (those with `download` attribute)
-   User data is stored locally using Chrome's secure storage APIs
-   Follows Chrome extension security best practices

## Browser Compatibility

-   ✅ Chrome 88+ (Manifest V3 support required)
-   ✅ Edge 88+ (Chromium-based)
-   ✅ Opera 74+ (Chromium-based)
-   ✅ Other Chromium-based browsers with Manifest V3 support

## API Mappings

| Tampermonkey API           | Chrome Extension API        | Purpose           |
| -------------------------- | --------------------------- | ----------------- |
| `GM_setValue()`            | `chrome.storage.sync.set()` | Data storage      |
| `GM_getValue()`            | `chrome.storage.sync.get()` | Data retrieval    |
| `GM_registerMenuCommand()` | Extension popup             | User interface    |
| Page DOM manipulation      | Content scripts             | Link modification |

## Development

### Building from Source

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd OpenInNewTab
    ```

2. **Load in developer mode:**

    - Open `chrome://extensions/`
    - Enable "Developer mode"
    - Click "Load unpacked"
    - Select the `extension` directory

3. **Make changes:**
    - Edit files in the `extension` directory
    - Reload the extension to see changes
    - Test functionality across different websites

### Testing

-   Test whitelist functionality on various websites
-   Verify dark mode adaptation
-   Test language switching
-   Ensure no conflicts with other extensions

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Make your changes in the appropriate directory (`userscript/` or `extension/`)
3. Test thoroughly
4. Submit a pull request

## Issues

If you encounter any issues or have suggestions, please create an issue on GitHub.

## Related Projects

-   [Userscript Version](../userscript/) - The same functionality as a Tampermonkey userscript
-   [Root README](../README.md) - Main project documentation
