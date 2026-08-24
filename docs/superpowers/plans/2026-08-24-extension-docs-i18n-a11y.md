# 扩展文档、国际化与无障碍修正实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正扩展隐私/权限说明，并补齐 Popup 与 Options 的语言语义、错误提示国际化和图标按钮可访问名称。

**Architecture:** 沿用 Popup/Options 现有的 `languageResources` 和 `getText()`，只增加缺失文案 key 与语言同步逻辑。隐私政策按当前 Manifest 静态 Content Script 和 `chrome.storage.sync` 的真实行为改写，不增加权限、不改变链接拦截路径。

**Tech Stack:** Manifest V3、原生 JavaScript、HTML、Node.js test runner、ESLint、TypeScript 检查。

## Global Constraints

- 不新增 `scripting` 权限。
- 不改变链接拦截、白名单匹配、存储结构或更新通知行为。
- 不引入新的国际化框架或运行时依赖。
- 保持现有英文代码注释和 README 约定。

---

### Task 1: Add regression coverage for language and accessibility contracts

**Files:**
- Create: `tests/extension-quality.test.mjs`

**Interfaces:**
- Consumes: `extension/popup.html`, `extension/options.html`, `extension/popup.js`, `extension/options.js`, `PRIVACY_POLICY.md`
- Produces: Static regression checks for the requested contracts.

- [ ] **Step 1: Write the failing tests**

Add tests that read the files and assert:

```js
test("popup and options update the document language", () => {
    assert.match(popupScript, /document\.documentElement\.lang/)
    assert.match(optionsScript, /document\.documentElement\.lang/)
})

test("localized error messages are not hardcoded", () => {
    assert.doesNotMatch(popupScript, /showNotification\(["']Error /)
    assert.doesNotMatch(optionsScript, /showNotification\(["']Error /)
})

test("popup modal close button has an accessible name", () => {
    assert.match(popupHtml, /id="modalCloseBtn"[^>]*aria-label=/s)
})
```

Also assert that the privacy policy does not contain `scripting` and describes `chrome.storage.sync` as browser synchronization.

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `node --test tests/extension-quality.test.mjs`

Expected: FAIL because Popup/Options do not update `document.documentElement.lang`, error paths contain hardcoded English, and the close button has no accessible name.

- [ ] **Step 3: Keep the tests focused**

Use only Node built-ins and file reads. Do not instantiate a browser DOM or add a dependency for static contracts.

- [ ] **Step 4: Run the test again**

Run: `node --test tests/extension-quality.test.mjs`

Expected: FAIL for the missing implementation contracts.

### Task 2: Correct privacy and permission documentation

**Files:**
- Modify: `PRIVACY_POLICY.md:8-18`

**Interfaces:**
- Consumes: `extension/manifest.json`, `extension/content.js`
- Produces: Privacy wording matching actual permissions and execution behavior.

- [ ] **Step 1: Replace the inaccurate permission claims**

Document only `storage`, `activeTab`, and `host_permissions`. Explain that static Content Scripts may load on HTTP/HTTPS pages matching the manifest, while link changes and click interception occur only on whitelisted hosts. Explain that `chrome.storage.sync` is synchronized by Chrome when the user is signed in and is not an extension-controlled external service.

- [ ] **Step 2: Run the privacy contract test**

Run: `node --test tests/extension-quality.test.mjs`

Expected: The privacy assertions pass while the UI assertions remain red.

### Task 3: Localize Popup and Options behavior

**Files:**
- Modify: `extension/popup.js:12-60,205-253`
- Modify: `extension/options.js:12-88,244-312`

**Interfaces:**
- Consumes: Each page's existing `languageResources`, `getText()`, and `updateLanguage()`.
- Produces: Localized error messages and synchronized `document.documentElement.lang`.

- [ ] **Step 1: Add translation keys**

Add these keys to both `en` and `zh` resources:

```js
errorAddingDomain
errorRemovingDomain
errorExportingWhitelist
```

Use concise English and Chinese messages matching the existing tone.

- [ ] **Step 2: Route error notifications through `getText()`**

Replace each literal error notification with its corresponding key:

```js
showNotification(getText("errorAddingDomain"))
```

Apply the same pattern to remove and export failures in both scripts.

- [ ] **Step 3: Synchronize the root language**

At the end of each `updateLanguage()` function, set:

```js
document.documentElement.lang = currentLanguage === "zh" ? "zh" : "en"
```

Keep the existing fallback behavior so unsupported values resolve to English.

- [ ] **Step 4: Run the focused tests**

Run: `node --test tests/extension-quality.test.mjs`

Expected: Localization and language assertions pass; the close-button assertion remains red.

### Task 4: Complete Popup accessible names and localized titles

**Files:**
- Modify: `extension/popup.html:14-23,63-70,130-151`
- Modify: `extension/popup.js:12-60,205-253`

**Interfaces:**
- Consumes: Existing Popup language resources and DOM IDs.
- Produces: Accessible, language-aware names for icon-only controls and the background toggle.

- [ ] **Step 1: Add translation keys**

Add keys for:

```js
settingsButtonTitle
closeSettingsButtonLabel
openInBackgroundTitle
```

Provide English and Chinese values.

- [ ] **Step 2: Add a stable accessible name to the close button**

Add `aria-label` to `#modalCloseBtn`, with the initial English value matching the resource. Keep the SVG `aria-hidden="true"`.

- [ ] **Step 3: Update titles when language changes**

In `updateLanguage()`, set the localized `title` for `#settingsButton`, `#modalCloseBtn`, and the `.toggle-switch` label. Set the close button's `aria-label` from the same localized key.

- [ ] **Step 4: Run the focused tests**

Run: `node --test tests/extension-quality.test.mjs`

Expected: All focused quality tests pass.

### Task 5: Verify the complete change and review the diff

**Files:**
- Review: `PRIVACY_POLICY.md`
- Review: `extension/popup.html`
- Review: `extension/popup.js`
- Review: `extension/options.js`
- Review: `tests/extension-quality.test.mjs`

- [ ] **Step 1: Run all automated checks**

Run:

```text
npm test
npm run lint
npm run lint:tsc
npm run version:verify
npm run release:check
```

Expected: every command exits successfully.

- [ ] **Step 2: Review the final diff**

Confirm no Manifest permission, link behavior, storage schema, update-notice data, unrelated CSS, or unrelated DOM was changed.

- [ ] **Step 3: Run the formatter/linter fix check**

Run: `npm run lint:fix`

Expected: ESLint completes without introducing unrelated changes. If it changes only formatting in touched files, include those changes and rerun `npm run lint`.
