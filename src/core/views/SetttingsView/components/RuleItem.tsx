import { TrashIcon } from "@heroicons/react/24/outline"
import { useDispatch } from "react-redux"
import { deleteRule } from "~core/reducers/settingsSlice"
import type { AppDispatch } from "~core/store"

function RuleItem({ rule }) {
	const dispatch: AppDispatch = useDispatch()
	return (
		<li key={rule.id} className="flex justify-between gap-x-6 py-2">
			<div className="min-w-0 flex-auto">
				<p className="text-xs leading-6 text-gray-900 truncate">
					<span className="font-semibold">{rule.ruleName}</span> |{" "}
					{rule.ruleExampleValue}
				</p>
			</div>
			<TrashIcon
				className="h-4 w-4 flex-none text-gray-500 nav-link justify-self-end nav-link cursor-pointer"
				onClick={() => dispatch(deleteRule(rule.id))}
			/>
		</li>
	)
}

export default RuleItem
