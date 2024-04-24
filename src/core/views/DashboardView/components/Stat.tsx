function Stat({ value, Icon, title }) {
	return (
		<div
			key={title}
			className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow w-11/12">
			<dt>
				<div className="absolute rounded-md bg-indigo-500 p-2">
					<Icon className="h-6 w-6 text-white" aria-hidden="true" />
				</div>
				<p className="ml-12 truncate text-xs text-gray-500">{title}</p>
			</dt>
			<dd className="ml-12 flex items-baseline">
				<p className="text-lg font-semibold text-gray-900">{value}</p>
			</dd>
		</div>
	)
}

export default Stat
