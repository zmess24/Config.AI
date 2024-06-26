import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getModel, invokeChain } from "~core/llms/lib"

const generateSelectors: PlasmoMessaging.MessageHandler = async (req, res) => {
	let { domItems } = req.body
	let { reduxState } = await chrome.storage.local.get("reduxState")
	const { apiKey, provider } = reduxState.models
	// Find and Instantiate the model
	let model = getModel(provider, apiKey)
	domItems = JSON.stringify(domItems)
	// Invoke the model
	let result = await invokeChain(model, "refineSelectors", {
		domItems
	})
	res.send({ result })
}

export default generateSelectors
