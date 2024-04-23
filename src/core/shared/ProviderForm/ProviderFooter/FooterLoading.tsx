import { Transition } from "@headlessui/react"
import React from "react"
import { PuffLoader } from "react-spinners"

function FooterLoading({ show }) {
	return (
		<Transition
			show={show}
			enter="transition-opacity duration-1000"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-500"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			className="flex flex-col justify-items-center mb-2">
			<p className="mb-2 text-center leading-6 text-md text-gray-600">
				Connecting to service...
			</p>
			<div className="flex justify-center">
				<PuffLoader color="#3f51b5" />
			</div>
		</Transition>
	)
}

export default FooterLoading
