export interface ModelStateTypes {
	provider: string | null
	apiKey: string | null
	isRunning: boolean
	loading: boolean
	error: string | null
	response: object | null
}

export interface SessionStateTypes {
	domItems: null | object
	apiItems: null | object
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
