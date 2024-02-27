import { composeWizardScene, handleMenuAction } from "./factory.js";
import { getKeyboard } from "../keyboards.js";
import scenes from "../scene-types.js";
import { handleBackBtn } from "../tg-helpers.js";
import { sendMessage } from "../tg-helpers.js";

export const createPartnershipScene = composeWizardScene(
    async (ctx) => {
        const button = ctx.config.MAIN_KEYBOARD.PARTNERSHIP_BTN
        await sendMessage({
            ctx,
            message: button.AFTER, 
            keyboard: getKeyboard(ctx, "partnership").reply(),
            imageStrapi: button.IMAGE,
            imageUrl: button.imageUrl
        })
        ctx.wizard.next()
    },
    (ctx) => {
        const config = ctx.config

        handleMenuAction([
            ...config.PARTNERSHIP_KEYBOARD.map(btn => ({
                // button: btn,
                // scene: scenes.QUESTION
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