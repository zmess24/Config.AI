import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const providerDisconnected: PlasmoMessaging.MessageHandler = (req, res) => {
	console.log(req)
	sendToContentScript({ name: "providerDisconnected" })
}

export default providerDisconnected
