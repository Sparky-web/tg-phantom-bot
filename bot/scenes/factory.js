import { Scenes } from "telegraf";
import scenes from "../scene-types.js";
import { selectLanguage, sendMessage, writeHistory } from "../tg-helpers.js";
const { WizardScene } = Scenes

const unwrapCallback = async (ctx, nextScene) => {
    const nextSceneId = await Promise.resolve(nextScene(ctx));
    if (nextSceneId) return ctx.scene.enter(nextSceneId, ctx.scene.state);

    return ctx.scene.leave();
};

export const composeWizardScene = (...advancedSteps) => (
    /**
     * Branching extension enabled sceneFactory
     * @param sceneType {string}
     * @param nextScene {function} - async fun5c that returns nextSceneType
     */
    function createWizardScene(sceneType, nextScene) {
        return new WizardScene(
            sceneType,
            ...advancedSteps.map((stepFn) => async (ctx, next) => {
                /** ignore user action if it is neither message, nor callbackQuery */
                if (!ctx.message && !ctx.callbackQuery) return undefined;

                writeHistory(sceneType, ctx)
                return stepFn(ctx, () => unwrapCallback(ctx, nextScene), next);
            }),
        );
    }
);

export const handleMenuAction = (actions) => async (ctx, done) => {
    for (let action of actions) {
        let text = action.message
        let messageToSend = null

        if (action.button) {
            text = action.button.BTN_TEXT
            messageToSend = action.button.AFTER
        }

        if (text === ctx.message.text) {
            if (!ctx.session.btnHistory) ctx.session.btnHistory = []
            if (!ctx.session.btnHistory.includes(text) && text !== ctx.config.BACK_BTN.BTN_TEXT) ctx.session.btnHistory.push(text)

            if (action.scene) return await ctx.scene.enter(action.scene)
            if (messageToSend && !action.handler) sendMessage({ ctx, message: messageToSend })
            if (action.handler) await action.handler(ctx, done)

            return
        }

    }

    if (ctx.message.text === "/start") {
        ctx.scene.leave()
        selectLanguage(ctx)
        return
    }

    ctx.reply("Команда не найдена, используйте клавиатуру")
    ctx.scene.enter(scenes.MAIN)
}