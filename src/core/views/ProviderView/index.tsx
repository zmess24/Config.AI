import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { modelAuthenticate } from "~core/actions"
import modelMap from "~core/llms/lib"
import type { RootState } from "~core/reducers"
import { disconnectProvider } from "~core/reducers/modelSlice"
import { endSession } from "~core/reducers/sessionSlice"
import Header from "~core/shared/Header"
import Layout from "~core/shared/Layout"
import type { AppDispatch } from "~core/store"
import ProviderDropdown from "./components/ProviderDropdown"
import ProviderFooter from "./components/ProviderFooter"

function ProviderView() {
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
		<Layout>
			<form className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md">
				<Header text={"LLM Provider"} />
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
		</Layout>
	)
}

export default ProviderView
