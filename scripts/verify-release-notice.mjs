/**
 * Verify that the current extension version has a release entry.
 * A notice marked for display must contain complete bilingual copy.
 */

import { createRequire } from "node:module"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const { getUpdateNotice, validateUpdateNotice } = require(
    "../extension/update-notices.js"
)
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const manifest = JSON.parse(
    readFileSync(path.join(root, "extension/manifest.json"), "utf8")
)
const version = manifest.version
const notice = getUpdateNotice(version)

if (!notice) {
    console.error(
        `release:check — missing update notice entry for extension ${version}`
    )
    process.exit(1)
}

const errors = validateUpdateNotice(notice)
if (errors.length > 0) {
    console.error(
        `release:check — invalid update notice for extension ${version}:`
    )
    errors.forEach((error) => console.error(`- ${error}`))
    process.exit(1)
}

console.log(
    `release:check — OK (${version}, ${
        notice.showUpdateNotice ? "通知" : "静默"
    })`
)
