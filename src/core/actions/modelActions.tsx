import { createAsyncThunk } from "@reduxjs/toolkit"
import modelMap from "~core/llms/lib"
import type { ModelAuthenticteTypes, ModelIdentifyPiiTypes } from "~core/types"

export const modelAuthenticate = createAsyncThunk(
	"models/modelAuthenticate", // action type prefix
	async (
		{ apiKey, provider }: ModelAuthenticteTypes,
		{ rejectWithValue }
	) => {
		try {
			let model = modelMap
				.find((model) => model.provider === provider)
				.initModel(apiKey)
			await model.invoke("Test connection")
			return { provider, apiKey }
		} catch (error) {
			return rejectWithValue(error.message)
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
			console.log("TEST")
		} catch (error) {
			console.log(error.message)
			return rejectWithValue(error.message) // This will be the payload of the rejected action
		}
	}
)
