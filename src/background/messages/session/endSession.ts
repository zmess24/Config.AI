import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const endSession: PlasmoMessaging.MessageHandler = (req, res) => {
	console.log(req)
	sendToContentScript({ name: "endSession" })
}

export default endSession
