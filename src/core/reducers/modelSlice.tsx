import { disconnect } from "process"
import { createSlice } from "@reduxjs/toolkit"
import { modelAuthenticate, modelIdentifyPii } from "~core/actions"
import type { ModelStateTypes } from "~core/types"

const initialState: ModelStateTypes = {
	provider: null, // default provider, persist this
	apiKey: null, // persist this securely if possible
	isRunning: false, // indicates if the LLM should be active
	loading: false,
	error: null,
	response: null
}

const modelSlice = createSlice({
	name: "models",
	initialState,
	reducers: {
		disconnectProvider: (state) => {
			state.provider = null
			state.apiKey = null
			state.isRunning = false
			state.loading = false
			state.error = null
			state.response = null
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(modelAuthenticate.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(modelAuthenticate.fulfilled, (state, action) => {
				state.loading = false
				state.provider = action.payload.provider
				state.apiKey = action.payload.apiKey
			})
			.addCase(modelAuthenticate.rejected, (state, action) => {
				state.loading = false
				state.error = "Error authenticating model"
			})
			.addCase(modelIdentifyPii.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(modelIdentifyPii.fulfilled, (state, action) => {
				state.loading = false
				state.response = action.payload
				state.isRunning = true
			})
			.addCase(modelIdentifyPii.rejected, (state, action) => {
				state.loading = false
				state.error = "Error"
			})
	}
})

export const { disconnectProvider } = modelSlice.actions

export default modelSlice.reducer
