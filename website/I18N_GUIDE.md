# Internationalization (i18n) Guide

The website supports **English**, **简体中文 (zh-CN)**, and **繁體中文 (zh-TW)** with the following features:

1.  **Language Detection**: Automatically detects browser language on first load (zh-TW / zh-HK / zh-MO / zh-Hant → 繁體中文; other zh* → 简体中文; everything else → English).
2.  **Persistent Storage**: Saves the user's language preference in `localStorage` (`user-language` key, BCP-47 value). Legacy stored `"zh"` canonicalizes to `"zh-CN"`.
3.  **Manual Switch**: The nav-bar language button cycles `en → zh-CN → zh-TW → en` and shows the label of the locale you will switch to.
4.  **Complete Coverage**: All user-facing text is translated.

## Single source of truth

Translation strings are authored in [`shared/locales/site/{en,zh-CN,zh-TW}.json`](../shared/locales/site/) and the shared runtime in [`shared/i18n.js`](../shared/i18n.js). `website/i18n.js` is **generated** — do not edit it by hand.

```bash
npm run i18n:sync   # regenerates website/i18n.js (and the extension/userscript bundles)
```

The generated `website/i18n.js` exposes two globals:

-   `window.translations` — the raw `{ en, "zh-CN", "zh-TW" }` map, consumed by the `data-i18n` bulk-apply loop.
-   `window.i18n` — the `createI18n` runtime (detect / normalize / getText / greasyForkLangPrefix).

## Implementation

### Files

-   `i18n.js` — generated translations + runtime (loaded before `script.js`).
-   `index.html` / `privacy-policy.html` — HTML with `data-i18n` attributes.
-   `script.js` — language switching logic (`initLanguageSystem`).

### How it works

1.  **Initialization**: on load, `i18n.resolveStoredLocale(localStorage["user-language"])` resolves a concrete locale (falling back to browser detection), then `applyLanguage()` writes every `[data-i18n]` element's `textContent` from `translations[lang][key]`.
2.  **Language switching**: clicking the toggle advances to the next locale in the cycle, re-applies, and persists the choice.
3.  **Complex elements**: `updateComplexElements()` also rewrites the Greasy Fork listing link prefix (`i18n.greasyForkLangPrefix(lang)`) and resets copy-button labels.

## Adding a new language

1.  Create `shared/locales/site/<locale>.json` with every key from `en.json`.
2.  Add the locale id to `LOCALES` in `scripts/sync-locales.mjs` and to `SUPPORTED_LOCALES` / `LOCALE_LABELS` in `shared/i18n.js`.
3.  Run `npm run i18n:sync`.
4.  Update the `detectLocale` mapping in `shared/i18n.js` if the new locale needs browser-language routing.

## Notes

-   Locale ids are BCP-47 (`en`, `zh-CN`, `zh-TW`).
-   The `<html lang>` attribute is set to the resolved locale.
