import { Keyboard } from "telegram-keyboard"
import _config from "../modules/config.js"
import _ from "lodash"

const toButtons = (obj) => obj ? obj.map(e => e?.BTN_TEXT).filter(e => e) : []

const getKeyboard = (ctx, keyboard = "main", addButtons) => {
    const config = ctx.config

    let result

    switch (keyboard) {
        case 'main': {
            result = ([
                toButtons([config.MAIN_KEYBOARD.LK_BTN, config.MAIN_KEYBOARD.PARTNERSHIP_BTN]),
                toButtons([config.MAIN_KEYBOARD.CHARITY_BTN, config.MAIN_KEYBOARD.DEALS_BTN]),
                toButtons([config.MAIN_KEYBOARD.CHOOSE_LOCALE])
            ])
            break
        }
        case 'partnership': {
            result = ([
                ..._.chunk(toButtons(config.PARTNERSHIP_KEYBOARD), 2),
                toButtons([config.BACK_BTN])
            ])
            break
        }
        case 'back': {
            result = ([
                [config.BACK_BTN.BTN_TEXT]
            ])
            break
        }
        case 'locale': {
            result = ["Русский", "English"]
        }
    }

    if (addButtons) result = [...result, toButtons(addButtons)]

    return Keyboard.make(result)
}

export { getKeyboard }