/**
 * Shared version helpers: manifest is the single source of truth.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.join(__dirname, "..")
export const MANIFEST_PATH = path.join(ROOT, "extension", "manifest.json")
export const USERSCRIPT_PATH = path.join(ROOT, "userscript", "OpenInNewTab.user.js")
export const HTML_PATHS = [
    path.join(ROOT, "website", "index.html"),
    path.join(ROOT, "website", "privacy-policy.html"),
]

/**
 * @returns {string}
 */
export function readManifestVersion() {
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
export function writeManifestVersion(version) {
    let raw = fs.readFileSync(MANIFEST_PATH, "utf8")
    const next = raw.replace(
        /("version"\s*:\s*)"[^"]*"/,
        `$1"${version}"`
    )
    if (next === raw) {
        throw new Error(`Could not write version in ${MANIFEST_PATH}`)
    }
    fs.writeFileSync(MANIFEST_PATH, next, "utf8")
}

/**
 * Chrome semver: 1–4 dot-separated non-negative integers.
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
            throw new Error(`Invalid version (digits only per segment): ${version}`)
        }
    }
    const nums = parts.map((p) => Number(p))
    nums[nums.length - 1] += 1
    return nums.join(".")
}

const META_APP_VERSION_RE =
    /<meta\s+name="app-version"\s+content="[^"]*"\s*\/?>/i

/**
 * @param {string} version
 */
export function syncVersion(version) {
    let us = fs.readFileSync(USERSCRIPT_PATH, "utf8")
    const usNext = us.replace(
        /^(\/\/ @version\s+)([\d.]+)/m,
        `$1${version}`
    )
    if (usNext === us) {
        throw new Error(
            `Could not update // @version line in ${USERSCRIPT_PATH}`
        )
    }
    fs.writeFileSync(USERSCRIPT_PATH, usNext, "utf8")

    for (const htmlPath of HTML_PATHS) {
        let html = fs.readFileSync(htmlPath, "utf8")
        if (!META_APP_VERSION_RE.test(html)) {
            throw new Error(`Missing <meta name="app-version" /> in ${htmlPath}`)
        }
        html = html.replace(
            META_APP_VERSION_RE,
            `<meta name="app-version" content="${version}" />`
        )
        fs.writeFileSync(htmlPath, html, "utf8")
    }
}

/**
 * @returns {string|null} userscript version from file
 */
function readUserscriptVersion() {
    const us = fs.readFileSync(USERSCRIPT_PATH, "utf8")
    const m = us.match(/^\/\/ @version\s+([\d.]+)/m)
    return m ? m[1] : null
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

/**
 * @returns {void}
 */
export function verifyVersion() {
    const manifest = readManifestVersion()
    const us = readUserscriptVersion()
    if (us !== manifest) {
        throw new Error(
            `Userscript version mismatch: manifest=${manifest}, userscript=${us}`
        )
    }
    for (const htmlPath of HTML_PATHS) {
        const hv = readHtmlAppVersion(htmlPath)
        if (hv !== manifest) {
            throw new Error(
                `HTML app-version mismatch in ${htmlPath}: expected ${manifest}, got ${hv}`
            )
        }
    }
}
