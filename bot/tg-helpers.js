import config, { getConfig } from "../modules/config.js"
import bot from "./index.js"
import { DateTime } from "luxon"
import telegramifyMarkdown from "telegramify-markdown";
import scenes from "./scene-types.js";
import strapi from "../modules/strapi.js";
import { getKeyboard } from "./keyboards.js";

export const selectLanguage = async (ctx) => {
    const config = ctx.config
    await sendMessage({
        ctx,
        message: config.SELECT_LANGUAGE_TEXT,
        keyboard: getKeyboard(ctx, "locale").reply()
    })

    return
}

export const sendMarkdownMessage = async (ctx, text, keyboard, options = {}) => {
    try {
        await ctx.replyWithMarkdown(text, {
            ...keyboard,
            ...options
        })
    } catch (e) {
        console.error(e)
        await ctx.reply("Произошла ошибка, попробуйте позже")
    }
}

export const sendMarkdownPhotoMessage = async (ctx, imageUrl, caption, keyboard, options = {}) => {
    try {
        await ctx.replyWithPhoto({ url: imageUrl }, {
            caption,
            parse_mode: "Markdown",
            ...keyboard, ...options
        })
    } catch (e) {
        console.error(e)
        await ctx.reply("Произошла ошибка, попробуйте позже")
    }
}

export const sendMessage = async ({
    imageUrl = null,
    imageStrapi = null,
    ctx,
    message,
    keyboard = {},
    chatId,
    photo = null,
    options = {}
}) => {
    options = { ...options, link_preview: false }
    message = telegramifyMarkdown(message)
    try {
        const strapiImageUrl = imageStrapi?.data?.attributes?.url
        if (strapiImageUrl) imageUrl = `http://0.0.0.0:${process.env.STRAPI_PORT}${strapiImageUrl}`

        if (ctx) {
            if (imageUrl) await ctx.replyWithPhoto({ url: imageUrl }, {
                caption: message,
                parse_mode: "MarkdownV2",
                ...keyboard, ...options
            })
            else if (photo) await bot.telegram.sendPhoto(chatId, { photo }, {
                caption: message,
                parse_mode: "MarkdownV2",
                ...keyboard, ...options
            })
            else await ctx.reply(message, {
                parse_mode: "MarkdownV2",
                ...keyboard, ...options
            })
        }
        else if (chatId) {
            if (imageUrl) await bot.telegram.sendPhoto(chatId, { url: imageUrl }, {
                caption: message,
                parse_mode: "MarkdownV2",
                ...keyboard, ...options
            })
            else if (photo) await bot.telegram.sendPhoto(chatId, { photo }, {
                caption: message,
                parse_mode: "MarkdownV2",
                ...keyboard, ...options
            })
            else await bot.telegram.sendMessage(chatId, message, {
                parse_mode: "MarkdownV2",
                ...keyboard, ...options
            })
        }
        else throw new Error('There is no chatId nor ctx present')
    } catch (e) {
        console.error(e)
        await ctx?.reply("Произошла ошибка, попробуйте позже")
    }
}

export const handleBackBtn = (ctx) => ({
    message: ctx.config.BACK_BTN.BTN_TEXT,
    handler: (ctx) => {
        if (ctx.session.history?.length) {
            ctx.session.history.pop()
            ctx.scene.enter(ctx.session.history[ctx.session.history.length - 1] || scenes.MAIN)
        } else ctx.scene.enter(scenes.MAIN)

        if (ctx.session.btnHistory?.length) {
            ctx.session.btnHistory.pop()
        }
    }
})

export const writeHistory = (currentScene, ctx) => {
    if (!ctx.session.history) ctx.session.history = []

    if (ctx.session.history.includes(currentScene)) return
    ctx.session.history.push(currentScene)
}

export const changeLocale = async (ctx, locale) => {
    await strapi.update("tg-users", {
        ...ctx.user,
        locale
    })

    ctx.user = {
        ...ctx.user,
        locale
    }
    ctx.config = getConfig(locale)
}

export default { sendMarkdownMessage, sendMarkdownPhotoMessage }