import { composeWizardScene, handleMenuAction } from "./factory.js";
import { getKeyboard } from "../keyboards.js";
import scenes from "../scene-types.js";
import { handleBackBtn } from "../tg-helpers.js";
import { sendMessage } from "../tg-helpers.js";

export const createQuestionScene = composeWizardScene(
    async (ctx) => {
        const button = ctx.session.btnClicked
	    console.log(button)
        await sendMessage({
            ctx,
            message: button.AFTER, 
            keyboard: getKeyboard(ctx, "question").reply(),
            imageStrapi: button.IMAGE,
            imageUrl: button.imageUrl
        })
        ctx.wizard.next()
    },
    (ctx) => {
        const config = ctx.config

        handleMenuAction([
            {
                button: config.ASK_QUESTION_BTN,
            },
            handleBackBtn(ctx)
        ])(ctx)
    }
);
