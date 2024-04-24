import type { PlasmoMessaging } from "@plasmohq/messaging"
import { store } from "~core/store"

const handler: PlasmoMessaging.MessageHandler = (req, res) => {
	chrome.storage.local.get("reduxState", (data) => {
		if (data.reduxState) {
			const reduxState = data.reduxState
			res.send({ reduxState })
		}
	})
}

export default handler
