import { configureStore } from "@reduxjs/toolkit"
import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { sendToBackground } from "@plasmohq/messaging"
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE, RESYNC } from "@plasmohq/redux-persist"
import { Storage } from "@plasmohq/storage"
import reducer from "~core/reducers"
import { persistConfig } from "./persistConfig"

/**
|--------------------------------------------------
| Store Typings
|--------------------------------------------------
*/

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

/**
|--------------------------------------------------
| Middlewares
|--------------------------------------------------
*/

const chromeStorageMiddleware = (store) => (next) => (action) => {
	const result = next(action)
	const state = store.getState()
	chrome.storage.local.set({ reduxState: state })
	return result
}

const stateSyncMiddleware = (store) => (next) => (action) => {
	const result = next(action)
	switch (result.type) {
		case "models/modelAuthenticate/fulfilled":
			sendToBackground({
				name: "provider/connected",
				body: result.payload.provider
			})
			break
		case "models/disconnectProvider":
			sendToBackground({
				name: "provider/disconnected"
			})
			break
		case "session/startSession":
			sendToBackground({
				name: result.type
			})
			break
		case "session/endSession":
			sendToBackground({
				name: result.type
			})
			break
		case "session/resetSession":
			sendToBackground({
				name: result.type
			})
			break
		case "session/startDomListener":
			sendToBackground({ name: "session/messageHandler", body: { type: result.type } })
			break
		case "session/endDomListener":
			sendToBackground({ name: "session/messageHandler", body: { type: result.type } })
			break
		default:
			break
	}

	return result
}

/**
 |--------------------------------------------------
| Configure Store
|--------------------------------------------------
*/

export const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, RESYNC]
			}
		})
			.concat(chromeStorageMiddleware)
			.concat(stateSyncMiddleware)
})

export const persistor = persistStore(store)

// This is what makes Redux sync properly with multiple pages
// Open your extension's options page and popup to see it in action
new Storage().watch({
	[`persist:${persistConfig.key}`]: () => {
		persistor.resync()
	}
})
