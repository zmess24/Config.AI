import { Provider } from "react-redux"
import { PersistGate } from "@plasmohq/redux-persist/integration/react"
import Router from "~core/router"
import { persistor, store } from "~core/store"
import "./style.css"

function IndexPopup() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Router />
			</PersistGate>
		</Provider>
	)
}

export default IndexPopup
