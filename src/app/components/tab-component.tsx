"use client";

import React, { useState } from "react";

interface TabProps {
	title: string;
	children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
	return <div>{children}</div>;
};

interface TabsProps extends React.PropsWithChildren<{}> {
	children: React.ReactNode;
}

export function Tabs({ children }: TabsProps) {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className="flex flex-col items-start bg-purple-900 rounded-lg shadow-md overflow-hidden">

			<div className="flex w-full">
				{React.Children.map(children, (child, index) => {
					const tab = child as React.ReactElement<TabProps>;
					return (
						<div
							className={`flex-1 p-2 text-center cursor-pointer w-min ${
								activeTab === index ? "bg-purple-900" : "bg-purple-800"
							}`}
							
							onClick={() => setActiveTab(index)}
						>
							{tab.props.title}
						</div>
					);
				})}
			</div>

			<div className="p-4">{(children as React.ReactElement<TabProps>[])[activeTab].props.children}</div>
		</div>
	);
}

