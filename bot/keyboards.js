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
                toButtons([config.MAIN_KEYBOARD.MY_PROJECT_BTN, config.MAIN_KEYBOARD.PARTNERSHIP_BTN]),
                toButtons([config.MAIN_KEYBOARD.CHARITY_BTN]),
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
        case 'my-project': {
            result = ([
                ..._.chunk(toButtons(config.MY_PROJECT_KEYBOARD), 2),
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
        case 'question': 
            result = ([
                toButtons([config.ASK_QUESTION_BTN]),
                toButtons([config.BACK_BTN])
            ])
            break
        case 'help-animals': 
            result = ([
                toButtons([config.HELP_ANIMALS_BTN]),
                toButtons([config.BACK_BTN])
            ])
            break
        case 'locale': {
            result = ["English", "Русский"]
        }
    }

    if (addButtons) result = [...result, toButtons(addButtons)]

    return Keyboard.make(result)
}

export { getKeyboard }