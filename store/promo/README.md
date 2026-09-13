# Chrome Web Store promo tiles

Chrome Web Store **graphics** for the [listing](https://chromewebstore.google.com/detail/dncoifjfkmdpjpidepjjicpmojdecgoo).
Unlike the screenshots in `../screenshots/`, these are composed marketing art:
they reuse the real brand tokens and the real extension strings, but the layout
is a purpose-built mock rather than a capture of a live page.

| File | Tile | Size | Language |
| --- | --- | --- | --- |
| `promo-small-zh.png` | Small promo tile | 440×280 | 简体中文 |
| `promo-small-en.png` | Small promo tile | 440×280 | English |
| `promo-marquee-zh.png` | Marquee (top) promo tile | 1400×560 | 简体中文 |
| `promo-marquee-en.png` | Marquee (top) promo tile | 1400×560 | English |

All four are 8-bit RGB PNGs (color type 2, **no alpha**), which the store requires.

## What the art says

- **Small tile** — brand mark + a two-line headline that names the core
  behaviour ("links open in a new tab") plus the one differentiator
  (whitelist mode). Kept deliberately sparse: the tile is shown small.
- **Marquee tile** — headline + three feature rows on the left, and on the right
  a browser window mock (a whitelisted link clicked → a second tab opened) with
  the real popup overlapped on top. Copy is taken from the shipped strings in
  `shared/locales/ext/{en,zh-CN}.json`, so the art never promises a feature the
  product does not have.

Design follows `.cursor/rules/design.mdc`: dark-first surface, a single teal
accent, one radial glow, neutral-only shadows, Lucide icons, no gradients on
UI, no emoji.

## Templates

The HTML/CSS that produces these PNGs lives in `../_mock/` and is committed on
purpose — changing an image means editing the template and re-rendering, never
editing the PNG.

```
store/_mock/
├── promo.css              # shared tokens + primitives (mirrors website/styles.css)
├── promo-small-zh.html    # canvas size is set per page via --w/--h on <html>
├── promo-small-en.html
├── promo-marquee-zh.html
├── promo-marquee-en.html
└── icon128.png            # copy of extension/icons/icon128.png (relative-path asset)
```

(The same folder also holds the `shot-*` templates for the composed 1280×800
store screenshots — see [`../screenshots/marketing/README.md`](../screenshots/marketing/README.md).)

## Regenerate

The helper from the `html-shot-renderer` skill drives headless Chrome and
reports whether the layout overflows its canvas:

```bash
python ~/.codebuddy/skills/html-shot-renderer/scripts/render_shot.py \
  store/_mock/promo-small-zh.html \
  --out store/promo/promo-small-zh.png \
  --width 440 --height 280 --check-overflow
```

Repeat for each pair (440×280 for the small tiles, 1400×560 for the marquee).
On Windows use `python "$env:USERPROFILE\.codebuddy\skills\html-shot-renderer\scripts\render_shot.py"`
instead of `python ~/...` — PowerShell does not expand `~`, and `python3`
usually does not exist.

Verify the output is still RGB with no alpha:

```bash
python -c "b=open('store/promo/promo-small-zh.png','rb').read(); print(int.from_bytes(b[16:20],'big'), int.from_bytes(b[20:24],'big'), 'colorType', b[25])"
# -> 440 280 colorType 2
```

## Upload

In the [Developer Dashboard](https://chrome.google.com/webstore/devconsole):

1. Open the item → **Store listing** → **Graphics**.
2. Drop `promo-small-<lang>.png` into **Small promo tile** (440×280).
3. Drop `promo-marquee-<lang>.png` into **Marquee promo tile** (1400×560).
4. Submit the listing for review.
