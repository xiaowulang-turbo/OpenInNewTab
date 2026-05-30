/**
 * Bump userscript patch version. Updates both the `// @version` metadata
 * line (consumed by Tampermonkey) and the `SCRIPT_VERSION` constant
 * (rendered in the About section). Does NOT touch the extension manifest.
 */
import {
    bumpPatch,
    readUserscriptVersion,
    writeUserscriptVersion,
} from "./version-core.mjs"

const { atVersion, constVersion } = readUserscriptVersion()
if (atVersion !== constVersion) {
    console.error(
        `Refusing to bump: userscript versions disagree (// @version=${atVersion}, SCRIPT_VERSION=${constVersion}). Fix manually first.`
    )
    process.exit(1)
}
const next = bumpPatch(atVersion)
writeUserscriptVersion(next)
console.log(`version:bump:us — userscript ${atVersion} → ${next}`)
