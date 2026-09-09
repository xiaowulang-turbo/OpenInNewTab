/**
 * Publish the extension zip to the Chrome Web Store via the official
 * Chrome Web Store API v2. Requires Node >= 18 (global fetch).
 *
 * Design (方案 A — lightweight, maintainer-machine only):
 *   - No third-party deps: native fetch + node:http OAuth loopback flow.
 *   - Credentials live OUTSIDE the repo (default ~/.config/open-in-new-tab/
 *     cws.json, override with --config or $CWS_CONFIG), never committed.
 *   - Explicit, separate steps so a human reviews each one:
 *       1. login   — one-time OAuth bootstrap (desktop-app client + refresh token)
 *       2. upload  — push release/OpenInNewTab-extension-<version>.zip, poll to done
 *       3. publish — submit for review (DEFAULT_PUBLISH) or stage (STAGED_PUBLISH)
 *       4. status  — read current item / submission state
 *
 * References:
 *   - CWS API v2 announcement: developer.chrome.com/blog/cws-api-v2
 *   - media.upload / publishers.items.* REST reference:
 *     developer.chrome.com/docs/webstore/api/reference/rest/v2/...
 *   - V1 is deprecated and shuts down 2026-10-15 — this script targets V2 only.
 *
 * Config fields (env overrides win over the config file):
 *   clientId     = CWS_CLIENT_ID       — Desktop-app OAuth client ID
 *   clientSecret = CWS_CLIENT_SECRET   — Desktop-app OAuth client secret
 *   publisherId  = CWS_PUBLISHER_ID    — numeric publisher ID (CWS dashboard)
 *   itemId       = CWS_ITEM_ID         — extension ID (store URL / chrome://extensions)
 *   refreshToken = CWS_REFRESH_TOKEN   — obtained by `store:chrome login`
 *
 * Usage:
 *   npm run pack:extension            # build release/OpenInNewTab-extension-*.zip
 *   npm run store:chrome -- login
 *   npm run store:chrome -- upload              # or: --zip release/xxx.zip
 *   npm run store:chrome -- publish             # or: --staged
 *   npm run store:chrome -- status
 */

import { createServer } from "node:http"
import { randomBytes } from "node:crypto"
import { execFile } from "node:child_process"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import process from "node:process"
import readline from "node:readline/promises"

const SCOPE = "https://www.googleapis.com/auth/chromewebstore"
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const TOKEN_URL = "https://oauth2.googleapis.com/token"
const API_BASE = "https://chromewebstore.googleapis.com"
const UPLOAD_BASE = "https://chromewebstore.googleapis.com/upload"

const ZIP_GLOB = /^OpenInNewTab-extension-.*\.zip$/

// Config fields that may also be provided via environment variables.
const ENV_FIELDS = {
    clientId: "CWS_CLIENT_ID",
    clientSecret: "CWS_CLIENT_SECRET",
    publisherId: "CWS_PUBLISHER_ID",
    itemId: "CWS_ITEM_ID",
    refreshToken: "CWS_REFRESH_TOKEN",
}

class UsageError extends Error {}

/* ------------------------------------------------------------------ */
/* Config persistence (kept outside the repo on purpose)               */
/* ------------------------------------------------------------------ */

function defaultConfigPath() {
    const base =
        process.env.CWS_CONFIG ||
        process.env.XDG_CONFIG_HOME ||
        path.join(os.homedir(), ".config")
    return path.join(base, "open-in-new-tab", "cws.json")
}

async function loadConfig(filePath) {
    let stored = {}
    try {
        stored = JSON.parse(await readFile(filePath, "utf8"))
    } catch {
        // First run — no config file yet; env + prompts will fill it in.
    }
    const cfg = { ...stored }
    for (const [field, envName] of Object.entries(ENV_FIELDS)) {
        if (process.env[envName]) cfg[field] = process.env[envName]
    }
    cfg.filePath = filePath
    return cfg
}

