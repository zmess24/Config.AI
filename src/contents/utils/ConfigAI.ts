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
	host: string | undefined
	nonTextBasedSelectors: string
	inputTypes: string
	cache: object
	nodesToAdd: Array<NodeToAdd>

	constructor(provider: string, isOn: boolean, host: string) {
		this.provider = provider
		this.isOn = window.location.host === host ? isOn : false
		this.host = window.location.host
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
		provider ? print.log(`Connected to Provider: ${provider}`, "#228B22") : print.log("Disconnected Provider", "#850101")
	}

	setIsOn(isOn: boolean) {
		this.isOn = isOn
		isOn ? print.log("Session Started", "#228B22") : print.log("Session Ended", "#850101")
	}

	setCache(updateType: "clear" | "update", payload?: CacheUpdatePayloadTypes) {
		if (updateType === "clear") {
			print.log("Resetting Session")
			this.cache = {}
			localStorage.removeItem("config.ai")
		}

		if (updateType === "update") {
			let { detectedData, targetUrl, dataType } = payload
			if (!this.cache[targetUrl]) this.cache[targetUrl] = { domItems: [], apiItems: [] }
			this.cache[targetUrl][dataType] = [...this.cache[targetUrl][dataType], ...detectedData]
			print.table("Cache Updated", detectedData)
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

	async #sendToBackground(message: string, { name, body }) {
		print.log(`${message}`)
		const { result } = await sendToBackground({ name, body })
		console.log(result.domItems)
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
			width: 15px;
			height: 15px;
			line-height: 15px;
			text-align: center;
			border-radius: 50%;
			font-size: 12px;
			font-weight: bold;
			user-select: none;
		  }
		  .inspect-overlay {
			position: absolute;
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			padding: 5px;
			font-size: 12px;
			pointer-events: none;
			display: none;
			z-index: 9999;
		  }
		  .inspect-toaster {
			position: absolute;
			background-color: rgba(0, 0, 0, 0.8);
			color: white;
			padding: 8px;
			font-size: 14px;
			pointer-events: none;
			display: none;
			z-index: 9999;
			border-radius: 4px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
			white-space: nowrap;
		  }
		`
		document.head.appendChild(style)
	}

	generateSelector(node) {
		return finder(node.parentNode, { optimizedMinLength: 2 })
	}

	pinOverlayToElement(target) {
		const overlay = document.createElement("div")
		overlay.className = "configai-overlay"

		const rect = target.getBoundingClientRect()
		overlay.style.top = `${rect.top + window.scrollY}px`
		overlay.style.left = `${rect.left + window.scrollX}px`
		overlay.style.width = `${rect.width}px`
		overlay.style.height = `${rect.height}px`

		overlay.textContent = `<${target.tagName.toLowerCase()}>`
		if (target.className) {
			overlay.textContent += ` .${target.className}`
		}

		// this.addCloseButton(overlay)
		document.body.appendChild(overlay)
	}

	generateElementSelector(event) {
		// Stop navigation if 'a' tag is clicked
		const link = event.target.closest("a")
		if (link) event.preventDefault() && event.stopPropagation()

		let selector = finder(event.target, { optimizedMinLength: 2 })
		// Create Overlapy
		const overlay = document.createElement("div")
		overlay.className = "configai-overlay"

		const rect = event.target.getBoundingClientRect()
		overlay.style.top = `${rect.top + window.scrollY}px`
		overlay.style.left = `${rect.left + window.scrollX}px`
		overlay.style.width = `${rect.width}px`
		overlay.style.height = `${rect.height}px`

		// this.addCloseButton(overlay)
		document.body.appendChild(overlay)
		// Prevents default click behavior
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

	addCloseButton(overlay) {
		const closeButton = document.createElement("div")
		closeButton.className = "configai-close-button"
		closeButton.textContent = "X"
		closeButton.onclick = function () {
			overlay.remove()
		}
		overlay.appendChild(closeButton)
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

		// Display the tag name and class of the target element
		// inspectOverlay.textContent = `<${target.tagName.toLowerCase()}>`
		// if (target.className) {
		// 	inspectOverlay.textContent += ` .${target.className}`
		// }

		// Set the position of the inspect toaster
		inspectToaster.style.top = `${rect.bottom + window.scrollY + 10}px`
		inspectToaster.style.left = `${rect.left + window.scrollX}px`

		// Display the tag name and class of the target element
		inspectToaster.textContent = `<${target.tagName.toLowerCase()}>`
		if (target.className) {
			inspectToaster.textContent += ` .${target.className}`
		}

		// Show the inspect overlay
		inspectToaster.style.display = "block"
		inspectOverlay.style.display = "block"
	}

	disableLinkClicks(e) {
		// Determine if clicked element is an anchor tag
		const link = e.target.closest("a")

		if (link) {
			e.preventDefault()
			e.stopPropagation()
		}
	}

	toggleDomListener(enable: boolean) {
		print.log(`DOM Listener: ${enable ? "ON" : "OFF"}`, "#228B22")
		let pagePath = window.location.origin + window.location.pathname
		if (enable) {
			// Prevent navigation on link clicks
			document.addEventListener("click", this.disableLinkClicks, true)
			// Create inspect overlay element
			this.createInspectOverlay()
			document.addEventListener("mousemove", this.handleInspectOverlayHover)
			document.addEventListener("click", this.generateElementSelector, true)
		} else {
			// Enable navigation on link clicks
			document.removeEventListener("click", this.disableLinkClicks, true)
			// Remove inspect overlay element
			this.removeInspectOverlay()
			document.removeEventListener("mousemove", this.handleInspectOverlayHover)
			document.removeEventListener("click", this.generateElementSelector, true)
		}
	}

	scanPageForPII() {
		try {
			let pagePath = window.location.origin + window.location.pathname
			if (this.isOn && !this.cache[pagePath]) {
				setTimeout(async () => {
					let pageText = document.querySelector("body").innerText.replace(/\n/g, " ")
					let domItems = await this.#sendToBackground(`Scanning ${pagePath}`, { name: "pii/identify", body: { pageText } })

					if (domItems.length > 0) {
						domItems = this.#findNodesWithPII(domItems)
						domItems = await this.#sendToBackground(`Refining Selectors for ${pagePath}`, { name: "pii/refine", body: { domItems } })
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
