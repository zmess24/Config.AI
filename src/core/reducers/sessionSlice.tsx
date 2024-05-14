import { createSlice } from "@reduxjs/toolkit"
import type { SessionStateTypes } from "~core/types"

const initialState: SessionStateTypes = {
	recordedPages: {},
	isOn: false,
	domListenerOn: false,
	host: undefined
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
		syncSession: (state, { payload }) => {
			state.recordedPages = payload.recordedPages
			state.host = payload.host
		},
		resetSession: (state) => {
			state.recordedPages = {}
		},
		startDomListener: (state) => {
			state.domListenerOn = true
		},
		endDomListener: (state) => {
			state.domListenerOn = false
		},
		setHost: (state, action) => {
			state.host = action.payload
		}
	}
})

export const { startSession, endSession, syncSession, resetSession, startDomListener, endDomListener, setHost } = sessionSlice.actions

export default sessionSlice.reducer
