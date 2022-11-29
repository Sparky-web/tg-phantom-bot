import express from "express"
import { revalidateConfig } from "./config.js"
const app = express()

app.all("/webhook", async (req, res) => {
    await revalidateConfig()
    res.send("ok")
})

app.listen(process.env.WEBHOOK_PORT)