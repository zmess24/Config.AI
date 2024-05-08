export const STATE_TYPES = {
	SESSION: {
		START: "session/startSession",
		END: "session/endSession",
		RESET: "session/resetSession",
		START_DOM_LISTENER: "session/startDomListener",
		END_DOM_LISTENER: "session/endDomListener"
	},
	MODEL: {
		CONNECTED: "providerConnected",
		DISCONNECTED: "providerDisconnected"
	}
}
