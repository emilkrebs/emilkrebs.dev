"use client";

import React, { useState } from "react";

interface TabProps {
	title: string;
	children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
	return <div>{children}</div>;
}

interface TabsProps {
	children: React.ReactElement<TabProps>[];
}

export function Tabs({ children }: TabsProps) {
	const [activeTab, setActiveTab] = useState(0);

	// Ensure children is an array
	const tabsArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];

	return (
		<div className="card-modern rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/20">

			<div className="flex flex-row flex-wrap border-b border-purple-500/30">
				{tabsArray.map((child, index) => {
					if (!React.isValidElement(child)) return null;
					
					return (
						<button
							key={index}
							className={`relative flex-1 p-4 md:p-6 text-center cursor-pointer font-medium transition-all duration-300 ${
								activeTab === index 
									? "text-white bg-gradient-to-r from-purple-600/50 to-blue-600/50" 
									: "text-gray-300 hover:text-white hover:bg-purple-600/20"
							}`}
							onClick={() => setActiveTab(index)}
						>
							{activeTab === index && (
								<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400"></div>
							)}
							<span className="relative z-10">{child.props.title}</span>
						</button>
					);
				})}
			</div>

			<div className="p-6 md:p-8 min-h-[400px]">
				<div className="opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
					{tabsArray[activeTab]?.props.children}
				</div>
			</div>
		</div>
	);
}

