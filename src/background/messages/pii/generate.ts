import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getModel, invokeChain } from "~core/llms/lib"

const generateSelectors: PlasmoMessaging.MessageHandler = async (req, res) => {
	let { domTree, domItems } = req.body
	let { reduxState } = await chrome.storage.local.get("reduxState")
	const { apiKey, provider } = reduxState.models
	// Find and Instantiate the model
	let model = getModel(provider, apiKey)

	// Invoke the model
	let result = await invokeChain(model, "generateSelectors", {
		domTree,
		domItems: JSON.stringify(domItems)
	})
	res.send({ result })
}

export default generateSelectors
