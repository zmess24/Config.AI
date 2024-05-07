import { CloudIcon, CodeBracketSquareIcon, NoSymbolIcon } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "~core/reducers"
import { endDomListener, endSession, resetSession, startDomListener, startSession } from "~core/reducers/sessionSlice"
import Header from "~core/shared/Header"
import Layout from "~core/shared/Layout"
import Section from "~core/shared/Section"
import type { AppDispatch } from "~core/store"
import Stat from "./components/Stat"

export default function DashboardView() {
	const dispatch: AppDispatch = useDispatch()
	const { recordedPages } = useSelector((state: RootState) => state.session)
	const { domListenerOn, isOn } = useSelector((state: RootState) => state.session)
	const provider = useSelector((state: RootState) => state.models.provider)

	const handleSessionStart = (e) => {
		e.preventDefault()
		dispatch(startSession())
	}

	const handleSessionEnd = (e) => {
		e.preventDefault()
		dispatch(endSession())
	}

	const handleResetSession = (e) => {
		dispatch(resetSession())
	}

	const handleDomListenerStart = (e) => {
		e.preventDefault()
		dispatch(startDomListener())
	}

	const handleDomListenerEnd = (e) => {
		e.preventDefault()
		dispatch(endDomListener())
	}

	let domItemCount = 0
	let apiItemCount = 0
	let pageCount = 0

	for (let url in recordedPages) {
		domItemCount += recordedPages[url].domItems.length
		apiItemCount += recordedPages[url].apiItems.length
		pageCount++
	}

	return (
		<Layout>
			<Section>
				<Header text={"Identified PII & PCI"} OptionalIcon={NoSymbolIcon} iconClickHandler={handleResetSession} />
				<p className="text-center">
					Unique Pages Visited: <strong>{pageCount}</strong>
				</p>
				<dl className="mt-5 grid grid-cols-2 justify-items-center">
					<Stat Icon={CodeBracketSquareIcon} title={"DOM"} value={domItemCount} />
					<Stat Icon={CloudIcon} title={"API"} value={apiItemCount} />
				</dl>
			</Section>

			<Section>
				<Header text={"DOM Elements"} />
				{provider && isOn ? (
					<div className="grid grid-cols-2 gap-4">
						<button
							onClick={handleDomListenerStart}
							disabled={domListenerOn}
							className={`w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${domListenerOn ? "text-gray-500 bg-gray-300" : "text-white bg-indigo-500 focus-visible:outline-indigo-600 hover:bg-indigo-400"}`}>
							Add Listener
						</button>
						<button
							onClick={handleDomListenerEnd}
							disabled={!domListenerOn}
							className={`w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${!domListenerOn ? "text-gray-500 bg-gray-300" : "text-white bg-red-500 focus-visible:outline-red-600 hover:bg-red-400"}`}>
							End Listener
						</button>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-4">
						<button disabled={true} className="w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm text-gray-500 bg-gray-300">
							Add Listener
						</button>
						<button disabled={true} className="w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm text-gray-500 bg-gray-300">
							End Listener
						</button>
					</div>
				)}
			</Section>

			<Section>
				<Header text={"Session Options"} />
				{provider ? (
					!isOn ? (
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
					)
				) : (
					<button disabled={true} className="w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm text-gray-500 bg-gray-300">
						Enable Provider
					</button>
				)}
			</Section>
		</Layout>
	)
}
