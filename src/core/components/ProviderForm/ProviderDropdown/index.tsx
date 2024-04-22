function ProviderDropdown({
	modelOptions,
	selectedModel,
	modelState,
	isOpen,
	setIsOpen,
	setModel
}) {
	const disabledStyles =
		"dark:bg-gray-600 bg-gray-300 text-gray-500 dark:text-white border-gray-300 dark:border-gray-500 focus:ring-gray-500"
	const enabledStyles =
		"dark:bg-slate-600 bg-indigo-100 text-indigo-700 dark:text-white hover:bg-indigo-200 hover:dark:bg-slate-800 border-indigo-300 dark:border-slate-500 focus:ring-indigo-500"
	return (
		<div>
			<button
				type="button"
				className={`inline-flex justify-center w-full rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border shadow-sm ${!modelState.provider ? enabledStyles : disabledStyles}`}
				id="options-menu"
				aria-haspopup="true"
				disabled={modelState.provider}
				aria-expanded="true"
				onClick={() => {
					setIsOpen(!isOpen)
				}}>
				{selectedModel.name}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					className="ml-2 h-5 w-5">
					<path
						fillRule="evenodd"
						d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z"
						clipRule="evenodd"></path>
				</svg>
			</button>
			{isOpen && (
				<div
					className="absolute z-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-[300px]"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="options-menu">
					<div className="py-1" role="none">
						{modelOptions.map((model) => {
							return (
								<button
									className="block text-left w-full px-4 py-2 pr-8 text-slate-700 hover:bg-indigo-100 hover:text-indigo-900 focus:outline-none focus:bg-indigo-100 focus:text-indigo-900"
									role="menuitem"
									key={model.name}
									onClick={() => {
										setIsOpen(modelState.loading)
										setModel(model)
									}}>
									{model.name}
								</button>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

export default ProviderDropdown
