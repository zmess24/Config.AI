import { JsonOutputFunctionsParser } from "langchain/output_parsers"
import type { PlasmoMessaging } from "@plasmohq/messaging"
import modelMap from "~core/llms/lib"
import { piiExtractorSchema } from "~core/llms/parsers"
import { identifyPiiPrompt } from "~core/llms/prompts"

const identifyPii: PlasmoMessaging.MessageHandler = async (req, res) => {
	try {
		let pageText = req.body.pageText
		let { reduxState } = await chrome.storage.local.get("reduxState")
		const { apiKey, provider } = reduxState.models
		// Find and Instantiate the model
		let model = modelMap
			.find((model) => model.provider === provider)
			.initModel(apiKey)

		// Load Prompt & Parser
		let prompt = await identifyPiiPrompt.format({
			pageText: pageText,
			rules: []
		})

		const parser = new JsonOutputFunctionsParser()

		const runnable = model
			.bind({
				functions: [piiExtractorSchema],
				function_call: { name: "piiExtractor" }
			})
			.pipe(parser)

		const result = await runnable.invoke(prompt)
		res.send({ result })
	} catch (err) {
		console.log(err)
		res.send({ err })
	}
}

export default identifyPii
