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
		model: ChatOpenAI
	},
	{
		provider: "anthropic",
		name: "Claude",
		image: anthropicLogo,
		modul: ChatAnthropic
	},
	{
		provider: "google",
		name: "Gemini Pro",
		image: googleLogo,
		model: ChatGoogleGenerativeAI
	}
]

export default modelMap
