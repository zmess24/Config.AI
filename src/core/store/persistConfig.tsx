import storage from "@plasmohq/redux-persist/lib/storage" // defaults to localStorage for web

export const persistConfig = {
	key: "root",
	storage,
	whitelist: ["models", "session", "settings"]
}
