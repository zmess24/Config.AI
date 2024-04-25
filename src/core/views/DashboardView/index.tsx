import {
	ArrowDownCircleIcon,
	CloudIcon,
	CodeBracketSquareIcon,
	TrashIcon
} from "@heroicons/react/24/solid"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "~core/reducers"
import { endSession, startSession } from "~core/reducers/sessionSlice"
import Header from "~core/shared/Header"
import Layout from "~core/shared/Layout"
import Section from "~core/shared/Section"
import type { AppDispatch } from "~core/store"
import Stat from "./components/Stat"

export default function DashboardView() {
	const dispatch: AppDispatch = useDispatch()
	const { domItems, apiItems } = useSelector(
		(state: RootState) => state.session
	)
	console.log(domItems)
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
				<Header text={"Identified PII & PCI"} />
				{/* <Stat Icon={CloudIcon} title={"Recorded Pages"} value={5} /> */}
				<dl className="mt-5 grid grid-cols-2 justify-items-center">
					<Stat
						Icon={CodeBracketSquareIcon}
						title={"DOM"}
						value={domItems.length}
					/>
					<Stat
						Icon={CloudIcon}
						title={"API"}
						value={apiItems.length}
					/>
				</dl>
			</Section>

			<Section>
				<Header text={"Session Options"} />
				{/* <div className="flex flex-row justify-between mb-3">
					<button
						type="button"
						className="w-full mx-1 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						<ArrowDownCircleIcon
							className="-ml-0.5 h-5 w-5"
							aria-hidden="true"
						/>
						Download
					</button>
					<button
						type="button"
						className="w-full mx-1 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						<TrashIcon
							className="-ml-0.5 h-5 w-5"
							aria-hidden="true"
						/>
						Clear
					</button>
				</div> */}
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
