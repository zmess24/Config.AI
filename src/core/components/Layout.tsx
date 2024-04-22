import {
	Cog6ToothIcon,
	GlobeAltIcon,
	InformationCircleIcon,
	VideoCameraIcon
} from "@heroicons/react/24/outline"
import {
	GlobeAltIcon as GlobeAltIconSolid,
	VideoCameraIcon as VideoCameraIconSolid
} from "@heroicons/react/24/solid"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "~core/reducers"

function Layout({ children }) {
	const provider = useSelector((state: RootState) => state.models.provider)
	const isOn = useSelector((state: RootState) => state.session.isOn)
	return (
		<main className="p-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 md:mx-auto p-0 w-[24rem] h-[556px] text-sm font-sans">
			<div className="flex flex-row justify-between">
				<p className="text-lg font-bold mb-3 flex-col">Config.AI</p>
				<div className="flex flex-row">
					<Link to="/about" className="mx-1">
						<InformationCircleIcon className="h-5 w-5 text-gray-500 nav-link" />
					</Link>
					<Link to="/" className="mx-1">
						{isOn ? (
							<VideoCameraIconSolid className="h-5 w-5 text-green-500 nav-link mx-1" />
						) : (
							<VideoCameraIcon className="h-5 w-5 text-gray-500 nav-link mx-1" />
						)}
					</Link>
					<Link to="/provider" className="mx-1">
						{provider ? (
							<GlobeAltIconSolid className="h-5 w-5 text-indigo-700 nav-link mx-1" />
						) : (
							<GlobeAltIcon className="h-5 w-5 text-gray-500 nav-link mx-1" />
						)}
					</Link>
					<Link to="/settings" className="mx-1">
						<Cog6ToothIcon className="h-5 w-5 text-gray-500 nav-link" />
					</Link>
				</div>
			</div>
			{children}
		</main>
	)
}

export default Layout
