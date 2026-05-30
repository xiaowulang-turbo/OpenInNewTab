# Style Tokens — Single Source of Truth

This document is the authoritative color contract for the **Open In New Tab**
project. Both ends MIRROR this file:

- **Extension** — declared as CSS variables in `extension/popup.css`
  (`:root`, `@media (prefers-color-scheme: dark)`, and the two
  `body[style*="color-scheme: …"]` manual override blocks). All other
  extension stylesheets (`options.css`, `welcome.css`) and the few JS
  template strings (`popup.js`, `options.js`) consume the variables — they
  do not redefine them.
- **Userscript** — returned by `getThemeColors()` in
  `userscript/OpenInNewTab.user.js` as a plain object whose keys are the
  camelCase forms of the variable names below. The userscript cannot link
  an external stylesheet, so it inlines styles using this object.

Keeping both ends synchronized to this single document is the zero-build,
zero-runtime way to guarantee that the popup, options page, welcome page,
and the userscript settings modal feel like one product.

> When this contract changes, update **all** mirrors in the same commit.
> Both ends carry a `MIRROR: shared/STYLE_TOKENS.md` comment at the
> declaration site so reviewers can find the contract instantly.

---

## 1. Color tokens

### 1.1 Accent (teal — single brand color, shared with the website)

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-accent` | `#0d9488` | `#2dd4bf` | Primary button fill, focus ring, active/selected state |
| `--color-accent-hover` | `#0f766e` | `#5eead4` | Accent hover state |
| `--color-accent-fg` | `#ffffff` | `#0a0a0a` | Foreground (text/icon) on top of `--color-accent` |

> **Critical:** the foreground on the accent must be `--color-accent-fg`,
> never a hardcoded `white`. Bright dark-mode teal needs **dark** text to
> stay legible; white on it fails contrast.

### 1.2 Neutrals (surfaces, text, borders)

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg-primary` | `#ffffff` | `#1a1a1a` | Base page / modal background |
| `--bg-secondary` | `#f8f9fa` | `#2d2d2d` | Card / header / elevated surface |
| `--text-primary` | `#333333` | `#ffffff` | Headings, body copy, primary text |
| `--text-secondary` | `#666666` | `#cccccc` | Helper / secondary copy, ghost-button text |
| `--border-color` | `#dddddd` | `#404040` | Cards, inputs, dividers |
| `--shadow-color` | `rgba(0,0,0,0.1)` | `rgba(0,0,0,0.3)` | Soft neutral elevation |
| `--shadow-hover` | `rgba(0,0,0,0.15)` | `rgba(0,0,0,0.5)` | Hovered elevation (rare) |
| `--input-bg` | `#ffffff` | `#333333` | Form-input background |
| `--input-border` | `#dddddd` | `#555555` | Form-input border |
| `--input-text` | `#333333` | `#ffffff` | Form-input text |

### 1.3 Danger (toast.error only — no other use yet)

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-danger` | `#dc2626` | `#ef4444` | Error-toast accent stripe |
| `--color-danger-fg` | `#ffffff` | `#ffffff` | Foreground on danger fill (reserved for future destructive actions) |

> Danger is introduced because the userscript shows error toasts for failed
> imports / missing capabilities — a high-priority destructive semantic that
> no neutral color can convey. The extension does not currently use these
> tokens; they are declared here so that, if ever needed, both ends share
> the same restrained red (more muted than Material `#f44336`).

### 1.4 Native form widgets (`color-scheme`, `accent-color`)

Both ends declare the following on the theme root, alongside the variables
above:

| Property | Light | Dark | Why |
| --- | --- | --- | --- |
| `color-scheme` | `light` | `dark` | Hints native widgets (radio, checkbox, scrollbar, default focus ring) which palette to render in. Without this, the userscript inherits the host page's `color-scheme` and unselected radios appear as solid black dots on a light modal. |
| `accent-color` | `var(--color-accent)` | `var(--color-accent)` | Tints the checked state of native radios / checkboxes / progress bars with the brand teal — no per-widget JS or `appearance: none` reset required. |

> The userscript applies both properties to the modal **content** element
> (so the declarations stay scoped to our overlay and never leak into the
> host page). The extension applies them to `:root` and the four theme
> blocks in `popup.css`.

---

## 2. Why these specific values

- **Accent = teal**, the same value the website uses
  (`website/styles.css`). One brand color across all surfaces.
- **No high-saturation primaries** — Material `#4caf50`-style fills are
  banned. See `extension/STYLE_GUIDE.md` §1.
- **No gradients, no colored shadows** — flat fills + neutral shadows only.
- **Three theme blocks** — `:root` (light default),
  `@media (prefers-color-scheme: dark)` (system dark), and the manual
  `body[style*="color-scheme: …"]` overrides. All three blocks must define
  every token in §1.1 and §1.2.

---

## 3. Mirror checklist (when a value changes)

1. Edit this file.
2. Update **all three** theme blocks in `extension/popup.css`.
   `extension/options.css`, `extension/welcome.css`, `extension/popup.js`,
   `extension/options.js` consume the variables and need no edits unless a
   token name changes.
3. Update `getThemeColors()` in `userscript/OpenInNewTab.user.js`
   (camelCase keys: `--color-accent` → `accent`,
   `--color-accent-hover` → `accentHover`,
   `--color-accent-fg` → `accentFg`,
   `--bg-primary` → `bgPrimary`, …).
4. Run `npm run lint` and visually diff the popup, options page, and the
   userscript settings modal in both light and dark themes.

---

## 4. Future migration (v2.0+)

This Markdown contract is intentionally low-tech. When `shared/core/` and
a build pipeline land, this file should be mechanically translated into:

- `shared/core/style-tokens.json` — the structured source
- generated `shared/core/style-tokens.css` (CSS variables) — imported by
  `extension/popup.css`
- generated `shared/core/style-tokens.js` (token map) — emitted into the
  userscript at build time

Variable names above were chosen to make that translation trivial.
