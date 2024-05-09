import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const sessionMessageHandler: PlasmoMessaging.MessageHandler = (req, res) => {
	sendToContentScript({ name: req.name, body: req.body })
}

export default sessionMessageHandler
