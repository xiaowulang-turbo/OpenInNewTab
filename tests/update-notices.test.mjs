import { createRequire } from "node:module"
import assert from "node:assert/strict"
import { describe, it } from "node:test"

const {
    getUpdateNotice,
    shouldShowUpdateNotice,
    validateUpdateNotice,
} = createRequire(import.meta.url)("../extension/update-notices.js")

const validNotice = {
    showUpdateNotice: true,
    releaseDate: "2026-08-24",
    en: {
        title: "A meaningful update",
        summary: "A short user-facing summary.",
        highlights: ["A visible improvement"],
    },
    zh: {
        title: "重要更新",
        summary: "面向用户的简短摘要。",
        highlights: ["一项可感知的改进"],
    },
}

describe("update notice visibility", () => {
    it("requires both an opted-in release and enabled user preference", () => {
        assert.equal(shouldShowUpdateNotice(validNotice, true), true)
        assert.equal(shouldShowUpdateNotice(validNotice, false), false)
        assert.equal(
            shouldShowUpdateNotice(
                { ...validNotice, showUpdateNotice: false },
                true
            ),
            false
        )
        assert.equal(
            shouldShowUpdateNotice(
                { ...validNotice, en: { title: 42 } },
                true
            ),
            false
        )
        assert.equal(shouldShowUpdateNotice(null, true), false)
    })

    it("exposes the current sample notice for local testing", () => {
        const notice = getUpdateNotice("1.7.0")
        assert.equal(notice?.showUpdateNotice, true)
        assert.equal(shouldShowUpdateNotice(notice, true), true)
        assert.equal(getUpdateNotice("toString"), null)
    })
})

describe("validateUpdateNotice", () => {
    it("accepts a complete bilingual notice", () => {
        assert.deepEqual(validateUpdateNotice(validNotice), [])
    })

    it("rejects a notice missing required release content", () => {
        const errors = validateUpdateNotice({
            showUpdateNotice: true,
            releaseDate: "not-a-date",
            en: { title: "", summary: "", highlights: [] },
            zh: null,
        })

        assert.deepEqual(errors, [
            "releaseDate must use YYYY-MM-DD",
            "en.title is required",
            "en.summary is required",
            "en.highlights must contain at least one item",
            "zh must be an object",
        ])
    })

    it("allows a silent release entry without release copy", () => {
        assert.deepEqual(
            validateUpdateNotice({ showUpdateNotice: false }),
            []
        )
    })

    it("rejects invalid field types and impossible calendar dates", () => {
        const errors = validateUpdateNotice({
            showUpdateNotice: true,
            releaseDate: "2026-02-31",
            en: {
                title: 42,
                summary: null,
                highlights: ["valid", 7],
                migrationNote: 123,
            },
            zh: {
                title: "",
                summary: "有效摘要",
                highlights: [""],
            },
        })

        assert.deepEqual(errors, [
            "releaseDate must use YYYY-MM-DD",
            "en.title must be a string",
            "en.summary must be a string",
            "en.highlights must contain only non-empty strings",
            "en.migrationNote must be a string",
            "zh.title is required",
            "zh.highlights must contain only non-empty strings",
        ])
    })
})
