import js from "@eslint/js"
import globals from "globals"

/**
 * Flat ESLint config. Each surface gets only the globals it actually runs with,
 * so undefined-variable checks stay meaningful across the monorepo.
 */
export default [
    { ignores: ["node_modules/**", "release/**", "**/*.min.js"] },
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars": ["error", { caughtErrors: "none" }],
        },
    },
    {
        files: ["extension/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: { ...globals.browser, ...globals.webextensions },
        },
    },
    {
        files: ["userscript/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: { ...globals.browser, ...globals.greasemonkey },
        },
    },
    {
        files: ["website/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: { ...globals.browser },
        },
    },
    {
        // `translations` is a top-level const defined in i18n.js and shared
        // across the page's classic scripts; script.js consumes it.
        files: ["website/script.js"],
        languageOptions: {
            globals: { translations: "readonly" },
        },
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.node },
        },
    },
]
