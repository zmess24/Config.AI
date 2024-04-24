import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

const providerConnected: PlasmoMessaging.MessageHandler = (req, res) => {
	console.log(req)
	sendToContentScript({ name: "providerConnected", body: req.body })
}

export default providerConnected
