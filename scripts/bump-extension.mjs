/**
 * Bump extension patch version, then sync website meta tags.
 * Does NOT touch the userscript — extension and userscript ship on
 * independent SemVer tracks.
 */
import {
    bumpPatch,
    readExtensionVersion,
    syncWebsiteAppVersion,
    writeExtensionVersion,
} from "./version-core.mjs"

const cur = readExtensionVersion()
const next = bumpPatch(cur)
writeExtensionVersion(next)
syncWebsiteAppVersion(next)
console.log(`version:bump:ext — extension ${cur} → ${next} (website synced)`)
