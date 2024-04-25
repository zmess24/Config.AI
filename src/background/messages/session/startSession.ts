import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const startSession: PlasmoMessaging.MessageHandler = (req, res) => {
	sendToContentScript({ name: "startSession" })
}

export default startSession
