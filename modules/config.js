import strapi from "./strapi.js";

const locales = ["ru", "en"]

const fetchConfig = async () => {
    let config = {}
    for (let locale of locales) {
        config[locale] = await strapi.get("config", { populate: "*", locale })
    }

    return config
}

let config = await fetchConfig()

export const revalidateConfig = async () => {
    try {
        config = await fetchConfig()
    } catch (e) {
        console.error(e)
    }
}

export const getConfig = (locale) => config[locale]

setInterval(async () => {
    revalidateConfig()
}, 60 * 1000)

export default config