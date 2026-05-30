/**
 * Verify cross-file version invariants. Exit 1 on any mismatch.
 *
 * Scope (after the v1.7.x decoupling):
 *   - extension/manifest.json  ==  website/{index,privacy-policy}.html
 *     <meta name="app-version" />
 *   - userscript // @version  ==  userscript SCRIPT_VERSION constant
 *
 * Extension and userscript versions are NOT compared — they ship on
 * independent SemVer tracks.
 */
import { verifyVersion } from "./version-core.mjs"

try {
    verifyVersion()
    console.log("version:verify — OK")
} catch (e) {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
}
