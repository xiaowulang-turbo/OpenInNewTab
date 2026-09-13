/**
 * Render the composed Chrome Web Store screenshots (store/screenshots/marketing).
 *
 * Every scene in `store/_mock/` is a brand stage built around the real extension
 * UI — see `store/screenshots/marketing/README.md`. This script renders each
 * scene at each locale and refuses to keep a result that is not an exact-size,
 * alpha-free PNG (the store rejects RGBA).
 *
 * Usage: npm run store:shots
 *
 * Scenes are discovered from the `shot-*.html` files, so adding one is enough;
 * the output name drops the `shot-` prefix (`shot-01-hero.html` → `01-hero.png`).
 * Locales must stay in sync with `store/_mock/shot-parts.js`.
 */

import { spawn } from "node:child_process"
import { mkdirSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { findChrome } from "./find-browser.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const mockDir = path.join(root, "store", "_mock")
const outDir = path.join(root, "store", "screenshots", "marketing")

const WIDTH = 1280
const HEIGHT = 800
/** Let the page's virtual clock advance so shot-parts.js finishes building the DOM. */
const VIRTUAL_TIME_BUDGET_MS = 2000
/** MIRROR: the locales `store/_mock/shot-parts.js` can render. */
const LOCALES = ["zh-CN", "en"]

function findScenes() {
    const scenes = readdirSync(mockDir)
        .filter((name) => /^shot-\d+-.+\.html$/.test(name))
        .sort()
        .map((name) => ({
            file: name,
            name: name.replace(/^shot-/, "").replace(/\.html$/, ""),
        }))

    if (scenes.length === 0) {
        throw new Error(`no shot-*.html scenes found in ${mockDir}`)
    }
    return scenes
}

/** Read just the IHDR fields we care about, without pulling in an image library. */
function readPngHeader(file) {
    const header = readFileSync(file).subarray(0, 26)
    if (header.subarray(0, 8).toString("binary") !== "\x89PNG\r\n\x1a\n") {
        throw new Error(`${file} is not a PNG`)
    }
    return {
        width: header.readUInt32BE(16),
        height: header.readUInt32BE(20),
        colorType: header[25], // 2 = truecolor RGB (no alpha), 6 = RGBA
    }
}

function render(chrome, url, destination) {
    return new Promise((resolve, reject) => {
        const child = spawn(
            chrome,
            [
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                "--no-first-run",
                `--window-size=${WIDTH},${HEIGHT}`,
                `--virtual-time-budget=${VIRTUAL_TIME_BUDGET_MS}`,
                `--screenshot=${destination}`,
                url,
            ],
            { stdio: "ignore" }
        )
        child.on("error", reject)
        child.on("exit", (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`browser exited with code ${code} for ${url}`))
            }
        })
    })
}

/**
 * A scene that was renamed or removed leaves a stale PNG behind, which is easy
 * to upload by accident. Warn instead of deleting — the file is not ours to
 * remove silently.
 */
function warnAboutOrphans(scenes) {
    const expected = new Set(
        LOCALES.flatMap((locale) =>
            scenes.map((scene) => path.join(locale, `${scene.name}.png`))
        )
    )

    for (const locale of LOCALES) {
        for (const name of readdirSync(path.join(outDir, locale))) {
            const relative = path.join(locale, name)
            if (name.endsWith(".png") && !expected.has(relative)) {
                console.warn(
                    `warning: ${relative} has no matching scene — delete it if it is stale`
                )
            }
        }
    }
}

async function main() {
    const chrome = findChrome()
    const scenes = findScenes()

    for (const locale of LOCALES) {
        mkdirSync(path.join(outDir, locale), { recursive: true })
    }

    for (const locale of LOCALES) {
        for (const scene of scenes) {
            const source = path.join(mockDir, scene.file)
            const destination = path.join(outDir, locale, `${scene.name}.png`)

            await render(chrome, `${pathToFileURL(source).href}#${locale}`, destination)

            const { width, height, colorType } = readPngHeader(destination)
            if (width !== WIDTH || height !== HEIGHT) {
                throw new Error(
                    `${scene.name} (${locale}) is ${width}x${height}, expected ${WIDTH}x${HEIGHT}`
                )
            }
            if (colorType !== 2) {
                throw new Error(
                    `${scene.name} (${locale}) is PNG color type ${colorType}; the store requires 24-bit RGB with no alpha`
                )
            }

            console.log(
                `wrote ${path.relative(root, destination)}  ${width}x${height} RGB`
            )
        }
    }

    warnAboutOrphans(scenes)
}

main().catch((error) => {
    console.error(`generate-store-shots: ${error.message}`)
    process.exitCode = 1
})
