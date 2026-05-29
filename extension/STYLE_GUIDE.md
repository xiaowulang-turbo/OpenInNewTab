# Extension Style Guide

The visual contract for the extension surfaces (`popup`, `options`, future `welcome`).
It is the extension-side implementation of the project design philosophy in
[`.cursor/rules/design.mdc`](../.cursor/rules/design.mdc) and must stay in sync with the
website's accent and semantic tokens.

> **TL;DR** — One teal accent over many neutrals. Flat solid fills, never gradients.
> Neutral shadows only. Quiet hovers. Spend the accent sparingly. The "premium" feel
> comes from restraint, not from a fancier color.

---

## 1. Why the old UI looked cheap

The previous popup/options read as "plastic" not because the accent was green, but because
of execution. Ranked by impact:

| Culprit | Old pattern | Why it cheapens |
| --- | --- | --- |
| Button gradients | `linear-gradient(135deg, accent, accent-dark)` | Directional gradients are a hallmark of dated skeuomorphic buttons |
| Colored shadows | `box-shadow: 0 2px 8px rgba(76,175,80,.3)` | A glow tinted the same hue as the button is the strongest "toy" signal |
| High-saturation primaries | Material `#4caf50` / `#f44336` | Saturated primaries read as un-tuned defaults; red+green together = traffic light |
| Bouncy hover | `transform: translateY(-2px)` + bigger shadow | A lifting bounce feels like a toy |
| Decorative card gradients | gradient backgrounds on cards | Gradient with no informational purpose |

**Changing the hue alone fixes none of these.** The rules below target the real causes.

---

## 2. Hard bans

These are non-negotiable. A change that reintroduces any of them must be rejected.

- **No gradients. Anywhere.** No `linear-gradient`, no `radial-gradient` on extension
  surfaces. Fills are flat solid color. (The website's single `--gradient-glow` is a
  website-only exception and does not apply here.)
- **No colored shadows.** Shadows are neutral (`rgba(0,0,0,…)`) or absent. Never tint a
  shadow with the accent or danger hue.
- **No hardcoded hex** in CSS/HTML/JS. Every color is a token (see §4). New colors require
  a new token first.
- **No emoji / HTML entities as icons.** Inline `<svg>` with `stroke="currentColor"` only;
  source of truth is [`shared/icons/`](../shared/icons/).
- **No transform-based "lift" on hover** for buttons (no `translateY` bounce).

---

## 3. Principles

1. **One accent, many neutrals.** Accent = teal, shared with the website. Most of the UI
   is neutral grays; the accent appears only on the primary action, focus rings, and
   selected/active states.
2. **Spend the accent sparingly.** If everything is accent-colored, nothing reads as
   primary. Quiet by default, accent for emphasis.
3. **Elevation from surface + border, not decoration.** Separate layers with
   `--bg-elevated` + a 1px border and, at most, a very soft neutral shadow. Many states
   need no shadow at all.
4. **Quiet motion.** Hover changes background/opacity/border, not position. Transitions
   150–200ms ease. State changes should feel calm, not springy.
5. **System-first.** System font stack, no remote fonts. Respect `prefers-color-scheme`
   plus the manual light/dark override the popup already supports.
6. **Minimal surface.** Change only what the task needs. Deleting a component means
   deleting its CSS and DOM together.

---

## 4. Color tokens

Teal accent values mirror the website so the two ends match.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-accent` | `#0d9488` | `#2dd4bf` | Primary button fill, focus ring, active/selected |
| `--color-accent-hover` | `#0f766e` | `#5eead4` | Accent hover state |
| `--color-accent-fg` | `#ffffff` | `#0a0a0a` | **Text/icon on top of the accent fill** |

> **Critical:** the foreground on the accent must be `--color-accent-fg`, never a hardcoded
> `white`. Bright dark-mode teal (`#2dd4bf`) needs **dark** text to stay legible; white on
> it fails contrast. This is the one trap when migrating off the old green.

Neutrals (backgrounds, text, borders, surfaces) follow the existing popup variables
(`--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--border-color`,
`--shadow-color`, …) which already adapt across the three theme blocks: `:root` (light
default), `@media (prefers-color-scheme: dark)`, and the manual
`body[style*="color-scheme: …"]` overrides. Any accent/fg token added above must be defined
in **all** of those blocks.

**Naming note:** the website uses `--color-accent*`. The extension historically uses
`--btn-primary*`. Aligning the extension onto the `--color-accent*` names is the desired end
state for true cross-end token sharing, but it touches many references and should be done as
its own migration step.

---

## 5. Component patterns

### Buttons

| Type | Fill | Border | Text | Hover | Used for |
| --- | --- | --- | --- | --- | --- |
| **Primary** | `--color-accent` (solid) | none | `--color-accent-fg` | `--color-accent-hover` | Add / confirm |
| **Ghost (secondary)** | transparent | 1px `--border-color` | `--text-secondary` | faint `--bg-secondary` surface | **Remove**, import/export |

- **Remove is a ghost button, not red.** Removing a domain is reversible and loses no data,
  so it is not a destructive/danger action and must not use red. A quiet neutral ghost keeps
  "add = accent, remove = neutral" with clear hierarchy and no traffic-light clash.
- No danger/red token is needed. If a genuinely destructive, irreversible action is ever
  added, introduce a `--color-danger*` token at that point — solid, not gradient, neutral
  shadow.

### Inputs

Solid `--input-bg`, 1px `--input-border`, focus border → `--color-accent` (a 1px accent
border or a subtle neutral focus ring; no glow).

### Cards / rows

`--bg-elevated`/`--bg-secondary` + 1px `--border-color`. No gradient backgrounds. Optional
hover: a one-step surface/border shift, no lift.

### Selected / active (e.g. theme toggle)

Active = `--color-accent` fill + `--color-accent-fg` text. Inactive = neutral surface +
`--text-secondary`.

---

## 6. Elevation & motion

- **Shadows:** neutral only, soft. Example budget — resting `0 1px 2px rgba(0,0,0,.06)`,
  raised `0 4px 12px rgba(0,0,0,.10)` (dark mode uses the heavier `--shadow-*` neutrals).
  Prefer border-only separation where possible.
- **Radius:** reuse the existing scale (`6px` / `8px` / `12px`); don't invent new values.
- **Transitions:** `background-color`, `color`, `border-color`, `opacity` at 150–200ms ease.
  Do not transition `transform` for hover bounce.

---

## 7. Accessibility

- Light mode: accent text contrast ≥ 4.5:1 (AA normal).
- Dark mode: accent text contrast ≥ 7:1.
- Any new accent/fg pairing must be checked in **both** modes before it ships.
- Interactive controls keep a visible focus state and an `aria-label`/`title`; decorative
  icons are `aria-hidden="true"`.

---

## 8. Do / Don't

**Do**
- Flat solid accent on the one primary action per view.
- Neutral ghost for secondary actions (including remove).
- Neutral, soft shadows — or none.
- `--color-accent-fg` for text on accent.
- New color → new token, defined in every theme block.

**Don't**
- Any gradient.
- Any accent/danger-tinted shadow.
- Hardcoded hex, `white`, or `black` literals.
- `translateY` hover bounce.
- Red for the remove action.

---

## 9. Related docs

- [`.cursor/rules/design.mdc`](../.cursor/rules/design.mdc) — project-wide design philosophy (source of truth).
- [`THEME_COMPATIBILITY.md`](./THEME_COMPATIBILITY.md) — how the popup adapts to system theme.
- [`shared/icons/`](../shared/icons/) — single source of truth for icons.
- `website/README.md` → Design Principles — the website counterpart of these rules.
