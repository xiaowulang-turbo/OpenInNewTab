/**
 * Pack extension/ into release/OpenInNewTab-extension-<version>.zip (Chrome Web Store layout).
 */

import archiver from "archiver"
import {
    createWriteStream,
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    unlinkSync,
} from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const extensionDir = path.join(root, "extension")
const releaseDir = path.join(root, "release")
const manifestPath = path.join(extensionDir, "manifest.json")

if (!existsSync(manifestPath)) {
    console.error("pack-extension: manifest.json not found at", manifestPath)
    process.exit(1)
}

let version
try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
    version = manifest.version
    if (!version || typeof version !== "string") {
        throw new Error("missing or invalid version")
    }
} catch (e) {
    console.error("pack-extension: failed to read manifest version:", e.message)
    process.exit(1)
}

if (!existsSync(extensionDir)) {
    console.error("pack-extension: extension directory not found")
    process.exit(1)
}

mkdirSync(releaseDir, { recursive: true })

const oldZipRe = /^OpenInNewTab-extension-.*\.zip$/
for (const name of readdirSync(releaseDir)) {
    if (oldZipRe.test(name)) {
        unlinkSync(path.join(releaseDir, name))
    }
}

const outName = `OpenInNewTab-extension-${version}.zip`
const outPath = path.join(releaseDir, outName)

const output = createWriteStream(outPath)
const archive = archiver("zip", { zlib: { level: 9 } })

archive.on("warning", (err) => {
    if (err.code !== "ENOENT") console.warn(err)
})
archive.on("error", (err) => {
    console.error(err)
    process.exit(1)
})

const closed = new Promise((resolve, reject) => {
    output.on("close", resolve)
    output.on("error", reject)
})

archive.pipe(output)
archive.glob("**/*", {
    cwd: extensionDir,
    dot: true,
    ignore: ["**/*.md", "**/.DS_Store"],
})

await archive.finalize()
await closed

console.log("pack-extension:", outPath, `(${archive.pointer()} bytes)`)
