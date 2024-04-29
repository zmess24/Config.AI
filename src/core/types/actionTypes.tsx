export interface ActionType {
	type: string
	payload: any
}

export interface ModelAuthenticteTypes {
	apiKey: string
	provider: string
}

export interface ModelIdentifyPiiTypes {
	pageText: string
	apiKey: string
}
