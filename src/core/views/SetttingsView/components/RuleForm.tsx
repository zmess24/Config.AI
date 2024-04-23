import { useState } from "react"
import { useDispatch } from "react-redux"
import { addRule } from "~core/reducers/settingsSlice"
import type { AppDispatch } from "~core/store"

function RuleForm({}) {
	const [ruleName, setRuleName] = useState("")
	const [ruleExampleValue, setRuleExampleValue] = useState("")
	const dispatch: AppDispatch = useDispatch()

	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch(addRule({ ruleName, ruleExampleValue }))
		setRuleName("")
		setRuleExampleValue("")
	}
	return (
		<form className="flex flex-col" onSubmit={handleSubmit}>
			<input
				type="text"
				onChange={(e) => setRuleName(e.target.value)}
				value={ruleName}
				placeholder="Information Type"
				className="w-full px-4 py-2 border dark:bg-slate-200 rounded-md shadow-sm text-slate-900 focus:border-indigo-300 focus:ring focus:ring-indigo-200 required:border-red-500 focus:ring-opacity-50" //
			/>
			<input
				type="text"
				placeholder="Example Value"
				onChange={(e) => setRuleExampleValue(e.target.value)}
				value={ruleExampleValue}
				className="mt-2 w-full px-4 py-2 border dark:bg-slate-200 rounded-md shadow-sm text-slate-900 focus:border-indigo-300 focus:ring focus:ring-indigo-200 required:border-red-500 focus:ring-opacity-50" //
			/>
			<button className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
				Add Rule
			</button>
		</form>
	)
}

export default RuleForm
