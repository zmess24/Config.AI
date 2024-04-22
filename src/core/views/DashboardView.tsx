import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Layout from "~core/components/Layout"
import type { RootState } from "~core/reducers"
import { endSession, startSession } from "~core/reducers/sessionSlice"
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

	const disabledButtonStyles =
		"dark:bg-gray-600 bg-gray-300 text-gray-500 dark:text-white border-gray-300 dark:border-gray-500 focus:ring-gray-500"
	const enabledRecordButton =
		"text-white bg-green-500 focus-visible:outline-green-600 hover:bg-green-400"
	const enabledEndButton =
		"text-white bg-red-500 focus-visible:outline-red-600 hover:bg-red-400"
	return (
		<Layout>
			<div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4">
				<div className="font-large">PII/PCI</div>
				<div className="flex justify-around">
					<div className="flex-col">
						<p className="font-medium">DOM</p>
					</div>
					<div className="flex-col">
						<p className="font-medium">API</p>
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-around bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4">
				<button
					onClick={handleSessionStart}
					disabled={isOn}
					className={`w-5/12 rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${!isOn ? enabledRecordButton : disabledButtonStyles}`}>
					Record
				</button>
				<button
					onClick={handleSessionEnd}
					disabled={!isOn}
					className={`w-5/12 rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isOn ? enabledEndButton : disabledButtonStyles}`}>
					End
				</button>
			</div>
		</Layout>
	)
}
