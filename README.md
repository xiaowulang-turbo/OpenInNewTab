# Open In New Tabs

A Tampermonkey userscript that forces all links to open in new tabs using a whitelist-based approach.

## Features

-   **Whitelist Mode**: Only applies to specified domains for better control and performance
-   **Dynamic Content Support**: Handles both existing and dynamically added links
-   **Security**: Adds `rel="noopener noreferrer"` for security
-   **Lightweight**: Minimal performance impact with efficient DOM monitoring
-   **User-Friendly Management**: Menu-based whitelist management
-   **Whitelist Manager**: Complete interface to view, add, modify, and remove domains
-   **Persistent Storage**: Uses Tampermonkey's GM\_\* APIs to store user preferences

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click the Tampermonkey icon in your browser toolbar
3. Select "Create a new script"
4. Replace the default content with the code from `OpenInNewTabs.user.js`
5. Save the script (Ctrl+S or File → Save)

## Configuration

### Initial Setup

The script comes with a set of default whitelisted domains:

-   github.com
-   stackoverflow.com
-   wikipedia.org
-   baidu.com
-   google.com
-   twitter.com
-   facebook.com
-   instagram.com
-   youtube.com

### User Management

#### Adding Current Domain

-   In any webpage, right-click the Tampermonkey icon in your browser toolbar
-   Select "添加白名单" from the menu
-   The current domain will be instantly added to your whitelist
-   You'll see an alert confirming the addition

#### Managing Your Whitelist

1. **Via Tampermonkey Menu**: Right-click the Tampermonkey icon in your browser toolbar
2. Select "管理白名单" from the menu
3. A modal will open showing all your whitelisted domains
4. **Add new domains**: Type a domain (e.g., `example.com`) in the input field and click "添加"
5. **Remove domains**: Click the red "移除" button next to any domain
6. **View all domains**: See all your whitelisted domains in a clean, organized list

### Domain Matching

The script supports both exact domain matching and subdomain matching:

-   `example.com` matches `example.com` exactly
-   `example.com` also matches `sub.example.com`, `deep.sub.example.com`, etc.

## How It Works

1. **Initialization**: Script loads and registers a menu command for whitelist management
2. **Button Creation**: Adds a floating button for quick domain addition
3. **Whitelist Check**: Checks if the current domain is in your personal whitelist
4. **Link Modification**: If whitelisted, modifies all existing links to open in new tabs
5. **Dynamic Monitoring**: Sets up a MutationObserver to handle dynamically added content
6. **Security Enhancement**: Adds security attributes (`rel="noopener noreferrer"`) to prevent security issues
7. **Persistent Storage**: Uses Tampermonkey's GM\_\* APIs to save your whitelist preferences

## User Interface

### Whitelist Management Modal

-   **Access**: Via Tampermonkey menu → "管理白名单"
-   **Features**:
    -   View all whitelisted domains in a clean list
    -   Add new domains with a simple input field
    -   Remove domains with individual "移除" buttons
    -   Real-time updates when making changes
    -   Keyboard support (Enter key to add domains)
-   **Design**: Clean, modern interface with intuitive controls

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
