import {getKeyboard} from "../keyboards.js";
import scenes from "../scene-types.js";
import {composeWizardScene, handleMenuAction} from "./factory.js";
import {selectLanguage, sendMessage} from "../tg-helpers.js";

export const createMainScene = composeWizardScene(
    async (ctx) => {
        await sendMessage({
            ctx,
            message: ctx.config.START_TEXT,
            keyboard: getKeyboard(ctx, "main").reply(),
            imageStrapi: ctx.config.START_IMAGE
        })

        ctx.session.btnHistory = []
        ctx.session.history = ["MAIN"]

        ctx.wizard.next()
    },
    (ctx, done) => {
        const config = ctx.config

        handleMenuAction([
            {
                button: config.MAIN_KEYBOARD.LK_BTN,
                handler: (ctx) => {
                    ctx.reply(
                        config.MAIN_KEYBOARD.LK_BTN.AFTER
                            .replace(/\{username\}/g, ctx.user.username)
                            .replace(/\{name\}/g, ctx.user.name)
                            .replace(/\{package\}/g, ctx.user.package)
                            .replace(/\{deposit_date\}/g, ctx.user.deposit_date)
                            .replace(/\{withdraw_date\}/g, ctx.user.withdraw_date)
                            .replace(/\{balance\}/g, ctx.user.balance + " $")
                    )
                }
            },
            {
                button: config.MAIN_KEYBOARD.PARTNERSHIP_BTN,
                scene: scenes.PARTNERSHIP
            },
            {button: config.MAIN_KEYBOARD.CHARITY_BTN},
            {
                button: config.MAIN_KEYBOARD.CHOOSE_LOCALE,
                handler: async ctx => {
                    ctx.scene.leave()
                    selectLanguage(ctx)
                }
            }
        ])(ctx)
    }
)