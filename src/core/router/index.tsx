import { MemoryRouter, Route, Routes } from "react-router-dom"
import AboutView from "~core/views/AboutView"
import DashboardView from "~core/views/DashboardView"
import ProviderView from "~core/views/ProviderView"
import SettingsView from "~core/views/SetttingsView"

export default function Router() {
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
