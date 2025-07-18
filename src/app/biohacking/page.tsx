'use client';

import React from 'react';
import LinkButton from '../components/link-button';
import ReactionTest from './components/reaction-test';
import Button from '../components/Button';


export type TestResultEntry = {
	title: string;
	data: {
		result: number;

		succeeded: boolean;
		unit: string;
	};
	message: string;
}



export default function BiohackingPage() {
	const [testData, setTestData] = React.useState<TestResultEntry[]>([]);
	const [testScore, setTestScore] = React.useState<number | null>(null);

	const calculateTestScore = (data: TestResultEntry[]) => {
		if (data.length === 0) return null;
		const total = data.reduce((sum, item) => sum + item.data.result, 0);
		return Math.round(total / data.length);
	};

	const createCSVDownload = () => {
		const csvContent =
			'data:text/csv;charset=utf-8,' +
			'Title,Result,Succeeded,Unit,Message\n' +
			testData.map(item => `${item.title},${item.data.result},${item.data.succeeded},${item.data.unit},${item.message}`).join('\n')
			+ '\nAverage Score,' + (testScore !== null ? testScore : 'N/A') + ',,ms,';

		const encodedUri = encodeURI(csvContent);

		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'test_results.csv');
		document.body.appendChild(link);
		link.click();
	};

	return (
		<main className="flex min-h-screen w-full flex-col items-center justify-start p-4">
			<div className="w-full max-w-4xl my-8">
				<LinkButton href="/">
					← Back to Home
				</LinkButton>
			</div>
			<section className="flex flex-col justify-center items-start gap-x-4 w-full max-w-4xl h-full p-4">
				<ReactionTest onResult={(result) => setTestData((prev) => [...prev, result])} />
			</section>

			<section className="flex flex-col justify-center items-start gap-x-4 w-full max-w-4xl h-full p-4">
				<h2 className="text-2xl font-bold mb-4">Test Results</h2>
				{testData.length > 0 && (
					<span className="flex flex-row items-center justify-center gap-4 border border-gray-300 rounded-md p-4 mb-4">
						<p className="text-sm text-gray-400 mb-2">
							Average Score: {calculateTestScore(testData)}ms
						</p>

						<Button
							variants="primary"
							size='small'
							onClick={createCSVDownload}
						>
							Download Results as CSV
						</Button>
					</span>
				)}
				<ul className="w-full">
					{testData.length === 0 && (
						<li className="mb-2">
							<span className="text-gray-400">Do a test to see results!</span>
						</li>
					)}
					{testData.map((data) => (
						<li key={data.title} className="mb-2">
							<span className={`font-semibold ${data.data.succeeded ? 'text-green-600' : 'text-red-600'}`}>
								{data.message}
							</span> - {data.data.result} {data.data.unit}
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}