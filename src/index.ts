import { saveIdName, socket, listUserId } from "./whatsapp.handler.js";
import "dotenv/config"
import expres, { response } from "express"
import { readJsonList } from "./protocols/save.protocol.js";

const app = expres();
const APP_PORT = process.env.APP_PORT || 3000

app.get("/", async (req, response) => {
    if (socket) {
        const listId: listUserId[] = await readJsonList(saveIdName);
        listId.forEach((user: listUserId, index) => {
            socket!.sendMessage(user.id,
                {
                    location: {
                        name: "Test Name",
                        address: "Test Address",
                        degreesLatitude: -7.125258496857058,
                        degreesLongitude: 112.71915196294006
                    }
                }
            );
        })
    }
    response.send("OK");
})

app.get("/numbers", async (request, response) => {
    try {
        const data = await readJsonList(saveIdName);
        response.json(data);
    } catch {
        response.status(500)
    }
})

app.listen(APP_PORT, (error: any) => {
    console.log(`App Listening On : ${APP_PORT}`);
})