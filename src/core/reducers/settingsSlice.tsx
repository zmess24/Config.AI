import { createSlice } from "@reduxjs/toolkit"
import type { SettingsStateTypes } from "~core/types"

const initialState: SettingsStateTypes = {
	rules: []
}

const settingsSlice = createSlice({
	name: "session",
	initialState,
	reducers: {
		addRule: (state, action) => {
			console.log(action.payload)
			state.rules.push(action.payload)
		},
		deleteRule: (state, action) => {
			let ruleIndex = state.rules.findIndex(
				(rule) => rule.id === action.payload
			)
			state.rules.splice(ruleIndex, 1)
		}
	}
})

export const { addRule, deleteRule } = settingsSlice.actions

export default settingsSlice.reducer
