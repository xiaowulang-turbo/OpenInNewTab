/**
 * Exit 1 if manifest, userscript, and website meta disagree.
 */
import { verifyVersion } from "./version-core.mjs"

try {
    verifyVersion()
    console.log("version:verify — OK")
} catch (e) {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
}
