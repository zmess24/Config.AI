export default function FooterApiKey({
	apiKey,
	setApiKey,
	loading,
	handleSubmit
}) {
	return (
		<>
			<input
				type="text"
				placeholder="API Key"
				disabled={loading}
				className="mt-2 w-full px-4 py-2 border dark:bg-slate-200 rounded-md shadow-sm text-slate-900 focus:border-indigo-300 focus:ring focus:ring-indigo-200 required:border-red-500 focus:ring-opacity-50"
				onChange={(e) => setApiKey(e.target.value)}
				value={apiKey}
			/>
			<div className="text-xs font-medium text-center my-3">
				<strong>Note:</strong> Provided API key will be stored securely
				in your browser.
			</div>
			<button
				type="submit"
				disabled={loading}
				className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				onClick={handleSubmit}>
				Connect
			</button>
		</>
	)
}
