# Open In New Tab

A monorepo project providing two implementations to force all links to open in new tab using a whitelist-based approach:

-   **Userscript Version**: Tampermonkey/Greasemonkey userscript
-   **Chrome Extension Version**: Native Chrome extension with popup interface

Both versions feature dark mode support, internationalization, and modern UI design.

📖 **[Visit Official Website](website/)** | 🌟 **[Star on GitHub](https://github.com/xiaowulang-turbo/OpenInNewTab)**

## Project Structure

```
/OpenInNewTab/ (Monorepo Root)
├── userscript/              # Tampermonkey userscript version
│   ├── OpenInNewTab.user.js
│   ├── README.md
│   └── LICENSE
├── extension/               # Chrome extension version
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   ├── icons/
│   └── README.md
├── website/                 # Official landing page
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── README.md
├── README.md                # This file
└── LICENSE                  # MIT License
```

## Quick Start

Choose your preferred version:

### 🚀 Userscript Version

-   **Best for**: Quick testing, development, or users who prefer Tampermonkey
-   **Installation**: [See userscript/README.md](userscript/README.md#installation)
-   **Features**: Menu-based management, dark mode, internationalization

### 🌐 Chrome Extension Version

-   **Best for**: Production use, better performance, native browser integration
-   **Installation**: [See extension/README.md](extension/README.md#installation)
-   **Features**: Popup interface, auto-updates, Web Store distribution

## Documentation

For detailed documentation, please refer to the specific version you want to use:

-   **[Userscript Version](userscript/README.md)** - Complete Tampermonkey/Greasemonkey documentation
-   **[Chrome Extension Version](extension/README.md)** - Complete Chrome extension documentation

Both versions share the same core functionality and features, but have different installation and usage instructions.

## License

MIT License - see LICENSE file for details
