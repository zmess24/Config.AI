import { createSlice } from "@reduxjs/toolkit"
import type { SessionStateTypes } from "~core/types"

const initialState: SessionStateTypes = {
	domItems: null,
	apiItems: null,
	isOn: false
}

const sessionSlice = createSlice({
	name: "session",
	initialState,
	reducers: {
		startSession: (state) => {
			state.isOn = true
		},
		endSession: (state) => {
			state.isOn = false
		}
	}
})

export const { startSession, endSession } = sessionSlice.actions

export default sessionSlice.reducer
