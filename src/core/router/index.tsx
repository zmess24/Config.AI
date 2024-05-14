import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { sendToContentScript } from "@plasmohq/messaging"
import { syncSession } from "~core/reducers/sessionSlice"
import AboutView from "~core/views/AboutView"
import DashboardView from "~core/views/DashboardView"
import ProviderView from "~core/views/ProviderView"
import SettingsView from "~core/views/SetttingsView"

export default function Router() {
	const dispatch = useDispatch()

	useEffect(() => {
		async function syncSessionState() {
			let payload = await sendToContentScript({ name: "popupOpened", body: { type: "popupOpened" } })
			if (payload) dispatch(syncSession(payload))
		}

		syncSessionState()
	}, [dispatch])

	return (
		<MemoryRouter>
			<Routes>
				<Route path="/" element={<DashboardView />} />
				<Route path="/provider" element={<ProviderView />} />
				<Route path="/settings" element={<SettingsView />} />
				<Route path="/about" element={<AboutView />} />
			</Routes>
		</MemoryRouter>
	)
}
