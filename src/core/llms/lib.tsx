import { ChatAnthropic } from "@langchain/anthropic"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenAI } from "@langchain/openai"
import anthropicLogo from "data-base64:~core/assets/images/anthropic.jpeg"
import googleLogo from "data-base64:~core/assets/images/google.png"
import openaiLogo from "data-base64:~core/assets/images/openai.png"
import { JsonOutputFunctionsParser } from "langchain/output_parsers"
import { generateSelectorsSchema, identifyPiiSchema } from "~core/llms/parsers"
import { generateSelectorsPrompt, identifyPiiPrompt } from "~core/llms/prompts"

const chainMap = {
	identifyPii: { prompt: identifyPiiPrompt, schema: identifyPiiSchema },
	generateSelectors: {
		prompt: generateSelectorsPrompt,
		schema: generateSelectorsSchema
	}
}

const modelMap = [
	{
		provider: "openai",
		name: "GPT-4",
		image: openaiLogo,
		initModel: function (apiKey) {
			let model = new ChatOpenAI({ apiKey, model: "gpt-4" })
			return model
		}
	},
	{
		provider: "anthropic",
		name: "Claude",
		image: anthropicLogo,
		initModel: function (apiKey) {
			let model = new ChatAnthropic({ apiKey })
			return model
		}
	},
	{
		provider: "google",
		name: "Gemini Pro",
		image: googleLogo,
		initModel: function (apiKey) {
			let model = new ChatGoogleGenerativeAI({
				apiKey,
				modelName: "gemini-pro"
			})
			return model
		}
	}
]

function getModel(provider: string, apiKey: string) {
	return modelMap
		.find((model) => model.provider === provider)
		.initModel(apiKey)
}

async function invokeChain(model, name, promptArguments) {
	try {
		const parser = new JsonOutputFunctionsParser()
		const { prompt, schema } = chainMap[name]
		// Load Prompt & Parser
		let modelPrompt = await prompt.format({ ...promptArguments })
		console.log(prompt, schema, modelPrompt)
		const runnable = model
			.bind({ functions: [schema], function_call: { name } })
			.pipe(parser)

		const result = await runnable.invoke(modelPrompt)
		return result
	} catch (err) {
		console.log(err.message)
		return err.message
	}
}

export { modelMap, getModel, invokeChain }
