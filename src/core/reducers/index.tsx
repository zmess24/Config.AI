import { combineReducers } from "@reduxjs/toolkit"
import { persistReducer } from "@plasmohq/redux-persist"
import { persistConfig } from "~core/store/persistConfig"
import modelReducer from "./modelSlice"
import sessionReducer from "./sessionSlice"
import settingsReducer from "./settingsSlice"

const rootReducer = combineReducers({
	models: modelReducer,
	session: sessionReducer,
	settings: settingsReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default persistReducer(persistConfig, rootReducer)
