import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "~core/reducers"
import { addRule, deleteRule } from "~core/reducers/settingsSlice"
import Header from "~core/shared/Header"
import Layout from "~core/shared/Layout"
import type { AppDispatch } from "~core/store"
import RuleForm from "./components/RuleForm"
import RuleItem from "./components/RuleItem"

export default function SettingsView() {
	const [ruleName, setRuleName] = useState("")
	const [ruleExampleValue, setRuleExampleValue] = useState("")
	const dispatch: AppDispatch = useDispatch()
	const rules = useSelector((state: RootState) => state.settings.rules)

	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch(addRule({ ruleName, ruleExampleValue }))
		setRuleName("")
		setRuleExampleValue("")
	}

	return (
		<Layout>
			<div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4">
				<Header text={"Add Rule"} />
				<RuleForm
					handleSubmit={handleSubmit}
					ruleName={ruleName}
					setRuleName={setRuleName}
					ruleExampleValue={ruleExampleValue}
					setRuleExampleValue={setRuleExampleValue}
				/>
			</div>
			<div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4 overflow-auto max-h-60	">
				<Header text={"Applied Rules"} />
				<ul
					role="list"
					className="divide-y divide-gray-200 overflow-y-auto">
					{rules.map((rule) => (
						<RuleItem
							rule={rule}
							dispatch={dispatch}
							deleteRule={deleteRule}
						/>
					))}
				</ul>
			</div>
		</Layout>
	)
}
