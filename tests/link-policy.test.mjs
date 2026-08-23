import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
    isHostAllowed,
    shouldSkipClick,
    shouldSkipHref,
} from "../extension/link-policy.js"

describe("isHostAllowed", () => {
    it("rejects empty hostname or non-array whitelist", () => {
        assert.equal(isHostAllowed("github.com", []), false)
        assert.equal(isHostAllowed("", ["github.com"]), false)
        assert.equal(isHostAllowed("github.com", null), false)
    })

    it("matches an exact host and subdomains, not a suffix sibling", () => {
        const list = ["github.com"]
        assert.equal(isHostAllowed("github.com", list), true)
        assert.equal(isHostAllowed("gist.github.com", list), true)
        assert.equal(isHostAllowed("notgithub.com", list), false)
    })
})

describe("shouldSkipHref", () => {
    it("skips empty, javascript, mailto, tel, and in-page hashes", () => {
        assert.equal(shouldSkipHref(null), true)
        assert.equal(shouldSkipHref(""), true)
        assert.equal(shouldSkipHref("javascript:void(0)"), true)
        assert.equal(shouldSkipHref("mailto:a@b.c"), true)
        assert.equal(shouldSkipHref("tel:+15551212"), true)
        assert.equal(shouldSkipHref("#section"), true)
        assert.equal(shouldSkipHref("https://example.com/a"), false)
        assert.equal(shouldSkipHref("/relative"), false)
    })
})

function click(overrides = {}) {
    return {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        button: 0,
        ...overrides,
    }
}

function anchor(attrs = {}) {
    const href = "href" in attrs ? attrs.href : "https://example.com"
    return {
        hasAttribute: (name) => name === "download" && attrs.download === true,
        getAttribute: (name) => (name === "href" ? href : null),
    }
}

describe("shouldSkipClick", () => {
    it("skips download links and modified / middle clicks", () => {
        assert.equal(shouldSkipClick(click(), anchor({ download: true })), true)
        assert.equal(shouldSkipClick(click({ ctrlKey: true }), anchor()), true)
        assert.equal(shouldSkipClick(click({ metaKey: true }), anchor()), true)
        assert.equal(shouldSkipClick(click({ shiftKey: true }), anchor()), true)
        assert.equal(shouldSkipClick(click({ button: 1 }), anchor()), true)
        assert.equal(shouldSkipClick(click(), anchor()), false)
    })
})
