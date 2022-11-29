import dotenv from "dotenv"
dotenv.config()

import input from 'input';
import filesystem from "./filesystem.js";

const loadEnvVar = async (name, requestText, defaultValue) => {
    if (!process.env[name]) {
        const value = await input.text(requestText) || defaultValue
        if(!value) throw new Error("Нужно ввести значение") 
        await filesystem.appendToFile(".env", name + "=" + value)
        process.env[name] = value
    }
}

await loadEnvVar('BOT_TOKEN', 'Введите токен бота из BotFather:')
await loadEnvVar('STRAPI_PORT', 'Порт админ-панели (1000):', 1000)
await loadEnvVar('WEBHOOK_PORT', 'Порт вебхука (1001):', 1001)