import { useSelector } from "react-redux"
import type { RootState } from "~core/reducers"
import Header from "~core/shared/Header"
import Layout from "~core/shared/Layout"
import RuleForm from "./components/RuleForm"
import RuleItem from "./components/RuleItem"

export default function SettingsView() {
	const rules = useSelector((state: RootState) => state.settings.rules)

	return (
		<Layout>
			<div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4">
				<Header text={"Add Rule"} />
				<RuleForm />
			</div>
			<div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4 overflow-auto max-h-60	">
				<Header text={"Applied Rules"} />
				<ul
					role="list"
					className="divide-y divide-gray-200 overflow-y-auto">
					{rules.map((rule) => (
						<RuleItem rule={rule} />
					))}
				</ul>
			</div>
		</Layout>
	)
}
