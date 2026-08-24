/**
 * Versioned, local update notices shared by the service worker and welcome page.
 * Keep this file classic so it can be loaded by importScripts and HTML.
 */

/* global module */

const UPDATE_NOTICES = {
    "1.7.0": {
        showUpdateNotice: false,
    },
}

function getUpdateNotice(version) {
    if (typeof version !== "string" || !version) {
        return null
    }
    return UPDATE_NOTICES[version] || null
}

function shouldShowUpdateNotice(notice, userPreferenceEnabled) {
    return (
        notice?.showUpdateNotice === true &&
        validateUpdateNotice(notice).length === 0 &&
        userPreferenceEnabled !== false
    )
}

function validateLocalizedNotice(notice, locale, errors) {
    const copy = notice[locale]
    if (
        !copy ||
        typeof copy !== "object" ||
        Array.isArray(copy)
    ) {
        errors.push(`${locale} must be an object`)
        return
    }
    if (typeof copy.title !== "string") {
        errors.push(`${locale}.title must be a string`)
    } else if (!copy.title.trim()) {
        errors.push(`${locale}.title is required`)
    }
    if (typeof copy.summary !== "string") {
        errors.push(`${locale}.summary must be a string`)
    } else if (!copy.summary.trim()) {
        errors.push(`${locale}.summary is required`)
    }
    if (!Array.isArray(copy.highlights) || copy.highlights.length === 0) {
        errors.push(`${locale}.highlights must contain at least one item`)
    } else if (
        copy.highlights.some(
            (item) => typeof item !== "string" || !item.trim()
        )
    ) {
        errors.push(
            `${locale}.highlights must contain only non-empty strings`
        )
    }
}

function isValidReleaseDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false
    }
    const [year, month, day] = value.split("-").map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    )
}

function validateUpdateNotice(notice) {
    const errors = []
    if (
        !notice ||
        typeof notice !== "object" ||
        Array.isArray(notice)
    ) {
        return ["notice must be an object"]
    }
    if (typeof notice.showUpdateNotice !== "boolean") {
        errors.push("showUpdateNotice must be boolean")
    }
    if (notice.showUpdateNotice !== true) {
        return errors
    }
    if (!isValidReleaseDate(notice.releaseDate)) {
        errors.push("releaseDate must use YYYY-MM-DD")
    }
    validateLocalizedNotice(notice, "en", errors)
    validateLocalizedNotice(notice, "zh", errors)
    return errors
}

const updateNoticeApi = {
    getUpdateNotice,
    shouldShowUpdateNotice,
    validateUpdateNotice,
}

globalThis.OpenInNewTabUpdateNotices = updateNoticeApi

if (typeof module === "object" && module.exports) {
    module.exports = {
        ...updateNoticeApi,
    }
}
