import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const sessionMessageHandler: PlasmoMessaging.MessageHandler = (req, res) => {
	let name = req.name
	let type = req.body.type
	sendToContentScript({ name, body: { type } })
}

export default sessionMessageHandler
