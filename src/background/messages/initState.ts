import type { PlasmoMessaging } from "@plasmohq/messaging"

const initState: PlasmoMessaging.MessageHandler = (req, res) => {
	chrome.storage.local.get("reduxState", (data) => {
		if (data.reduxState) {
			const { provider } = data.reduxState.models
			const { isOn, host } = data.reduxState.session
			res.send({ provider, isOn, host })
		}
	})
}

export default initState
