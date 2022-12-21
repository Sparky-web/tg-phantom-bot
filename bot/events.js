import { Scenes } from 'telegraf'

import strapi from '../modules/strapi.js'
import scenes from './scene-types.js'
import LocalSession from 'telegraf-session-local'
import { getConfig } from '../modules/config.js'
import { createMainScene } from './scenes/main.js'
import {createPartnershipScene} from "./scenes/partnership.js";
import { changeLocale, selectLanguage } from './tg-helpers.js'

const userMiddleware = async (ctx, next) => {
    let [user] = await strapi.get("tg-users", { filters: { uId: ctx.chat.id } })

    if (!user) user = await strapi.create("tg-users", {
        uId: ctx.chat.id,
        username: ctx.chat.username,
        locale: null
    })

    ctx.user = user
    await next(ctx)
}

const configMiddleware = async (ctx, next) => {
    ctx.config = getConfig(ctx.user?.locale || "ru")
    await next()
}

const locales = [
    {text: "Русский", locale: "ru"},
    {text: "English", locale: "en"},
]

export const register = (bot) => {
    // to keep users in db

    const stage = new Scenes.Stage([
        createMainScene(scenes.MAIN),
        createPartnershipScene(scenes.PARTNERSHIP),
    ])

    bot.use(userMiddleware)
    bot.use(configMiddleware)
    bot.use((new LocalSession({ database: 'db.json' })).middleware())
    bot.use(stage.middleware());

    for(let {text, locale} of locales) {
        bot.hears(text, async ctx => {
            await changeLocale(ctx, locale)
            ctx.scene.enter(scenes.MAIN)
        })
    }
    
    bot.start(selectLanguage)
    bot.on("message", selectLanguage)
}

export default { register }