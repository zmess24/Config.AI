import { createSlice } from "@reduxjs/toolkit"
import type { SessionStateTypes } from "~core/types"

const initialState: SessionStateTypes = {
	recordedPages: {},
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
		},
		syncSession: (state, action) => {
			state.recordedPages = action.payload
		}
	}
})

export const { startSession, endSession, syncSession } = sessionSlice.actions

export default sessionSlice.reducer
