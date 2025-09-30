# Open In New Tabs - Official Website

This is the official landing page for the Open In New Tabs project, showcasing both the Tampermonkey userscript and Chrome extension versions.

## Features

-   **Modern Design**: Clean, responsive layout with smooth animations
-   **Dark Mode Ready**: Beautiful gradients and color schemes
-   **Interactive Elements**: Tab switching, smooth scrolling, copy buttons
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
    cd OpenInNewTabs/website
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

### GitHub Pages

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
    - Visit `https://xiaowulang-turbo.github.io/OpenInNewTabs/`

### Netlify

1. **Drag and Drop:**

    - Go to [Netlify](https://app.netlify.com/)
    - Drag the `website` folder to deploy

2. **Or use Netlify CLI:**
    ```bash
    npm install -g netlify-cli
    cd website
    netlify deploy --prod
    ```

### Vercel

1. **Install Vercel CLI:**

    ```bash
    npm install -g vercel
    ```

2. **Deploy:**
    ```bash
    cd website
    vercel --prod
    ```

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --color-primary: #4caf50;
    --color-primary-dark: #45a049;
    --color-secondary: #2196f3;
    /* ... */
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
