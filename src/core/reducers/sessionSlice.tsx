import { createSlice } from "@reduxjs/toolkit"
import type { SessionStateTypes } from "~core/types"

const initialState: SessionStateTypes = {
	recordedPages: {},
	isOn: false,
	domListenerOn: false
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
		},
		resetSession: (state) => {
			state.recordedPages = {}
		},
		startDomListener: (state) => {
			state.domListenerOn = true
		},
		endDomListener: (state) => {
			state.domListenerOn = false
		}
	}
})

export const { startSession, endSession, syncSession, resetSession, startDomListener, endDomListener } = sessionSlice.actions

export default sessionSlice.reducer
