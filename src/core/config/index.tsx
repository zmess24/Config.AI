import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"
import modelMap from "~core/llms/lib"

class ConfigAiStorage {
	apiKeyStorage: Storage
	activeModel: Storage
	cachedModels: Array<any>

	constructor() {
		this.apiKeyStorage = new Storage()
		this.activeModel = new Storage()
		this.cachedModels = []
	}

	async loadModels() {
		let activeModel = await this.getActiveModel()

		modelMap.forEach(async (model) => {
			let apiKey = await this.getProviderApiKey(model.provider)
			if (apiKey) {
				let active = activeModel === model.provider ? true : false
				this.cachedModels.push({ ...model, apiKey, active })
			}
		})

		return this.cachedModels.length > 0 ? this.cachedModels : undefined
	}

	async setProviderApiKey({ provider, model, apiKey }) {
		await this.apiKeyStorage.set(provider, apiKey)
		await this.setActiveModel(provider)
		this.cachedModels.push(model)
		console.log("SET PROVIDER", provider)
		return { cachedModels: this.cachedModels, activeModel: provider }
	}

	async getProviderApiKey(provider) {
		return await this.apiKeyStorage.get(provider)
	}

	async getActiveModel() {
		return await this.activeModel.get("activeModel")
	}
	async setActiveModel(provider) {
		return await this.activeModel.set("activeModel", provider)
	}
}

const config = new ConfigAiStorage()

export default config
