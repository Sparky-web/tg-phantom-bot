import { getKeyboard } from "../keyboards.js";
import scenes from "../scene-types.js";
import { composeWizardScene, handleMenuAction } from "./factory.js";
import { selectLanguage, sendMessage } from "../tg-helpers.js";

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
                button: config.MAIN_KEYBOARD.MY_PROJECT_BTN,
                scene: scenes.MY_PROJECT
            },
            {
                button: config.MAIN_KEYBOARD.PARTNERSHIP_BTN,
                scene: scenes.PARTNERSHIP
            },
            {
                button: config.MAIN_KEYBOARD.CHARITY_BTN,
                handler: async (ctx) => {
                    ctx.session.btnClicked = config.MAIN_KEYBOARD.CHARITY_BTN
                    ctx.scene.enter(scenes.HELP_ANIMALS)
                }
            },
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