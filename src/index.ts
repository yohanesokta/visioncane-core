import { socket, whatsappId } from "./whatsapp.handler.ts";
// !INFO : Handler untuk http rest
// !TODO : Http request dapat trigger ke whatsapp handler
import "dotenv/config"
import expres, { response } from "express"
const app = expres();
const APP_PORT = process.env.APP_PORT || 3000

app.get("/", (req, response) => {
    if (socket && whatsappId) {
        socket.sendMessage(whatsappId, { text: "Hallo Mungkin Iki Trigger Dari Button Awokawokawok" });
    }
    response.send("OK");
})

app.listen(APP_PORT, (error: any) => {
    console.log(`App Listening On : ${APP_PORT}`);
})