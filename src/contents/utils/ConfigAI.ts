import { DocumentChartBarIcon } from "@heroicons/react/24/outline"
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
	delete?: boolean
}

interface CacheUpdatePayloadTypes {
	detectedData: Array<DomItemTypes>
	pagePath: string
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
	host: string | undefined
	nonTextBasedSelectors: string
	inputTypes: string
	cache: object
	nodesToAdd: Array<NodeToAdd>
	pagePath: string

	constructor(provider: string, isOn: boolean, host: string) {
		this.provider = provider
		this.isOn = window.location.host === host ? isOn : false
		this.host = window.location.host
		this.cache = JSON.parse(window.localStorage.getItem("config.ai") || "{}")
		this.nonTextBasedSelectors = "script, style, img, noscript, iframe, video, audio, canvas, meta, svg, path"
		this.inputTypes = "input, textarea, select, label, option"
		this.nodesToAdd = []
		this.pagePath = window.location.origin + window.location.pathname
		// Function Bindings
		this.generateElementSelector = this.generateElementSelector.bind(this)

		print.log(`Provider: ${this.provider} | Session: ${this.isOn}`, "#3f51b5")
	}

	/**
    |--------------------------------------------------
    | Setter Methods
    |--------------------------------------------------
    */

	setProvider(provider: string) {
		this.provider = provider
		provider ? print.log(`Connected to Provider: ${provider}`, "#228B22") : print.log("Disconnected Provider", "#850101")
	}

	setPagePath() {
		this.pagePath = window.location.origin + window.location.pathname
	}

	setIsOn(isOn: boolean) {
		this.isOn = isOn
		isOn ? print.log("Session Started", "#228B22") : print.log("Session Ended", "#850101")
	}

	setCache(updateType: "clear" | "update", payload?: CacheUpdatePayloadTypes) {
		if (updateType === "clear") {
			this.cache = {}
			localStorage.removeItem("config.ai")
			print.log("Session Reset")
		}

		if (updateType === "update") {
			let { detectedData, pagePath, dataType } = payload
			if (!this.cache[pagePath]) this.cache[pagePath] = { domItems: [], apiItems: [] }
			this.cache[pagePath][dataType] = [...detectedData]
			localStorage.setItem("config.ai", JSON.stringify(this.cache))
			print.table("Cache Updated", detectedData)
		}
	}

	/**
    |--------------------------------------------------
    | Overlay Functions
    |--------------------------------------------------
    */

	createOverlay(targetElement, selector) {
		// Create an overlay element
		const overlay = document.createElement("div.")
		overlay.className = "configai-overlay configai-highlight"
		// Create a close button and append it to the overlay
		let closeButton = this.addCloseButton(overlay)
		let pagePath = window.location.origin + window.location.pathname
		closeButton.onclick = () => {
			let detectedData = this.cache[pagePath].domItems.filter((item) => item.selector !== selector)
			this.setCache("update", { detectedData, pagePath, dataType: "domItems" })
			overlay.remove()
		}
		// Append the overlay to the target element
		targetElement.style.position = "relative" // Ensure the target can hold absolute positioned children
		targetElement.appendChild(overlay)
	}

	addCloseButton(overlay) {
		// Create a close button element
		const closeButton = document.createElement("div")
		closeButton.className = "configai-close-button"
		closeButton.textContent = "x"
		// Append the overlay to the target element
		overlay.appendChild(closeButton)
		return closeButton
	}

	/**
    |--------------------------------------------------
    | Private DOM Methods
    |--------------------------------------------------
    */