async function saveConfig(cfg) {
    const { filePath, ...rest } = cfg
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(filePath, `${JSON.stringify(rest, null, 4)}\n`, "utf8")
    console.log(`store:chrome — wrote credentials to ${filePath}`)
}

/* ------------------------------------------------------------------ */
/* Small CLI helpers                                                   */
/* ------------------------------------------------------------------ */

async function prompt(rl, label, { required = true } = {}) {
    for (;;) {
        const answer = (await rl.question(`${label}: `)).trim()
        if (answer || !required) return answer
        console.log(`  (required — ${label})`)
    }
}

/** Fill any missing config fields interactively. */
async function ensureConfigFields(cfg, hints) {
    const missing = ["clientId", "clientSecret", "publisherId", "itemId"].filter(
        (f) => !cfg[f],
    )
    if (missing.length === 0) return
    console.log("store:chrome — a few one-time values are needed. Hints:")
    for (const hint of hints) console.log(`  - ${hint}`)
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    try {
        for (const field of missing) {
            const isSecret = field === "clientSecret"
            const label = isSecret ? `${field} (secret, will be stored in the config file)` : field
            cfg[field] = await prompt(rl, label)
        }
    } finally {
        rl.close()
    }
}

function openBrowser(url) {
    const { platform } = process
    const [command, args] =
        platform === "win32"
            // Quote the URL so cmd does not interpret `&`/`?` query separators.
            ? ["cmd", ["/c", "start", "", `"${url}"`]]
            : platform === "darwin"
              ? ["open", [url]]
              : ["xdg-open", [url]]
    // Best-effort; failures just mean the user opens the URL manually.
    execFile(command, args, () => {})
}

/* ------------------------------------------------------------------ */
/* OAuth (desktop-app client, loopback redirect, auto refresh)         */
/* ------------------------------------------------------------------ */

async function setTokens(cfg, { access_token, refresh_token, expires_in }) {
    cfg.accessToken = access_token
    cfg.accessTokenExpiresAt = Date.now() + (expires_in - 60) * 1000
    if (refresh_token) cfg.refreshToken = refresh_token
    await saveConfig(cfg)
}

function needsTokenRefresh(cfg) {
    return !cfg.accessToken || Date.now() >= (cfg.accessTokenExpiresAt || 0)
}

async function refreshAccessToken(cfg) {
    const body = new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        refresh_token: cfg.refreshToken,
        grant_type: "refresh_token",
    })
    const json = await postForm(TOKEN_URL, body, "refresh access token")
    if (!json.access_token) throw new Error("refresh token exchange returned no access_token")
    await setTokens(cfg, json)
    return cfg.accessToken
}

async function ensureAccessToken(cfg) {
    if (!cfg.refreshToken) {
        throw new UsageError("no refresh token — run `npm run store:chrome -- login` first")
    }
    if (needsTokenRefresh(cfg)) {
        console.log("store:chrome — refreshing access token…")
        await refreshAccessToken(cfg)
    }
    return cfg.accessToken
}

/** Exchange an OAuth authorization code (loopback flow) for tokens. */
async function exchangeCode(cfg, code, redirectUri) {
    const body = new URLSearchParams({
        code,
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    })
    const json = await postForm(TOKEN_URL, body, "exchange authorization code")
    if (!json.refresh_token) {
        throw new Error(
            "no refresh_token returned. Re-run login after making sure the OAuth " +
                "consent screen grants access_type=offline (prompt=consent forces it).",
        )
    }
    await setTokens(cfg, json)
}

