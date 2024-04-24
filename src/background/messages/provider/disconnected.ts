import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const disconnected: PlasmoMessaging.MessageHandler = (req, res) => {
	console.log(req)
	sendToContentScript({ name: "disconnected" })
}

export default disconnected
