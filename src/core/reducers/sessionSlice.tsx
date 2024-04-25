import { createSlice } from "@reduxjs/toolkit"
import type { SessionStateTypes } from "~core/types"

const initialState: SessionStateTypes = {
	domItems: [],
	apiItems: [],
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
