function Header({ text }) {
	return (
		<>
			<div className="flex flex-row justify-between items-center -my-3">
				<div>
					<div className="font-medium">{text}</div>
				</div>
			</div>
			<hr className="-mx-6 mt-6 mb-3 border-gray-300 dark:border-gray-600 shadow-md"></hr>
		</>
	)
}

export default Header
