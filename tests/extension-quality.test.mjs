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
const websitePrivacyPolicy = readFileSync(
    join(root, "website/privacy-policy.html"),
    "utf8"
)
const websiteI18n = readFileSync(join(root, "website/i18n.js"), "utf8")

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

    it("website privacy policy omits scripting permission and documents host pattern", () => {
        assert.doesNotMatch(websitePrivacyPolicy, /<strong>scripting<\/strong>/)
        assert.match(websitePrivacyPolicy, /\*:\/\/\*\//)
        assert.match(websitePrivacyPolicy, /chrome\.storage\.sync/)
    })

    it("website i18n omits unused privacyPermScripting key", () => {
        assert.doesNotMatch(websiteI18n, /privacyPermScripting/)
    })

    it("popup background toggle has a programmatic accessible name", () => {
        const hasAriaLabel = /id="openInBackgroundToggle"[^>]*aria-label=/.test(
            popupHtml
        )
        const hasExplicitLabel =
            /<label[^>]*\sfor="openInBackgroundToggle"/.test(popupHtml)
        assert.ok(
            hasAriaLabel || hasExplicitLabel,
            "openInBackgroundToggle requires aria-label or label[for]"
        )
    })

    it("popup and options propagate saveUserWhitelist storage errors", () => {
        for (const [label, source] of [
            ["popup.js", popupScript],
            ["options.js", optionsScript],
        ]) {
            const fnBody = source.match(
                /async function saveUserWhitelist\(domains\) \{([\s\S]*?\n    \})/
            )?.[1]
            assert.ok(fnBody, `${label} defines saveUserWhitelist`)
            assert.match(
                fnBody,
                /catch[\s\S]*?throw/,
                `${label} saveUserWhitelist must rethrow storage errors`
            )
        }
    })
})
