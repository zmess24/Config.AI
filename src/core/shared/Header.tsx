function Header({ text, OptionalIcon = undefined, iconClickHandler = undefined }) {
	return (
		<>
			<div className="flex flex-row justify-between items-center -my-3">
				<div>
					<div className="font-medium text-xs">{text}</div>
				</div>
				{OptionalIcon && <OptionalIcon className="h-4 w-4 text-gray-400 nav-link cursor-pointer" onClick={iconClickHandler} />}
			</div>
			<hr className="-mx-6 mt-6 mb-3 border-gray-300 dark:border-gray-600 shadow-md"></hr>
		</>
	)
}

export default Header
