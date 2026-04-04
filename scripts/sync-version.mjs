/**
 * Sync userscript @version and website meta from extension/manifest.json.
 */
import { readManifestVersion, syncVersion } from "./version-core.mjs"

const v = readManifestVersion()
syncVersion(v)
console.log(`version:sync — aligned to ${v}`)
