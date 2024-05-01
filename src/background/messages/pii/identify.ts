import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getModel, invokeChain } from "~core/llms/lib"

const identifyPii: PlasmoMessaging.MessageHandler = async (req, res) => {
	let { pageText } = req.body
	let { reduxState } = await chrome.storage.local.get("reduxState")
	const { apiKey, provider } = reduxState.models
	// Find and Instantiate the model
	let model = getModel(provider, apiKey)

	// Invoke the model
	let result = await model.invokeChain(model, "identifyPii", {
		pageText,
		rules: []
	})
	console.log(result)
	res.send({ result })
}

export default identifyPii
