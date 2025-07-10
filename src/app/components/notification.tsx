"use client";
import { useState } from "react";



interface NotificationProps {
	children: React.ReactNode;
}

export default function PageNotification(props: NotificationProps) {
	const [visible, setVisible] = useState(true);

	return (
		visible && (
			<div className="z-100 fixed bottom-6 right-4 left-4 sm:right-6 sm:left-auto sm:max-w-md transition-all duration-700 ease-out pointer-events-auto notification-scroll">
				<div className="card-modern rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-xl hover:scale-105 transition-transform duration-300">
					{props.children}

					<button
						className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 group"
						title="Close"
						onClick={() => setVisible(false)}
					>
						<svg
							className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200"
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
			</div>
		)
	);
}