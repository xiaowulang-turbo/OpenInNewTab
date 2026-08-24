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
        userPreferenceEnabled !== false
    )
}

function validateLocalizedNotice(notice, locale, errors) {
    const copy = notice[locale]
    if (!copy || typeof copy !== "object") {
        errors.push(`${locale} must be an object`)
        return
    }
    if (!copy.title) {
        errors.push(`${locale}.title is required`)
    }
    if (!copy.summary) {
        errors.push(`${locale}.summary is required`)
    }
    if (!Array.isArray(copy.highlights) || copy.highlights.length === 0) {
        errors.push(`${locale}.highlights must contain at least one item`)
    }
}

function validateUpdateNotice(notice) {
    const errors = []
    if (!notice || typeof notice !== "object") {
        return ["notice must be an object"]
    }
    if (typeof notice.showUpdateNotice !== "boolean") {
        errors.push("showUpdateNotice must be boolean")
    }
    if (notice.showUpdateNotice !== true) {
        return errors
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(notice.releaseDate || "")) {
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
