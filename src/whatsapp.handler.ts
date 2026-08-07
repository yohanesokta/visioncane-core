import makeWASocket, { useMultiFileAuthState, WASocket } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"
import { saveJsonList } from "./protocols/save.protocol.js";

export interface listUserId {
    id: string,
    number: string
}

let whatsappIdList: listUserId[] = []
let socket: WASocket | null = null;
const saveIdName = "whatsapp-id.json"
async function connectToWhatsapp() {
    const { state, saveCreds } = await useMultiFileAuthState(".credential-whatsapp");
    socket = makeWASocket({
        auth: state
    });
    socket.ev.on("creds.update", saveCreds);
    socket.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update
        if (qr) {
            qrcode.generate(qr, {
                small: true
            });
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== 401
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            if (shouldReconnect) {
                connectToWhatsapp();
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    });
    socket.ev.on("messages.upsert", (events) => {
        const message_text = events.messages[0]?.message?.extendedTextMessage?.text || events.messages[0]?.message?.conversation;
        console.log(`message text: ${message_text}`);
        if (message_text == "/sendme") {
            const whatsappId = events.messages[0]?.key.remoteJid;
            const whatsappNumber = events.messages[0]?.key.remoteJidAlt || "Hidden Number@-"
            whatsappIdList.push({
                id: whatsappId || "",
                number: whatsappNumber.split("@")[0] || ""
            })
            saveJsonList(whatsappIdList, saveIdName);
            socket?.sendMessage(whatsappId!, { text: "Okkay Kamu Di Daftarkan Ke List Sender" });
        }
    })
}

connectToWhatsapp();
export { socket, saveIdName }