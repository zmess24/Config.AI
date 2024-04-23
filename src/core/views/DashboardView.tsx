import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "~core/reducers"
import { endSession, startSession } from "~core/reducers/sessionSlice"
import Header from "~core/shared/Header"
import Layout from "~core/shared/Layout"
import Section from "~core/shared/Section"
import type { AppDispatch } from "~core/store"

export default function DashboardView() {
	const dispatch: AppDispatch = useDispatch()
	const provider = useSelector((state: RootState) => state.models.provider)
	const isOn = useSelector((state: RootState) => state.session.isOn)

	const handleSessionStart = (e) => {
		e.preventDefault()
		dispatch(startSession())
	}

	const handleSessionEnd = (e) => {
		e.preventDefault()
		dispatch(endSession())
	}

	return (
		<Layout>
			<Section>
				<Header text={"PII/PCI"} />
				<div className="flex justify-around">
					<div className="flex-col">
						<p className="font-medium">DOM</p>
					</div>
					<div className="flex-col">
						<p className="font-medium">API</p>
					</div>
				</div>
			</Section>
			<Section>
				{!isOn ? (
					<button
						onClick={handleSessionStart}
						className="w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-white bg-indigo-500 focus-visible:outline-indigo-600 hover:bg-indigo-400">
						Record
					</button>
				) : (
					<button
						onClick={handleSessionEnd}
						className="w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-white bg-red-500 focus-visible:outline-red-600 hover:bg-red-400">
						End
					</button>
				)}
			</Section>
		</Layout>
	)
}
