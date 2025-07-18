'use client';
import { useState } from 'react';



interface NotificationProps {
	children: React.ReactNode;
}

export default function PageNotification(props: NotificationProps) {
	const [visible, setVisible] = useState(true);

	return (
		visible && (
			<div className="z-50 fixed bottom-6 right-4 left-4 sm:right-6 sm:left-auto sm:max-w-md transition-all duration-700 ease-out pointer-events-auto notification-scroll">
				<div className="relative card-modern rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-xl hover:scale-105 transition-transform duration-300">
					{/* Close button - positioned at top right of the card */}
					<button
						className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
						title="Close notification"
						onClick={() => setVisible(false)}
						aria-label="Close notification"
					>
						<svg
							className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-200"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					{/* Notification content */}
					<div className="pr-12">
						{props.children}
					</div>
				</div>
			</div>
		)
	);
}