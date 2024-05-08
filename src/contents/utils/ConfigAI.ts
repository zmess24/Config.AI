import { finder } from "@medv/finder"
import { sendToBackground } from "@plasmohq/messaging"
import { print } from "./print"

/**
|--------------------------------------------------
| Type Definitions
|--------------------------------------------------
*/

export interface ConfigAiInterface {
	provider: string
	isOn: boolean
	nonTextBasedSelectors: string
	inputTypes: string
	cache: object
}

interface DomItemTypes {
	type: string
	typeOfInformation: string
	confidence: string
	value: string
	selector: string
	refinedSelector?: string
}

interface CacheUpdatePayloadTypes {
	detectedData: Array<DomItemTypes>
	targetUrl: string
	dataType: string
}

interface NodeToAdd {
	selector: string
	type: string
	typeOfInformation: string
	confidence: string
	value: string
}

/**
|--------------------------------------------------
| Core Class
|--------------------------------------------------
*/

class ConfigAi implements ConfigAiInterface {
	provider: string
	isOn: boolean
	nonTextBasedSelectors: string
	inputTypes: string
	cache: object
	nodesToAdd: Array<NodeToAdd>

	constructor(provider: string, isOn: boolean) {
		this.provider = provider
		this.isOn = isOn
		this.cache = JSON.parse(window.localStorage.getItem("config.ai") || "{}")
		this.nonTextBasedSelectors = "script, style, img, noscript, iframe, video, audio, canvas, meta, svg, path"
		this.inputTypes = "input, textarea, select, label, option"
		this.nodesToAdd = []

		print.log(`Provider: ${this.provider} | Session: ${this.isOn}`, "#3f51b5")
	}

	/**
    |--------------------------------------------------
    | Setter Methods
    |--------------------------------------------------
    */

	setProvider(provider: string) {
		this.provider = provider
	}

	setIsOn(isOn: boolean) {
		this.isOn = isOn
	}

	setCache(updateType: "clear" | "update", payload?: CacheUpdatePayloadTypes) {
		if (updateType === "clear") this.cache = {}

		if (updateType === "update") {
			let { detectedData, targetUrl, dataType } = payload
			if (!this.cache[targetUrl]) this.cache[targetUrl] = { domItems: [], apiItems: [] }
			this.cache[targetUrl][dataType] = [...this.cache[targetUrl][dataType], ...detectedData]
			localStorage.setItem("config.ai", JSON.stringify(this.cache))
		}
	}

	/**
    |--------------------------------------------------
    | Private DOM Methods
    |--------------------------------------------------
    */

