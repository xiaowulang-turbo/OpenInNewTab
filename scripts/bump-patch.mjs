/**
 * Increment manifest patch, then sync userscript + website.
 */
import {
    bumpPatch,
    readManifestVersion,
    syncVersion,
    writeManifestVersion,
} from "./version-core.mjs"

const cur = readManifestVersion()
const next = bumpPatch(cur)
writeManifestVersion(next)
syncVersion(next)
console.log(`version:bump — ${cur} → ${next}`)