	#createTreeWalker(nodeFilter) {
		return document.createTreeWalker(document.body, nodeFilter, null)
	}

	#findNodesWithPII(domItems: Array<DomItemTypes>) {
		const walker = this.#createTreeWalker(NodeFilter.SHOW_TEXT)
		let node

		while ((node = walker.nextNode())) {
			domItems.forEach((data) => {
				let nodeText = node.textContent.toLowerCase()
				if (nodeText.includes(data.value.toLowerCase()) && !["SCRIPT", "INPUT"].includes(node.parentNode.nodeName)) {
					if (node.parentNode.nodeName !== "LABEL") {
						data.selector = finder(node.parentNode, { optimizedMinLength: 2 })
					} else {
						data.delete = true
					}
				}
			})
		}

		return domItems.filter((item: DomItemTypes) => !item.delete)
	}

	#highlightNodesWithPII(domItems) {
		// Bind the current instance of the class to the function
		let createOverlay = this.createOverlay.bind(this)

		domItems.forEach((data) => {
			const elements = document.querySelectorAll(data.selector)
			elements.forEach((element) => {
				if (data.typeOfInformation !== "Input") {
					if (data.selector) createOverlay(element, data.selector)
				} else {
					element.className += " configai-highlight"
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

	async #sendToBackground(message: string, { name, body }) {
		print.log(`${message}`)
		const { result } = await sendToBackground({ name, body })
		return result.domItems
	}

	/**
    |--------------------------------------------------
    | Public Methods
    |--------------------------------------------------
    */

	generateSelector(node) {
		return finder(node.parentNode, { optimizedMinLength: 2 })
	}

	generateElementSelector(event) {
		let selector = finder(event.target, { optimizedMinLength: 2 })
		// Create Overlapy
		const overlay = document.createElement("div")
		overlay.className = "configai-overlay configai-highlight-pending"

		const rect = event.target.getBoundingClientRect()
		overlay.style.top = `${rect.top + window.scrollY}px`
		overlay.style.left = `${rect.left + window.scrollX}px`
		overlay.style.width = `${rect.width}px`
		overlay.style.height = `${rect.height}px`

		document.body.appendChild(overlay)

		this.nodesToAdd.push({
			selector,
			type: "",
			typeOfInformation: "",
			confidence: "High",
			value: event.target.innerText
		})

		return false
	}

	createInspectOverlay() {
		// Overlay for inspecting elements
		const inspectOverlay = document.createElement("div") as HTMLElement
		inspectOverlay.className = "inspect-overlay"
		document.body.appendChild(inspectOverlay)
		// Toaster for inspecting elements
		const inspectToaster = document.createElement("div") as HTMLElement
		inspectToaster.className = "inspect-toaster"
		document.body.appendChild(inspectToaster)
	}

	removeInspectOverlay() {
		// Overlay for inspecting elements
		const inspectOverlay = document.querySelector(".inspect-overlay") as HTMLElement
		if (inspectOverlay) document.body.removeChild(inspectOverlay)
		// Toaster for inspecting elements
		const inspectToaster = document.querySelector(".inspect-toaster") as HTMLElement
		if (inspectToaster) document.body.removeChild(inspectToaster)
	}

	handleInspectOverlayHover(event: any) {
		const target = event.target
		const inspectOverlay = document.querySelector(".inspect-overlay") as HTMLElement
		const inspectToaster = document.querySelector(".inspect-toaster") as HTMLElement
		// Get the bounding rectangle of the target element
		const rect = target.getBoundingClientRect()
		// Set the position and size of the inspect overlay
		inspectOverlay.style.top = `${rect.top + window.scrollY}px`
		inspectOverlay.style.left = `${rect.left + window.scrollX}px`
		inspectOverlay.style.width = `${rect.width}px`
		inspectOverlay.style.height = `${rect.height}px`
		inspectOverlay.style.display = "block"

		// Set the position of the inspect toaster
		inspectToaster.style.top = `${rect.bottom + window.scrollY + 10}px`
		inspectToaster.style.left = `${rect.left + window.scrollX}px`
		inspectToaster.style.display = "block"

		// Display the tag name and class of the target element
		inspectToaster.textContent = `<${target.tagName.toLowerCase()}>`
		if (target.className) {
			inspectToaster.textContent += ` .${target.className}`
		}
	}

	disableLinkClicks(e) {
		const link = e.target.closest("a")
		if (link) e.preventDefault()
	}

	showLoadingPopup() {
		const overlay = document.createElement("div")
		overlay.classList.add("popup-overlay")
		overlay.innerHTML = `
		  <div class="popup-content">
			<p>Loading...</p>
			<div class="loading-icon"></div>
		  </div>
		`
		document.body.appendChild(overlay)
		debugger
		return overlay
	}

	hideLoadingPopup(overlay) {
		if (overlay) overlay.remove()
	}

	async toggleDomListener(enable: boolean) {
		print.log(`DOM Listener: ${enable ? "ON" : "OFF"}`, "#228B22")

		if (enable) {
			// Add Event Listeners & Overlay
			this.createInspectOverlay()
			document.addEventListener("click", this.disableLinkClicks, true)
			document.addEventListener("mousemove", this.handleInspectOverlayHover)
			document.addEventListener("click", this.generateElementSelector)
		} else {
			// Remove Event Listeners & Overlay
			this.removeInspectOverlay()
			document.removeEventListener("click", this.disableLinkClicks, true)
			document.removeEventListener("mousemove", this.handleInspectOverlayHover)
			document.removeEventListener("click", this.generateElementSelector)

			// Process Selectors
			if (this.nodesToAdd.length > 0) {
				let domItems = await this.#sendToBackground(`Refining Selectors for ${this.pagePath}`, { name: "pii/refine", body: { domItems: this.nodesToAdd } })
				this.cache[this.pagePath].domItems = [...this.cache[this.pagePath].domItems, ...domItems]
				this.setCache("update", { detectedData: this.cache[this.pagePath].domItems, pagePath: this.pagePath, dataType: "domItems" })
				document.querySelectorAll(".configai-highlight-pending").forEach((element) => {
					element.classList.remove("configai-highlight-pending")
					element.classList.add("configai-highlight")
					this.addCloseButton(element)
				})
				this.nodesToAdd = []
			}
		}
	}

	scanPageForPII() {
		try {
			if (this.isOn && !this.cache[this.pagePath]) {
				setTimeout(async () => {
					const loadingOverlay = this.showLoadingPopup()
					let pageText = document.querySelector("body").innerText.replace(/\n/g, " ")
					let domItems = await this.#sendToBackground(`Scanning ${this.pagePath}`, { name: "pii/identify", body: { pageText } })

					if (domItems.length > 0) {
						domItems = this.#findNodesWithPII(domItems)
						domItems = await this.#sendToBackground(`Refining Selectors for ${this.pagePath}`, { name: "pii/refine", body: { domItems } })
					}
					domItems = this.#findInputFields(domItems)
					this.#highlightNodesWithPII(domItems)
					this.setCache("update", { detectedData: domItems, pagePath: this.pagePath, dataType: "domItems" })
					this.hideLoadingPopup(loadingOverlay)
				}, 3000)
			} else if (this.isOn) {
				setTimeout(async () => {
					const loadingOverlay = this.showLoadingPopup()
					let domItems = this.cache[this.pagePath].domItems
					this.#highlightNodesWithPII(domItems)
					print.table("PII/PCI Found", domItems)
					this.hideLoadingPopup(loadingOverlay)
				}, 3000)
			}
		} catch (err) {
			print.log(`Error Message: ${err.message}`)
		}
		// this.hideLoadingPopup(loadingOverlay)
	}
}

export default ConfigAi
