// src/features/users/userThunks.js
import { HumanMessage } from "@langchain/core/messages"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenAI } from "@langchain/openai"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { JsonOutputFunctionsParser } from "langchain/output_parsers"
import { identifyPiiPrompt } from "~core/llms/prompts"
import type { ModelAuthenticteTypes, ModelIdentifyPiiTypes } from "~core/types"

const parser = new JsonOutputFunctionsParser()

const extractionFunctionSchema = {
	name: "piiExtractor",
	description: "Extracts PII and PCI from text data",
	parameters: {
		type: "object", // Ensuring the top-level schema is an object
		properties: {
			entries: {
				// Encapsulating the array within an object property
				type: "array",
				items: {
					type: "object",
					properties: {
						type: {
							type: "string",
							enum: ["PII", "PCI"],
							description:
								"Whether the identified data is PII or PCI."
						},
						typeOfInformation: {
							type: "string",
							description:
								"Classification category of the identified data."
						},
						confidence: {
							type: "string",
							enum: ["Low", "Medium", "High"],
							description:
								"How confident the model is in the identification."
						},
						value: {
							type: "string",
							description: "The identified value."
						}
					},
					required: [
						"type",
						"typeOfInformation",
						"confidence",
						"value"
					]
				}
			}
		},
		required: ["entries"]
	}
}

export const modelAuthenticate = createAsyncThunk(
	"models/modelAuthenticate", // action type prefix
	async ({ apiKey }: ModelAuthenticteTypes, { rejectWithValue }) => {
		try {
			let llm = new ChatOpenAI({ apiKey, model: "gpt-4" })

			await llm.invoke("Test connection")
			// const llm = new ChatGoogleGenerativeAI({
			// 	apiKey,
			// 	modelName: "gemini-pro"
			// })
			// await llm.invoke("Test connection")
			return { provider: "openai", apiKey }
		} catch (error) {
			console.log(error.message)
			return rejectWithValue(error.message) // This will be the payload of the rejected action
		}
	}
)

export const modelIdentifyPii = createAsyncThunk(
	"models/modelIdentifyPii", // action type prefix
	async (
		{ pageText, apiKey }: ModelIdentifyPiiTypes,
		{ rejectWithValue }
	) => {
		try {
			let formattedPrompt = await identifyPiiPrompt.format({
				pageText,
				rules: []
			})
			let model = new ChatOpenAI({ apiKey })
			const runnable = model
				.bind({
					functions: [extractionFunctionSchema],
					function_call: { name: "piiExtractor" }
				})
				.pipe(parser)
			let res = await runnable.invoke([new HumanMessage(formattedPrompt)])
			return res
		} catch (error) {
			console.log(error.message)
			return rejectWithValue(error.message) // This will be the payload of the rejected action
		}
	}
)
