/**
 * Versioned, local update notices shared by the service worker and welcome page.
 * Keep this file classic so it can be loaded by importScripts and HTML.
 */

/* global module */

const UPDATE_NOTICES = {
    "1.7.0": {
        showUpdateNotice: true,
        releaseDate: "2026-08-24",
        en: {
            title: "A more reliable way to open links",
            summary:
                "This update makes link handling more responsive and keeps your preferences in sync without requiring a page refresh.",
            highlights: [
                "Whitelist changes now take effect immediately.",
                "Background-tab opening is handled reliably by the extension service worker.",
                "Link types that should keep their native behavior are skipped more consistently.",
            ],
        },
        zh: {
            title: "更可靠的链接打开体验",
            summary:
                "本次更新让链接处理更加及时，设置变更无需刷新页面即可生效。",
            highlights: [
                "白名单变更现在会立即生效。",
                "后台打开新标签由扩展 Service Worker 更可靠地处理。",
                "需要保持浏览器原生行为的链接类型会被更一致地跳过。",
            ],
        },
    },
}

function getUpdateNotice(version) {
    if (typeof version !== "string" || !version) {
        return null
    }
    if (!Object.prototype.hasOwnProperty.call(UPDATE_NOTICES, version)) {
        return null
    }
    return UPDATE_NOTICES[version]
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
    if (
        copy.migrationNote !== undefined &&
        typeof copy.migrationNote !== "string"
    ) {
        errors.push(`${locale}.migrationNote must be a string`)
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
