# Chrome Web Store screenshots

1280×800 full-bleed PNG candidates for the [listing](https://chromewebstore.google.com/detail/dncofijfkmdpjpidepjjicpmojdecgoo). They are captured from the real extension pages with Chrome DevTools Protocol. The store downscales screenshots to 640×400, so the pages are framed and scaled for readability.

## Files

| File | Contents |
| --- | --- |
| `screenshots/popup-light-add.png` | Real popup, light mode, current domain can be added |
| `screenshots/popup-dark-remove.png` | Real popup, dark mode, current domain is enabled |
| `screenshots/popup-zh-light-add.png` | Real popup, Simplified Chinese, light mode |
| `screenshots/options-light.png` | Real options page, light mode |
| `screenshots/options-dark.png` | Real options page, dark mode |
| `screenshots/options-zh-light.png` | Real options page, Simplified Chinese, light mode |

The screenshots use the current extension HTML, CSS, JavaScript, storage schema,
and localization strings. No marketing-only mock UI is used.

## Regenerate

```bash
npm run store:screenshots
```

Requires Chrome for Testing or a compatible Chromium build. Set `CHROME_PATH` to
override the browser path. The script uses a temporary profile and does not
modify the extension's stored data.

## Upload

This repo cannot publish to the Chrome Web Store. In the [Developer Dashboard](https://chrome.google.com/webstore/devconsole):

1. Open the item → **Store listing** → **Graphics**.
2. Preview the four candidates and choose up to five that best represent the listing.
3. Replace the existing screenshots with the selected PNGs.
4. Submit the listing for review (screenshot-only changes still go through review).
