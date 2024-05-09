import styleText from "data-text:./style.css"
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetStyle } from "plasmo"
import type { FC } from "react"

export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"],
	css: ["style.css"]
}

// export const getStyle: PlasmoGetStyle = () => {
// 	const style = document.createElement("style")
// 	style.textContent = styleText
// 	return style
// }

const PlasmoOverlay: FC<PlasmoCSUIProps> = () => {
	return (
		// <div className="shadow-lg p-4 bg-white rounded-lg z-50 bg-gray-200 text-gray-900 text-sm font-sans flex flex-row justify-between" style={{ width: "300px", height: "50px" }}>
		// 	<p className="text-sm font-bold mb-3 flex-col">Config.AI:</p>
		// 	<p className="text-sm font-bold mb-3 flex-col">Status: Config.Ai</p>
		// </div>
		<></>
	)
}

export default PlasmoOverlay