/** Open a local redirect server, send the user to Google, return the code. */
async function runLoginFlow(cfg) {
    const server = createServer()
    const state = randomBytes(16).toString("hex")
    const codePromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(
            () => reject(new Error("timed out waiting for the OAuth redirect")),
            5 * 60 * 1000,
        )
        server.on("request", (req, res) => {
            const url = new URL(req.url, "http://127.0.0.1")
            if (url.pathname !== "/" || !url.searchParams.get("code")) {
                res.writeHead(404).end("Not found")
                return
            }
            if (url.searchParams.get("state") !== state) {
                res.writeHead(400).end("State mismatch")
                return
            }
            clearTimeout(timeout)
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
            res.end("<p>Auth received — you can close this tab.</p>")
            resolve(url.searchParams.get("code"))
        })
        server.on("error", reject)
    })

    await new Promise((resolve, reject) => {
        server.once("error", reject)
        server.listen(0, "127.0.0.1", resolve)
    })
    const { port } = server.address()

    const redirectUri = `http://127.0.0.1:${port}/`
    const params = new URLSearchParams({
        client_id: cfg.clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: SCOPE,
        access_type: "offline",
        prompt: "consent",
        state,
    })
    const authUrl = `${AUTH_URL}?${params}`
    console.log(`store:chrome — opening browser; if it does not open, visit:\n  ${authUrl}`)
    openBrowser(authUrl)

    try {
        const code = await codePromise
        await exchangeCode(cfg, code, redirectUri)
        console.log("store:chrome — login OK; refresh token saved.")
    } finally {
        // Avoid keeping the process alive on a lingering keep-alive socket.
        server.closeAllConnections?.()
        server.close()
    }
}

/* ------------------------------------------------------------------ */
/* Google API plumbing                                                 */
/* ------------------------------------------------------------------ */

async function readJsonResponse(res, context) {
    const text = await res.text()
    let json
    try {
        json = JSON.parse(text)
    } catch {
        json = null
    }
    if (!res.ok) {
        const message = json?.error?.message || json?.error_description || json?.error || text
        throw new Error(`API ${context} failed (${res.status}): ${message}`)
    }
    return json ?? {}
}

function apiHeaders(cfg, extra = {}) {
    return {
        Authorization: `Bearer ${cfg.accessToken}`,
        Accept: "application/json",
        ...extra,
    }
}

async function apiFetch(url, options, context) {
    let res
    try {
        res = await fetch(url, { ...options, signal: AbortSignal.timeout(30_000) })
    } catch (err) {
        throw new Error(`API ${context} network error: ${err.message}`, { cause: err })
    }
    return readJsonResponse(res, context)
}

async function postForm(url, body, context) {
    let res
    try {
        res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
            signal: AbortSignal.timeout(30_000),
        })
    } catch (err) {
        throw new Error(`API ${context} network error: ${err.message}`, { cause: err })
    }
    return readJsonResponse(res, context)
}

async function getItemStatus(cfg) {
    const url = `${API_BASE}/v2/publishers/${cfg.publisherId}/items/${cfg.itemId}:fetchStatus`
    return apiFetch(url, { headers: apiHeaders(cfg) }, "fetchStatus")
}

/* ------------------------------------------------------------------ */
/* Subcommands                                                         */
/* ------------------------------------------------------------------ */

async function cmdLogin(cfg) {
    const hints = [
        "clientId / clientSecret: Google Cloud → APIs & Services → Credentials →",
        "  OAuth client ID, type \"Desktop app\" (Chrome Web Store API must be enabled).",
        "publisherId: numeric publisher ID shown in the CWS Developer Dashboard",
        "  (https://chrome.google.com/webstore/devconsole).",
        "itemId: the extension ID (store item URL / chrome://extensions).",
    ]
    await ensureConfigFields(cfg, hints)
    await runLoginFlow(cfg)
}

/** Resolve the zip to upload: explicit --zip wins, else the single release zip. */
async function resolveZip(opts) {
    if (opts.zip) {
        if (!opts.zip.endsWith(".zip")) throw new UsageError(`--zip must point to a .zip: ${opts.zip}`)
        return opts.zip
    }
    const release = path.join(process.cwd(), "release")
    const matches = (await readdir(release).catch(() => [])).filter((n) => ZIP_GLOB.test(n))
    if (matches.length === 0) {
        throw new UsageError(
            `no ${ZIP_GLOB} in ${release} — run \`npm run pack:extension\` first`,
        )
    }
    if (matches.length > 1) {
        throw new UsageError(
            `multiple release zips found (${matches.join(", ")}). Pick one with --zip.`,
        )
    }
    return path.join(release, matches[0])
}

