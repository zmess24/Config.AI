import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const connected: PlasmoMessaging.MessageHandler = (req, res) => {
	sendToContentScript({ name: "connected", body: req.body })
}

export default connected
