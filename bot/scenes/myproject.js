import { composeWizardScene, handleMenuAction } from "./factory.js";
import { getKeyboard } from "../keyboards.js";
import scenes from "../scene-types.js";
import { handleBackBtn } from "../tg-helpers.js";
import { sendMessage } from "../tg-helpers.js";

export const createMyProjectScene = composeWizardScene(
    async (ctx) => {
        const button = ctx.config.MAIN_KEYBOARD.MY_PROJECT_BTN
        await sendMessage({
            ctx,
            message: button.AFTER, 
            keyboard: getKeyboard(ctx, "my-project").reply(),
            imageStrapi: button.IMAGE
        })
        ctx.wizard.next()
    },
    (ctx) => {
        const config = ctx.config

        handleMenuAction([
            ...config.MY_PROJECT_KEYBOARD.map(btn => ({
                // button: btn,
                message: btn.BTN_TEXT,
                handler: async (ctx) => {
                    ctx.session.btnClicked = btn
                    ctx.scene.enter(scenes.QUESTION)
                }
            })),
            handleBackBtn(ctx)
        ])(ctx)
    }
);