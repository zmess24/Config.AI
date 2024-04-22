import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { modelAuthenticate } from "~core/actions"
import modelMap from "~core/llms/lib"
import type { RootState } from "~core/reducers"
import { disconnectProvider } from "~core/reducers/modelSlice"
import { endSession } from "~core/reducers/sessionSlice"
import type { AppDispatch } from "~core/store"
import ProviderDropdown from "./ProviderDropdown"
import ProviderFooter from "./ProviderFooter"

function ProviderForm() {
	const [isOpen, setIsOpen] = useState(false)
	const [model, setModel] = useState(modelMap[0])
	const [apiKey, setApiKey] = useState("")
	const models = useSelector((state: RootState) => state.models)
	const provider = useSelector((state: RootState) => state.models.provider)
	const dispatch: AppDispatch = useDispatch()
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setApiKey("")
		dispatch(modelAuthenticate({ apiKey }))
	}

	const handleDisconnect = (e) => {
		e.preventDefault()
		setApiKey("")
		dispatch(disconnectProvider())
		dispatch(endSession())
	}

	useEffect(() => {}, [provider])

	return (
		<form className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md">
			<div className="flex flex-row justify-between items-center -my-3">
				<div>
					<div className="font-medium">LLM Provider</div>
				</div>
				<div className="flex flex-row w-1/6 justify-end"></div>
			</div>
			<hr className="-mx-6 my-6 border-gray-300 dark:border-gray-600 shadow-md"></hr>
			<div className="flex flex-col items-center">
				<img
					width="125"
					height="125"
					alt="webext llama"
					className="flex-grow mb-3 rounded-xl"
					src={model.image}
				/>
			</div>
			<ProviderDropdown
				modelOptions={modelMap}
				selectedModel={model}
				modelState={models}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				setModel={setModel}
			/>

			<hr className="-mx-6 my-6 border-gray-300 dark:border-gray-600 shadow-md"></hr>
			<ProviderFooter
				provider={models.provider}
				loading={models.loading}
				handleSubmit={handleSubmit}
				apiKey={apiKey}
				setApiKey={setApiKey}
				handleDisconnect={handleDisconnect}
			/>
		</form>
	)
}

export default ProviderForm
