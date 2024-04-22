import { createSlice } from "@reduxjs/toolkit"
import type { SettingsStateTypes } from "~core/types"

const initialState: SettingsStateTypes = {
	rules: []
}

const settingsSlice = createSlice({
	name: "session",
	initialState,
	reducers: {}
})

export default settingsSlice.reducer
