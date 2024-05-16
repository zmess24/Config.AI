export interface ModelStateTypes {
	provider: string | null
	apiKey: string | null
	isRunning: boolean
	loading: boolean
	error: string | null
	response: object | null
}

interface DomItemTypes {
	type: number
	typeOfInformation: string
	confidence: string
	value: string
}

interface ApiItemTypes {
	type: number
	typeOfInformation: string
	confidence: string
	value: string
}

interface RecordedPagesType {
	[url: string]: {
		domItems: Array<DomItemTypes>
		apiItems: Array<ApiItemTypes>
	}
}

export interface SessionStateTypes {
	recordedPages: RecordedPagesType
	isOn: boolean
	domListenerOn: boolean,
	host: string
}

interface RuleTypes {
	id: number
	ruleName: string
	ruleExampleValue: string
}

export interface SettingsStateTypes {
	rules: Array<RuleTypes>
}
