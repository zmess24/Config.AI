import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const endSession: PlasmoMessaging.MessageHandler = (req, res) => {
	sendToContentScript({ name: "endSession" })
}

export default endSession