/** Upload the zip and poll until the async processing reaches a terminal state. */
async function cmdUpload(cfg, opts) {
    await ensureAccessToken(cfg)

    const zipPath = await resolveZip(opts)
    const zipBuffer = await readFile(zipPath)
    console.log(`store:chrome — uploading ${path.basename(zipPath)} (${zipBuffer.length} bytes)`)

    const url = `${UPLOAD_BASE}/v2/publishers/${cfg.publisherId}/items/${cfg.itemId}:upload`
    const result = await apiFetch(
        url,
        { method: "POST", headers: apiHeaders(cfg, { "Content-Type": "application/zip" }), body: zipBuffer },
        "upload",
    )

    if (isUploadState(result.uploadState, "progress")) {
        console.log("store:chrome — upload accepted, waiting for package processing…")
        const finalState = await pollUpload(cfg)
        if (!isUploadState(finalState, "success")) {
            throw new Error(`upload did not succeed (final state: ${finalState})`)
        }
    } else if (!isUploadState(result.uploadState, "success")) {
        throw new Error(`upload failed (uploadState: ${result.uploadState || "unknown"})`)
    }
    console.log(`store:chrome — upload OK${result.crxVersion ? ` (crxVersion ${result.crxVersion})` : ""}`)
    await verifyUploadedVersion(result.crxVersion)
}

/** Whether an upload state string means progress / success (accepts both v1/v2 spellings). */
function isUploadState(state, kind) {
    if (!state) return false
    const progress = ["IN_PROGRESS", "UPLOAD_IN_PROGRESS"]
    const success = ["SUCCEEDED", "SUCCESS"]
    return kind === "progress" ? progress.includes(state) : success.includes(state)
}

async function pollUpload(cfg, { timeoutMs = 120_000, intervalMs = 3_000 } = {}) {
    const deadline = Date.now() + timeoutMs
    for (;;) {
        await new Promise((r) => setTimeout(r, intervalMs))
        const status = await getItemStatus(cfg)
        const state = status.lastAsyncUploadState
        if (isUploadState(state, "progress")) continue
        if (state) {
            console.log(`store:chrome — package processing done: ${state}`)
            return state
        }
        if (Date.now() > deadline) {
            throw new Error("timed out waiting for upload processing — run `store:chrome status`")
        }
        console.log("store:chrome — upload state not yet reported, polling…")
    }
}

/** Cross-check the uploaded crxVersion against the local manifest. */
async function verifyUploadedVersion(crxVersion) {
    if (!crxVersion) return
    const manifestPath = path.join(process.cwd(), "extension", "manifest.json")
    let manifestVersion
    try {
        manifestVersion = JSON.parse(await readFile(manifestPath, "utf8")).version
    } catch {
        return // manifest unreadable — skip the sanity check.
    }
    if (manifestVersion && manifestVersion !== crxVersion) {
        console.warn(
            `store:chrome — WARNING: uploaded package is ${crxVersion} but local ` +
                `manifest.json says ${manifestVersion}. Did you pack the right build?`,
        )
    }
}

async function cmdPublish(cfg, opts) {
    await ensureAccessToken(cfg)
    const url = `${API_BASE}/v2/publishers/${cfg.publisherId}/items/${cfg.itemId}:publish`
    const body = { publishType: opts.staged ? "STAGED_PUBLISH" : "DEFAULT_PUBLISH" }
    const result = await apiFetch(
        url,
        { method: "POST", headers: apiHeaders(cfg, { "Content-Type": "application/json" }), body: JSON.stringify(body) },
        "publish",
    )
    const warnings = result.warningInfo?.warnings ?? []
    for (const w of warnings) console.warn(`store:chrome — warning: ${w.reason}: ${w.description}`)
    const state = result.state || "unknown"
    if (state === "REJECTED" || state === "CANCELLED") {
        throw new Error(`publish failed (state: ${state})`)
    }
    console.log(
        `store:chrome — submitted for review (state: ${state})${opts.staged ? " [STAGED — approve manually later]" : ""}`,
    )
}

