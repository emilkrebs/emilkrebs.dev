"use client";

import { useState } from "react";



interface NotificationProps {
	content: React.ReactNode;
}

export default function PageNotification(props: NotificationProps) {
	const [visible, setVisible] = useState(true);

	return (
		visible &&
		<div className={"fixed bottom-4 right-4 bg-purple-900 border border-gray-300 rounded-lg shadow-2xl"}>
			{props.content}

			<button
				className="absolute top-0 right-0 p-2"
				title="Close"
				onClick={() => setVisible(false)}
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

		</div>
	);
}