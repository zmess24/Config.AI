import { ChatAnthropic } from "@langchain/anthropic"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenAI } from "@langchain/openai"
import anthropicLogo from "data-base64:~core/assets/images/anthropic.jpeg"
import googleLogo from "data-base64:~core/assets/images/google.png"
import openaiLogo from "data-base64:~core/assets/images/openai.png"

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

export default modelMap
