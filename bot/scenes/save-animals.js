import { composeWizardScene, handleMenuAction } from "./factory.js";
import { getKeyboard } from "../keyboards.js";
import scenes from "../scene-types.js";
import { handleBackBtn } from "../tg-helpers.js";
import { sendMessage } from "../tg-helpers.js";

export const createHelpAnimalsScene = composeWizardScene(
    async (ctx) => {
        const button = ctx.session.btnClicked
        await sendMessage({
            ctx,
            message: button.AFTER, 
            keyboard: getKeyboard(ctx, "help-animals").reply(),
            imageStrapi: button.IMAGE

        })
        ctx.wizard.next()
    },
    (ctx) => {
        const config = ctx.config

        handleMenuAction([
            {
                button: config.HELP_ANIMALS_BTN,
            },
            handleBackBtn(ctx)
        ])(ctx)
    }
);