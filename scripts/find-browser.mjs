/**
 * Locate a Chromium-based browser to drive headless.
 *
 * Shared by the two store-graphics generators:
 *   - `generate-store-screenshots.mjs` — raw captures of the real extension pages
 *   - `generate-store-shots.mjs`       — composed screenshots (brand stage + real UI)
 *
 * Lookup order: CHROME_PATH → PATH → well-known install locations. Nothing is
 * hardcoded to a drive letter or a specific vendor, so Edge is a valid answer
 * when Chrome is not installed.
 */

import { existsSync } from "node:fs"
import path from "node:path"

const BROWSER_NAMES =
    process.platform === "win32"
        ? ["chrome.exe", "msedge.exe"]
        : ["google-chrome", "chromium", "chromium-browser", "msedge"]

function browserCandidates() {
    const candidates = [process.env.CHROME_PATH]

    // Windows: build from environment variables so 32/64-bit and per-user
    // installs are covered without hardcoding a drive or directory.
    if (process.platform === "win32") {
        for (const installRoot of [
            process.env.PROGRAMFILES,
            process.env["PROGRAMFILES(X86)"],
            process.env.LOCALAPPDATA,
        ]) {
            if (!installRoot) {
                continue
            }
            candidates.push(
                path.join(
                    installRoot,
                    "Google",
                    "Chrome",
                    "Application",
                    "chrome.exe"
                ),
                path.join(
                    installRoot,
                    "Microsoft",
                    "Edge",
                    "Application",
                    "msedge.exe"
                )
            )
        }
    }

    // Every platform also scans PATH, which covers portable and
    // package-manager installs.
    for (const dir of (process.env.PATH || "").split(path.delimiter)) {
        if (!dir) {
            continue
        }
        for (const name of BROWSER_NAMES) {
            candidates.push(path.join(dir, name))
        }
    }

    candidates.push(
        "/tmp/chrome-for-testing/chrome-linux64/chrome",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    )

    return candidates.filter(Boolean)
}

export function findChrome() {
    const chrome = browserCandidates().find((candidate) => existsSync(candidate))
    if (!chrome) {
        throw new Error(
            "Chrome for Testing/Chromium not found. Set CHROME_PATH to a compatible binary."
        )
    }
    return chrome
}
