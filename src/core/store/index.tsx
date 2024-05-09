import { configureStore } from "@reduxjs/toolkit"
import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { sendToBackground } from "@plasmohq/messaging"
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE, RESYNC } from "@plasmohq/redux-persist"
import { Storage } from "@plasmohq/storage"
import reducer from "~core/reducers"
import { persistConfig } from "./persistConfig"
import { STATE_TYPES } from "./stateTypes"

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
		case STATE_TYPES.MODEL.CONNECTED:
			sendToBackground({
				name: "provider/connected",
				body: result.payload.provider
			})
			break
		case STATE_TYPES.MODEL.DISCONNECTED:
			sendToBackground({
				name: "provider/disconnected"
			})
			break
		case STATE_TYPES.SESSION.START:
			sendToBackground({ name: "session/messageHandler", body: { type: result.type } })
			break
		case STATE_TYPES.SESSION.END:
			sendToBackground({ name: "session/messageHandler", body: { type: result.type } })
			break
		case STATE_TYPES.SESSION.RESET:
			sendToBackground({ name: "session/messageHandler", body: { type: result.type } })
			break
		case STATE_TYPES.SESSION.START_DOM_LISTENER:
			sendToBackground({ name: "session/messageHandler", body: { type: result.type } })
			break
		case STATE_TYPES.SESSION.END_DOM_LISTENER:
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
