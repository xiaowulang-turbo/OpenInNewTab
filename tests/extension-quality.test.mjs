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

const documentLangAssignment = /document\.documentElement\.lang\s*=/
const hardcodedErrorNotification =
    /showNotification\s*\(\s*(["'`])Error /

describe("extension quality contracts", () => {
    it("popup and options update the document language", () => {
        assert.match(popupScript, documentLangAssignment)
        assert.match(optionsScript, documentLangAssignment)
    })

    it("localized error messages are not hardcoded", () => {
        assert.doesNotMatch(popupScript, hardcodedErrorNotification)
        assert.doesNotMatch(optionsScript, hardcodedErrorNotification)
    })

    it("popup modal close button has an accessible name", () => {
        assert.match(popupHtml, /id="modalCloseBtn"[^>]*aria-label=/s)
    })

    it("privacy policy omits scripting permission and explains sync storage", () => {
        assert.doesNotMatch(privacyPolicy, /scripting/)
        assert.match(privacyPolicy, /chrome\.storage\.sync[\s\S]*synchron/i)
    })
})
