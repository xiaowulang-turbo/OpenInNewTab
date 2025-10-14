# Open In New Tab - Official Website

This is the official landing page for the Open In New Tab project, showcasing both the Tampermonkey userscript and Chrome extension versions.

🌐 **[Live Website](https://open-in-new-tab.vercel.app/)** | 🎯 **[Greasy Fork Script](https://greasyfork.org/en/scripts/551033-open-in-new-tab)** | 🌟 **[GitHub Repository](https://github.com/xiaowulang-turbo/OpenInNewTab)**

## Features

-   **Modern Design**: Clean, responsive layout with smooth animations
-   **Dark Mode Support**: Auto-detects system theme with manual toggle and persistence
-   **Interactive Elements**: Tab switching, smooth scrolling, copy buttons, theme switcher
-   **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
-   **Performance Optimized**: Lightweight, fast loading, smooth animations
-   **SEO Friendly**: Proper meta tags and semantic HTML

## Structure

```
website/
├── index.html          # Main HTML file
├── styles.css          # All styles with CSS variables
├── script.js           # Interactive functionality
└── README.md           # This file
```

## Local Development

1. **Clone the repository:**

    ```bash
    cd OpenInNewTab/website
    ```

2. **Open in browser:**

    - Simply open `index.html` in your browser
    - Or use a local server:

        ```bash
        # Python 3
        python -m http.server 8000

        # Python 2
        python -m SimpleHTTPServer 8000

        # Node.js (using http-server)
        npx http-server
        ```

3. **View the site:**
    - Open `http://localhost:8000` in your browser

## Deployment

The website is currently deployed on **Vercel** at [https://open-in-new-tab.vercel.app/](https://open-in-new-tab.vercel.app/)

### Deploy Your Own

#### Vercel (Recommended)

1. **Install Vercel CLI:**

    ```bash
    npm install -g vercel
    ```

2. **Deploy:**

    ```bash
    cd website
    vercel --prod
    ```

3. **Or use Vercel Dashboard:**
    - Go to [Vercel](https://vercel.com/)
    - Import your GitHub repository
    - Set root directory to `website`
    - Deploy

#### Netlify

1. **Drag and Drop:**

    - Go to [Netlify](https://app.netlify.com/)
    - Drag the `website` folder to deploy

2. **Or use Netlify CLI:**
    ```bash
    npm install -g netlify-cli
    cd website
    netlify deploy --prod
    ```

#### GitHub Pages

1. **Push to GitHub:**

    ```bash
    git add website/
    git commit -m "Add official website"
    git push origin main
    ```

2. **Enable GitHub Pages:**

    - Go to repository Settings → Pages
    - Source: Deploy from a branch
    - Branch: main → /website
    - Save

3. **Access your site:**
    - Visit `https://<username>.github.io/<repository>/`

## Dark Mode Implementation

The website includes a complete dark mode system:

### Features

1. **Auto-Detection**: Automatically detects system theme preference on first load
2. **Manual Toggle**: Header button for manual theme switching
3. **Persistence**: Saves user preference in localStorage
4. **Priority System**: `localStorage` → System Preference → Light (default)
5. **Dynamic Updates**: Listens for system theme changes (if no manual preference)

### How It Works

```javascript
// Priority order
1. Check localStorage for saved preference
2. If none, check system preference (prefers-color-scheme)
3. Default to light theme

// User clicks toggle → Save to localStorage
// System theme changes → Auto-apply (only if no manual preference)
```

### Theme Variables

```css
/* Light Theme (Default) */
:root {
    --color-bg: #ffffff;
    --color-text: #333333;
    --color-primary: #4caf50;
}

/* Dark Theme */
[data-theme="dark"] {
    --color-bg: #121212;
    --color-text: #e0e0e0;
    --color-primary: #66bb6a;
}
```

### Usage

-   **Toggle Switch**: Click the switch in navigation bar to toggle themes
    -   **OFF (Left)**: Light mode with 🌙 moon icon
    -   **ON (Right)**: Dark mode with ☀️ sun icon
    -   **Visual Feedback**: Smooth sliding animation with gradient background
-   **Automatic**: Works out of the box with system preferences
-   **Persistent**: Choice remembered across sessions

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
/* Light Theme */
:root {
    --color-primary: #4caf50;
    --color-primary-dark: #45a049;
    --color-secondary: #2196f3;
}

/* Dark Theme */
[data-theme="dark"] {
    --color-primary: #66bb6a;
    --color-bg: #121212;
    --color-text: #e0e0e0;
}
```

### Content

-   **Hero Section**: Edit the main headline and description
-   **Features**: Add or modify feature cards
-   **Versions**: Update version comparison
-   **Installation**: Update installation steps

### Animations

All animations use CSS transitions and Intersection Observer API for smooth, performant effects.

## Browser Support

-   ✅ Chrome 88+
-   ✅ Firefox 78+
-   ✅ Safari 14+
-   ✅ Edge 88+
-   ✅ Opera 74+

## Performance

-   **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
-   **Load Time**: < 1s on fast 3G
-   **Bundle Size**: < 50KB total (HTML + CSS + JS)

## Technologies Used

-   **HTML5**: Semantic markup
-   **CSS3**: Modern layouts (Flexbox, Grid), animations, gradients
-   **Vanilla JavaScript**: No frameworks, pure performance
-   **Intersection Observer**: Smooth scroll animations
-   **CSS Variables**: Easy theming

## License

MIT License - see [LICENSE](../LICENSE) file for details

## Related Projects

-   [Main Project](../README.md) - Project root documentation
-   [Userscript Version](../userscript/README.md) - Tampermonkey userscript
-   [Chrome Extension](../extension/README.md) - Chrome extension version
