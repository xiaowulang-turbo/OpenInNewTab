# Shared Icons

Single source of truth for UI icons used across the extension (`popup` / `options`)
and the website. Keeps both ends visually consistent.

## Source & License

Icons are taken from [Lucide](https://lucide.dev) (ISC License). Each file is the
verbatim `<svg>` markup with `stroke="currentColor"`, so color is inherited from the
parent `color` and adapts to theme automatically.

## Inventory

| File                      | Lucide name           | Used for                         |
| ------------------------- | --------------------- | -------------------------------- |
| `settings.svg`            | `settings`            | Popup settings button            |
| `sun.svg`                 | `sun`                 | Light theme option               |
| `moon.svg`                | `moon`                | Dark theme option                |
| `monitor.svg`             | `monitor`             | Auto theme (follow system)       |
| `x.svg`                   | `x`                   | Modal close button               |
| `pin.svg`                 | `pin`                 | Welcome: pin the extension       |
| `mouse-pointer-click.svg` | `mouse-pointer-click` | Welcome: click icon to add site  |
| `external-link.svg`       | `external-link`       | Welcome: open in new tab / site  |
| `check.svg`               | `check`               | Welcome: success / done marker   |
| `chevron-right.svg`       | `chevron-right`       | Popup: drill into full settings  |

## Conventions

- `viewBox="0 0 24 24"`, `stroke-width="2"`, rounded caps/joins.
- Stroke only — never set `fill` to a literal color or hard-code hex.
- `aria-hidden="true"` on decorative icons; the interactive parent owns the label.
- Consumers inline the markup (no runtime dependency). When adding an icon, copy the
  raw SVG from Lucide into this folder, then inline it where needed.