	#createTreeWalker(nodeFilter) {
		return document.createTreeWalker(document.body, nodeFilter, null)
	}

	#findNodesWithPII(piiList) {
		const textNodes = []
		const walker = this.#createTreeWalker(NodeFilter.SHOW_TEXT)
		let node

		while ((node = walker.nextNode())) {
			piiList.forEach((data) => {
				if (node.textContent.includes(data.value) && node.parentNode.nodeName !== "SCRIPT") {
					if (node.parentNode.nodeName !== "LABEL") {
						data.selector = finder(node.parentNode, {
							optimizedMinLength: 2
						})
					} else {
						data.delete = true
					}
				}
			})
		}

		return textNodes
	}

	#highlightNodesWithPII(domItems) {
		function createOverlay(targetElement, selector) {
			const overlay = document.createElement("div")
			overlay.className = "configai-overlay"
			overlay.textContent = selector

			// Create a close button and append it to the overlay
			const closeButton = document.createElement("div")
			closeButton.className = "configai-close-button"
			closeButton.textContent = "X" // Text for the close button
			closeButton.onclick = function () {
				removeOverlay(overlay)
			}

			// Append the close button and the overlay text or content
			overlay.appendChild(closeButton)

			// Append the overlay to the target element
			targetElement.style.position = "relative" // Ensure the target can hold absolute positioned children
			targetElement.appendChild(overlay)

			// Optionally store the overlay for later removal
			return overlay
		}

		function removeOverlay(overlay) {
			overlay.parentNode.removeChild(overlay)
		}

		domItems.forEach((data) => {
			const elements = document.querySelectorAll(data.selector)
			elements.forEach((element) => {
				if (data.typeOfInformation !== "Input") {
					if (data.selector) createOverlay(element, data.selector)
				} else {
					element.style.transition = "all 0.5s ease-in"
					element.style.backgroundColor = "#A5B4FC"
					element.style.border = "2px solid #4338ca"
				}
			})
		})
	}

	/**
    |--------------------------------------------------
    | Input Methods
    |--------------------------------------------------
    */

	#findInputFields(domItems) {
		const exclusionTypes = new Set(["hidden", "checkbox", "radio"])
		const inputTypes = "input, select, textarea"
		let inputs = Array.from(document.querySelectorAll(inputTypes))

		inputs.forEach((input: HTMLInputElement) => {
			if (!exclusionTypes.has(input.type)) {
				let domItem = {
					type: input.type === "password" ? "PCI" : "PII",
					typeOfInformation: "Input",
					confidence: "High",
					value: input.value || input.placeholder,
					selector: this.#constructInputSelector(input)
				}
				domItems.push(domItem)
			}
		})

		return domItems
	}

	#constructInputSelector(input: HTMLInputElement) {
		let tagName = input.tagName.toLowerCase()
		// Attribute Priority
		if (input.name) {
			return `${tagName}[name="${input.name}"]`
		} else if (input.id) {
			return `${tagName}[id="${input.id}"]`
		} else if (input.type) {
			return `${tagName}[type="${input.type}"]`
		} else if (input.placeholder) {
			return `${tagName}[placeholder="${input.placeholder}"]`
		} else if (input.ariaLabel) {
			return `${tagName}[aria-label="${input.ariaLabel}"]`
		} else if (input.className) {
			return `${tagName}.${input.className}`
		} else {
			return tagName
		}
	}

	/**
    |--------------------------------------------------
    | Background Worker Methods
    |--------------------------------------------------
    */

	async #identifyPII(pagePath: string) {
		print.log(`Scanning ${pagePath}`, "#228B22")
		let pageText = document.querySelector("body").innerText.replace(/\n/g, " ")
		const { result } = await sendToBackground({
			name: "pii/identify",
			body: { pageText }
		})

		return result.domItems
	}

	async #generateSelectors(domItems: Array<object>) {
		print.table(`Refining Selectors`, domItems)
		const { result } = await sendToBackground({
			name: "pii/refine",
			body: { domItems }
		})

		return result.domItems
	}

	/**
    |--------------------------------------------------
    | Public Methods
    |--------------------------------------------------
    */

	injectCSS() {
		const style = document.createElement("style")
		style.id = "config-ai"
		style.textContent = `
			.configai-overlay {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgb(165 180 252);
				z-index: 1000;
				display: flex;
				justify-content: center;
				align-items: center;
				color: white;
				font-size: 10px;
				transition: all 0.5s ease-in;
				border: 2px solid #4338ca;
				opacity: 0.8;
				padding: 2px;
			}
			.configai-close-button {
				position: absolute;
				top: 10px;
				right: 10px;
				cursor: pointer;
				background: #444;
				color: white;
				width: 5px;
				height: 5px;
				line-height: 5px;
				text-align: center;
				border-radius: 5px;
				font-size: 10px;
				font-weight: bold;
			}
`
		document.head.appendChild(style)
	}

	generateSelector(node) {
		return finder(node.parentNode, {
			optimizedMinLength: 2
		})
	}

	generateElementSelector(event: any) {
		event.preventDefault()
		const selector = finder(event.target)
		console.log(`Clicked: ${event.target.innerText} | Selector: ${selector}`)
	}

	toggleDomListener(enable: boolean) {
		print.log(`DOM Listener: ${enable ? "ON" : "OFF"}`, "#228B22")
		let pagePath = window.location.origin + window.location.pathname
		if (enable) {
			document.addEventListener("click", this.generateElementSelector)
		} else {
			document.removeEventListener("click", this.generateElementSelector)
		}
	}

	scanPageForPII() {
		try {
			let pagePath = window.location.origin + window.location.pathname
			if (this.isOn && !this.cache[pagePath]) {
				setTimeout(async () => {
					let domItems = await this.#identifyPII(pagePath)
					if (domItems.length > 0) {
						this.#findNodesWithPII(domItems)
						domItems = domItems.filter((item) => !item.delete)
						domItems = await this.#generateSelectors(domItems)
					}
					domItems = this.#findInputFields(domItems)
					this.#highlightNodesWithPII(domItems)
					this.setCache("update", { detectedData: domItems, targetUrl: pagePath, dataType: "domItems" })
				}, 3000)
			} else if (this.isOn) {
				setTimeout(async () => {
					let domItems = this.cache[pagePath].domItems
					print.table("PII/PCI Found", domItems)
					this.#highlightNodesWithPII(domItems)
				}, 3000)
			}
		} catch (err) {
			print.log(`Error Message: ${err.message}`)
		}
	}
}

export default ConfigAi
