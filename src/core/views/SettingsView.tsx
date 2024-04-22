import { BeakerIcon, TrashIcon } from "@heroicons/react/24/outline"
import Layout from "~core/components/Layout"

export default function SettingsView() {
	const rules = [
		{
			name: "First Name",
			exampleValue: "Zac"
		},
		{
			name: "Email Address",
			exampleValue: "example@test.com"
		},
		{
			name: "MTCN",
			exampleValue: "HJ123F42"
		}
	]
	return (
		<Layout>
			<div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4">
				<div className="flex flex-row justify-between items-center -my-3">
					<div>
						<div className="font-medium">Add Rule</div>
					</div>
				</div>
				<hr className="-mx-6 mt-6 mb-3 border-gray-300 dark:border-gray-600 shadow-md"></hr>
				<div className="flex flex-col">
					<input
						type="text"
						placeholder="Information Type"
						className="w-full px-4 py-2 border dark:bg-slate-200 rounded-md shadow-sm text-slate-900 focus:border-indigo-300 focus:ring focus:ring-indigo-200 required:border-red-500 focus:ring-opacity-50" //
					/>
					<input
						type="text"
						placeholder="Example Value"
						className="mt-2 w-full px-4 py-2 border dark:bg-slate-200 rounded-md shadow-sm text-slate-900 focus:border-indigo-300 focus:ring focus:ring-indigo-200 required:border-red-500 focus:ring-opacity-50" //
					/>
					<button className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						Add Rule
					</button>
				</div>
			</div>
			<div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-md shadow-md my-4 overflow-auto max-h-60	">
				<div className="flex flex-row justify-between items-center -my-3">
					<div>
						<div className="font-medium">Applied Rules</div>
					</div>
				</div>
				<hr className="-mx-6 mt-6 mb-3 border-gray-300 dark:border-gray-600 shadow-md"></hr>
				<ul
					role="list"
					className="divide-y divide-gray-200 overflow-y-auto">
					{rules.map((rule) => (
						<li
							key={rule.name}
							className="flex justify-between gap-x-6 py-2">
							<div className="min-w-0 flex-auto">
								<p className="text-xs leading-6 text-gray-900 truncate">
									<span className="font-semibold">
										{rule.name}
									</span>{" "}
									| {rule.exampleValue}
								</p>
							</div>
							<TrashIcon className="h-5 w-5 flex-none text-gray-500 nav-link justify-self-end" />
						</li>
					))}
				</ul>
			</div>
		</Layout>
	)
}
