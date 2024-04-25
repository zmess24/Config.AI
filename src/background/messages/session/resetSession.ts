import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const resetSession: PlasmoMessaging.MessageHandler = (req, res) => {
	sendToContentScript({ name: "resetSession" })
}

export default resetSession
