# Internationalization (i18n) Guide

This website supports English and Chinese language switching with the following features:

## Features

1. **Language Detection**: Automatically detects browser language on first load
2. **Persistent Storage**: Saves user's language preference in localStorage
3. **Manual Switch**: Users can switch language using buttons in the navigation bar
4. **Complete Coverage**: All user-facing text is translated

## Implementation

### Files Structure

-   `i18n.js` - Translation data for English and Chinese
-   `index.html` - HTML with `data-i18n` attributes
-   `script.js` - Language switching logic
-   `styles.css` - Styles for language switcher

### How It Works

1. **Initialization**: On page load, the system:

    - Checks localStorage for saved language preference
    - Falls back to browser language (zh-\* → Chinese, others → English)
    - Applies the selected language to all elements with `data-i18n` attribute

2. **Language Switching**: When user clicks a language button:

    - Updates all elements with `data-i18n` attributes
    - Saves preference to localStorage
    - Updates HTML lang attribute
    - Highlights active language button

3. **Data Flow**:
    ```
    User Action → handleLanguageSwitch() → applyLanguage() → Update DOM + localStorage
    ```

## Usage

### Adding New Translatable Text

1. Add translation keys to `i18n.js`:

```javascript
const translations = {
    en: {
        myNewKey: "English text",
    },
    zh: {
        myNewKey: "中文文本",
    },
}
```

2. Add `data-i18n` attribute to HTML element:

```html
<p data-i18n="myNewKey">English text</p>
```

### Testing

1. Open `index.html` in a browser
2. Click "EN" or "中文" buttons in the navigation bar
3. Verify all text switches between languages
4. Refresh page - language should persist
5. Check browser DevTools console for language initialization logs

## Browser Compatibility

-   Chrome/Edge: ✓
-   Firefox: ✓
-   Safari: ✓
-   All modern browsers with localStorage support

## Notes

-   Language preference is stored in localStorage key: `user-language`
-   Supported values: `"en"`, `"zh"`
-   Default language if no preference: Based on `navigator.language`
