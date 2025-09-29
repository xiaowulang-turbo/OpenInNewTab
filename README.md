# Open In New Tabs

A Tampermonkey userscript that forces all links to open in new tabs using a whitelist-based approach.

## Features

-   **Whitelist Mode**: Only applies to specified domains for better control and performance
-   **Dynamic Content Support**: Handles both existing and dynamically added links
-   **Security**: Adds `rel="noopener noreferrer"` for security
-   **Lightweight**: Minimal performance impact with efficient DOM monitoring

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click the Tampermonkey icon in your browser toolbar
3. Select "Create a new script"
4. Replace the default content with the code from `OpenInNewTabs.user.js`
5. Save the script (Ctrl+S or File → Save)

## Configuration

### Whitelist Domains

Edit the `WHITELIST_DOMAINS` array in the script to specify which domains should have the new tab behavior:

```javascript
const WHITELIST_DOMAINS = [
    "example.com",
    "stackoverflow.com",
    "wikipedia.org",
    // Add more domains as needed
]
```

### Domain Matching

The script supports both exact domain matching and subdomain matching:

-   `example.com` matches `example.com` exactly
-   `example.com` also matches `sub.example.com`, `deep.sub.example.com`, etc.

## How It Works

1. Checks if the current domain is in the whitelist
2. If whitelisted, modifies all existing links to open in new tabs
3. Sets up a MutationObserver to handle dynamically added content
4. Adds security attributes (`rel="noopener noreferrer"`) to prevent security issues

## Security Considerations

-   The script only runs on whitelisted domains
-   Uses `rel="noopener noreferrer"` to prevent the new page from accessing the original page
-   Avoids modifying download links (those with `download` attribute)

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