async function cmdStatus(cfg) {
    await ensureAccessToken(cfg)
    const s = await getItemStatus(cfg)
    console.log(`item:      ${s.itemId ?? cfg.itemId}`)
    if (s.publishedItemRevisionStatus) {
        const { state, distributionChannels } = s.publishedItemRevisionStatus
        console.log(`published: ${state}${channelsText(distributionChannels)}`)
    } else {
        console.log("published: (none)")
    }
    if (s.submittedItemRevisionStatus) {
        const { state, distributionChannels } = s.submittedItemRevisionStatus
        console.log(`submitted: ${state}${channelsText(distributionChannels)}`)
    } else {
        console.log("submitted: (none)")
    }
    console.log(`last async upload: ${s.lastAsyncUploadState ?? "(none)"}`)
    if (s.takenDown) console.warn("store:chrome — WARNING: item was taken down for a policy violation")
    if (s.warned) console.warn("store:chrome — WARNING: item received a policy warning")
}

function channelsText(channels) {
    if (!channels || channels.length === 0) return ""
    return channels
        .map((c) => ` (${c.crxVersion}, ${c.deployPercentage ?? 100}%)`)
        .join("")
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

function usage() {
    return `Upload the extension to the Chrome Web Store (official API v2).

Usage:
  npm run store:chrome -- <command> [options]

Commands:
  login     One-time OAuth bootstrap (needs clientId/clientSecret/publisherId/itemId).
  upload    Upload the release zip; waits until package processing completes.
            Options: --zip <path>  (default: the single file in release/)
  publish   Submit the uploaded package for review. Options: --staged
  status    Show current item / submission state.
  help      Show this message.

Options:
  --config <path>   Credentials file (default: ~/.config/open-in-new-tab/cws.json,
                    or $CWS_CONFIG).

Environment overrides:
  CWS_CLIENT_ID CWS_CLIENT_SECRET CWS_PUBLISHER_ID CWS_ITEM_ID CWS_REFRESH_TOKEN
`
}

async function parseArgs(argv) {
    const cmd = argv[0] ?? "help"
    const opts = { config: process.env.CWS_CONFIG }
    const takesValue = (i) => argv[i + 1] && !argv[i + 1].startsWith("--")
    for (let i = 1; i < argv.length; i++) {
        const arg = argv[i]
        if (arg === "--staged") opts.staged = true
        else if (arg === "--help") return { cmd: "help", opts }
        else if (arg.startsWith("--zip=")) opts.zip = arg.slice("--zip=".length)
        else if (arg === "--zip" && takesValue(i)) opts.zip = argv[++i]
        else if (arg.startsWith("--config=")) opts.config = arg.slice("--config=".length)
        else if (arg === "--config" && takesValue(i)) opts.config = argv[++i]
        else throw new UsageError(`unknown option: ${arg}`)
    }
    return { cmd, opts }
}

async function main() {
    const { cmd, opts } = await parseArgs(process.argv.slice(2))
    const filePath = opts.config || defaultConfigPath()

    switch (cmd) {
        case "help":
            console.log(usage())
            return
        case "login": {
            const cfg = await loadConfig(filePath)
            await cmdLogin(cfg)
            return
        }
        case "upload":
        case "publish":
        case "status": {
            const cfg = await loadConfig(filePath)
            const required = ["clientId", "clientSecret", "publisherId", "itemId", "refreshToken"]
            const missing = required.filter((f) => !cfg[f])
            if (missing.length > 0) {
                throw new UsageError(
                    `missing config field(s): ${missing.join(", ")} — run \`npm run store:chrome -- login\` first`,
                )
            }
            if (cmd === "upload") await cmdUpload(cfg, opts)
            else if (cmd === "publish") await cmdPublish(cfg, opts)
            else await cmdStatus(cfg)
            return
        }
        default:
            throw new UsageError(`unknown command: ${cmd}\n\n${usage()}`)
    }
}

main().catch((err) => {
    console.error(`store:chrome — ${err instanceof Error ? err.message : err}`)
    process.exitCode = 1
})
