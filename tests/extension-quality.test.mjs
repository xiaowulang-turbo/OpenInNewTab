import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const popupScript = readFileSync(join(root, "extension/popup.js"), "utf8")
const optionsScript = readFileSync(join(root, "extension/options.js"), "utf8")
const popupHtml = readFileSync(join(root, "extension/popup.html"), "utf8")
const privacyPolicy = readFileSync(join(root, "PRIVACY_POLICY.md"), "utf8")

describe("extension quality contracts", () => {
    it("popup and options update the document language", () => {
        assert.match(popupScript, /document\.documentElement\.lang/)
        assert.match(optionsScript, /document\.documentElement\.lang/)
    })

    it("localized error messages are not hardcoded", () => {
        assert.doesNotMatch(popupScript, /showNotification\(["']Error /)
        assert.doesNotMatch(optionsScript, /showNotification\(["']Error /)
    })

    it("popup modal close button has an accessible name", () => {
        assert.match(popupHtml, /id="modalCloseBtn"[^>]*aria-label=/s)
    })

    it("privacy policy omits scripting permission and explains sync storage", () => {
        assert.doesNotMatch(privacyPolicy, /scripting/)
        assert.match(privacyPolicy, /chrome\.storage\.sync[\s\S]*synchron/i)
    })
})
