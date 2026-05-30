/**
 * Shared version helpers.
 *
 * The repository ships two independent products with independent SemVer
 * lifecycles:
 *
 *   1. **Extension** — version stored in `extension/manifest.json`. The
 *      website (`website/index.html`, `website/privacy-policy.html`) is the
 *      extension's landing page and its `<meta name="app-version" />` tag
 *      mirrors the manifest version.
 *
 *   2. **Userscript** — version stored twice inside
 *      `userscript/OpenInNewTab.user.js`: the `// @version` metadata line
 *      (consumed by Tampermonkey) and the `SCRIPT_VERSION` constant
 *      (rendered in the About section of the settings modal). They must
 *      stay equal to each other but are otherwise free to diverge from the
 *      extension's version number.
 *
 * Helpers below keep each track readable/writable in isolation. There is
 * no helper that synchronises across tracks — that decoupling is
 * intentional.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.join(__dirname, "..")
export const MANIFEST_PATH = path.join(ROOT, "extension", "manifest.json")
export const USERSCRIPT_PATH = path.join(
    ROOT,
    "userscript",
    "OpenInNewTab.user.js"
)
export const HTML_PATHS = [
    path.join(ROOT, "website", "index.html"),
    path.join(ROOT, "website", "privacy-policy.html"),
]

const META_APP_VERSION_RE =
    /<meta\s+name="app-version"\s+content="[^"]*"\s*\/?>/i
const USERSCRIPT_AT_VERSION_RE = /^(\/\/ @version\s+)([\d.]+)/m
const USERSCRIPT_CONST_VERSION_RE =
    /(const\s+SCRIPT_VERSION\s*=\s*")([\d.]+)(")/m

// ─────────────────────────────────────────────────────────────
// Extension track
// ─────────────────────────────────────────────────────────────

/**
 * @returns {string} version declared in extension/manifest.json
 */
export function readExtensionVersion() {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf8")
    const m = raw.match(/"version"\s*:\s*"([^"]+)"/)
    if (!m) {
        throw new Error(`Could not parse version from ${MANIFEST_PATH}`)
    }
    return m[1]
}

/**
 * @param {string} version
 */
export function writeExtensionVersion(version) {
    let raw = fs.readFileSync(MANIFEST_PATH, "utf8")
    const next = raw.replace(/("version"\s*:\s*)"[^"]*"/, `$1"${version}"`)
    if (next === raw) {
        throw new Error(`Could not write version in ${MANIFEST_PATH}`)
    }
    fs.writeFileSync(MANIFEST_PATH, next, "utf8")
}

/**
 * Update the website's `<meta name="app-version" />` tags to the given
 * version. The website tracks the extension version exclusively.
 * @param {string} version
 */
export function syncWebsiteAppVersion(version) {
    for (const htmlPath of HTML_PATHS) {
        let html = fs.readFileSync(htmlPath, "utf8")
        if (!META_APP_VERSION_RE.test(html)) {
            throw new Error(
                `Missing <meta name="app-version" /> in ${htmlPath}`
            )
        }
        html = html.replace(
            META_APP_VERSION_RE,
            `<meta name="app-version" content="${version}" />`
        )
        fs.writeFileSync(htmlPath, html, "utf8")
    }
}

/**
 * @param {string} htmlPath
 * @returns {string|null}
 */
function readHtmlAppVersion(htmlPath) {
    const html = fs.readFileSync(htmlPath, "utf8")
    const m = html.match(
        /<meta\s+name="app-version"\s+content="([^"]*)"\s*\/?>/i
    )
    return m ? m[1] : null
}

// ─────────────────────────────────────────────────────────────
// Userscript track
// ─────────────────────────────────────────────────────────────

/**
 * @returns {{ atVersion: string, constVersion: string }}
 */
export function readUserscriptVersion() {
    const us = fs.readFileSync(USERSCRIPT_PATH, "utf8")
    const atMatch = us.match(USERSCRIPT_AT_VERSION_RE)
    const constMatch = us.match(USERSCRIPT_CONST_VERSION_RE)
    if (!atMatch) {
        throw new Error(
            `Could not find // @version line in ${USERSCRIPT_PATH}`
        )
    }
    if (!constMatch) {
        throw new Error(
            `Could not find SCRIPT_VERSION constant in ${USERSCRIPT_PATH}`
        )
    }
    return { atVersion: atMatch[2], constVersion: constMatch[2] }
}

/**
 * Write the same version into both the `// @version` metadata line and the
 * `SCRIPT_VERSION` constant inside the userscript file.
 * @param {string} version
 */
export function writeUserscriptVersion(version) {
    let us = fs.readFileSync(USERSCRIPT_PATH, "utf8")
    const before = us
    us = us.replace(USERSCRIPT_AT_VERSION_RE, `$1${version}`)
    us = us.replace(USERSCRIPT_CONST_VERSION_RE, `$1${version}$3`)
    if (us === before) {
        throw new Error(`Could not write userscript version in ${USERSCRIPT_PATH}`)
    }
    fs.writeFileSync(USERSCRIPT_PATH, us, "utf8")
}

// ─────────────────────────────────────────────────────────────
// SemVer helpers (shared by both tracks)
// ─────────────────────────────────────────────────────────────

/**
 * Chrome semver: 1–4 dot-separated non-negative integers. Matches the
 * userscript's lenient style as well.
 * @param {string} version
 * @returns {string}
 */
export function bumpPatch(version) {
    const parts = version.split(".")
    if (parts.length < 1 || parts.length > 4) {
        throw new Error(`Invalid version segment count: ${version}`)
    }
    for (const p of parts) {
        if (!/^\d+$/.test(p)) {
            throw new Error(
                `Invalid version (digits only per segment): ${version}`
            )
        }
    }
    const nums = parts.map((p) => Number(p))
    nums[nums.length - 1] += 1
    return nums.join(".")
}

// ─────────────────────────────────────────────────────────────
// Verify
// ─────────────────────────────────────────────────────────────

/**
 * Verify cross-file invariants:
 *   - extension manifest version == website app-version (both HTML files);
 *   - userscript // @version == SCRIPT_VERSION constant.
 *
 * The extension and userscript versions are NOT compared against each other —
 * they are independent products on independent release cycles.
 *
 * @returns {void}
 */
export function verifyVersion() {
    const manifest = readExtensionVersion()
    for (const htmlPath of HTML_PATHS) {
        const hv = readHtmlAppVersion(htmlPath)
        if (hv !== manifest) {
            throw new Error(
                `HTML app-version mismatch in ${htmlPath}: expected ${manifest}, got ${hv}`
            )
        }
    }

    const { atVersion, constVersion } = readUserscriptVersion()
    if (atVersion !== constVersion) {
        throw new Error(
            `Userscript version mismatch: // @version=${atVersion}, SCRIPT_VERSION=${constVersion}`
        )
    }
}
