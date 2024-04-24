import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const startSession: PlasmoMessaging.MessageHandler = (req, res) => {
	console.log(req)
	sendToContentScript({ name: "startSession" })
}

export default startSession
