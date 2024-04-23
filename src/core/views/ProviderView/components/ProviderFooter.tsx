import FooterApiKey from "./FooterApiKey"
import FooterAuthenticated from "./FooterAuthenticated"
import FooterLoading from "./FooterLoading"

function ProviderFooter({
	provider,
	loading,
	handleSubmit,
	apiKey,
	setApiKey,
	handleDisconnect
}) {
	if (loading) {
		return <FooterLoading show={loading} />
	} else if (provider) {
		return <FooterAuthenticated handleDisconnect={handleDisconnect} />
	} else {
		return (
			<FooterApiKey
				apiKey={apiKey}
				setApiKey={setApiKey}
				loading={loading}
				handleSubmit={handleSubmit}
			/>
		)
	}
}

export default ProviderFooter
