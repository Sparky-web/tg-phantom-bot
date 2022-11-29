import { Telegraf } from 'telegraf'
import { getConfig } from '../modules/config.js'
import events from "./events.js"

const bot = new Telegraf(process.env.BOT_TOKEN)

events.register(bot)

bot.launch().then(() => {
    console.log("Bot launched")
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot