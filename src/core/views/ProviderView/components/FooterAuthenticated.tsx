import React from "react"

function FooterAuthenticated({ handleDisconnect }) {
	return (
		<div className="flex flex-col justify-items-center">
			<h3 className="text-lg font-semibold text-gray-800 text-center mb-5">
				Connected
			</h3>

			<button
				type="submit"
				onClick={handleDisconnect}
				className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
				Disconnect
			</button>
		</div>
	)
}

export default FooterAuthenticated
