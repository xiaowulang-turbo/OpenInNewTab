# Composed store screenshots (1280×800)

Marketing screenshots for the Chrome Web Store listing. They differ from the
raw captures in `../` (which are literally the extension pages as the capture
script found them): here each shot is a **brand stage + the real extension UI**,
with a headline that names the feature it shows.

The extension panels are not redrawn by hand. Every scene loads the real
`extension/popup.css` / `extension/options.css` and injects the real markup
from `extension/popup.html` / `extension/options.html`, with strings taken from
`shared/locales/ext/{en,zh-CN}.json`. Only the surrounding stage (canvas,
caption, browser frame, shadows) is marketing-only.

## Files

The store has two screenshot slots, each accepting up to five images:

| File | Store slot | Shows |
| --- | --- | --- |
| `zh-CN/01-hero.png` | 以当地语言显示的屏幕截图 | A whitelisted link opening a second tab, with the popup |
| `zh-CN/02-add.png` | 以当地语言显示的屏幕截图 | One-click add of the current domain (card spotlighted) |
| `zh-CN/03-whitelist.png` | 以当地语言显示的屏幕截图 | The options page's whitelist section |
| `zh-CN/04-settings.png` | 以当地语言显示的屏幕截图 | Settings modal, dark theme |
| `en/01-hero.png` | 全球通用的屏幕截图 | Same four scenes, English UI |
| `en/02-add.png` | 全球通用的屏幕截图 | |
| `en/03-whitelist.png` | 全球通用的屏幕截图 | |
| `en/04-settings.png` | 全球通用的屏幕截图 | |

All eight are 8-bit RGB PNGs (color type 2, **no alpha**) at exactly 1280×800.
The store also accepts JPEG; PNG keeps the UI text crisp.

## Templates

Templates are committed, so changing an image means editing the template and
re-rendering — never editing the PNG.

```
store/_mock/
├── shot.css            # stage only: canvas, caption, panel frames, browser mock
├── shot-parts.js       # scene definitions + the injected extension markup
├── shot-01-hero.html   # one file per scene; the locale comes from the URL hash
├── shot-02-add.html
├── shot-03-whitelist.html
└── shot-04-settings.html
```

`shot.css` deliberately contains **no** product styles — it only normalizes the
page shell (the extension CSS sizes `body` for a browser tab) and adds the
stage. `shot-parts.js` carries a `MIRROR: shared/locales/ext/…` note: when a
string changes in the locale files, change it there too.

Scene 03 sizes its panel at runtime to the whitelist section and scrolls to it,
because the options page is ~1015px tall at 800px wide and would otherwise be
cut mid-row.

## Regenerate

```bash
npm run store:shots
```

That renders every `store/_mock/shot-*.html` at every locale into
`<locale>/<scene>.png`, then verifies each file is exactly 1280×800 and 24-bit
RGB (the store rejects alpha) before keeping it. Adding a scene means adding one
HTML file — there is no list to keep in sync. The locales live in
`scripts/generate-store-shots.mjs` and mirror `shot-parts.js`.

To render a single scene, or to get the overflow probe, use the
`html-shot-renderer` helper instead:

```bash
python ~/.codebuddy/skills/html-shot-renderer/scripts/render_shot.py \
  "store/_mock/shot-01-hero.html#zh-CN" \
  --out store/screenshots/marketing/zh-CN/01-hero.png \
  --width 1280 --height 800 --root . --wait-ms 2000 --check-overflow
```

Two flags are not optional there:

- `--root .` — the scenes `<link>` the extension's own stylesheets, which live
  outside `store/_mock/`, so the static server root has to be the repo root.
- `--wait-ms 2000` — `shot-parts.js` builds the DOM at runtime; without it the
  screenshot can be taken before the panels exist.

On Windows run it as
`python "$env:USERPROFILE\.codebuddy\skills\html-shot-renderer\scripts\render_shot.py" ...`
(PowerShell does not expand `~`, and `python3` usually does not exist).

A raw one-liner also works if you would rather skip the helper:

```bash
msedge --headless=new --disable-gpu --hide-scrollbars --no-first-run \
  --window-size=1280,800 --virtual-time-budget=2000 \
  --screenshot="$PWD/store/screenshots/marketing/zh-CN/01-hero.png" \
  "file://$PWD/store/_mock/shot-01-hero.html#zh-CN"
```

Both paths produce byte-identical PNGs.

Verify the output is still 1280×800 with no alpha:

```bash
python -c "b=open('store/screenshots/marketing/zh-CN/01-hero.png','rb').read(); print(int.from_bytes(b[16:20],'big'), int.from_bytes(b[20:24],'big'), 'colorType', b[25])"
# -> 1280 800 colorType 2
```

## Upload

In the [Developer Dashboard](https://chrome.google.com/webstore/devconsole):

1. Open the item → **Store listing** → **Graphics**.
2. **以当地语言显示的屏幕截图** ← the four `zh-CN/` images.
3. **全球通用的屏幕截图** ← the four `en/` images.
4. Submit the listing for review.
