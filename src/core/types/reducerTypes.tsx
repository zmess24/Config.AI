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

export interface SessionStateTypes {
	domItems: Array<DomItemTypes>
	apiItems: Array<ApiItemTypes>
	isOn: boolean
}

interface RuleTypes {
	id: number
	ruleName: string
	ruleExampleValue: string
}

export interface SettingsStateTypes {
	rules: Array<RuleTypes>
}
