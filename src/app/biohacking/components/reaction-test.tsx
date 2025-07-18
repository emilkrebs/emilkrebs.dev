'use client';

import Button from '@/app/components/Button';
import React from 'react';
import { TestResultEntry } from '../page';

type TestState = 'ready' | 'waiting' | 'clickable' | 'result';

type TestResult = {
	type: 'success' | 'failed';
	time?: number;
	message: string;
};

interface ReactionTestProps {
	onResult?: (result: TestResultEntry) => void;
}

const MessageResult: { time: number; message: string }[] = [
	{ time: 200, message: 'Lightning fast! 🚀' },
	{ time: 300, message: 'Excellent reflexes! 🎯' },
	{ time: 400, message: 'Good reaction time! 👍' },
	{ time: 500, message: 'Not bad! 😊' },
	{ time: Infinity, message: 'Room for improvement! 💪' }
];

export default function ReactionTest({ onResult }: ReactionTestProps) {
	const [testState, setTestState] = React.useState<TestState>('ready');
	const [result, setResult] = React.useState<TestResult | null>(null);
	const [startTime, setStartTime] = React.useState<number>(0);
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleTestResult = (testResult: TestResult) => {
		setResult(testResult);
		if (onResult) {
			const testData: TestResultEntry = {
				title: 'Reaction Test',
				data: {
					result: testResult.time || 0,
					succeeded: testResult.type === 'success',
					unit: 'ms'
				},
				message: testResult.message
			};
			onResult(testData);
		}
	};

	const resetTest = () => {
		setTestState('ready');
		setResult(null);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	const startTest = () => {
		setTestState('waiting');
		setResult(null);
		
		const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
		
		timeoutRef.current = setTimeout(() => {
			setStartTime(Date.now());
			setTestState('clickable');
		}, randomDelay);
	};

	const handleClick = () => {
		if (testState === 'waiting') {
			// User clicked too early
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			handleTestResult({
				type: 'failed',
				message: 'Too early! Wait for the button to turn green.'
			});
			setTestState('result');
		} else if (testState === 'clickable') {
			// Valid click - calculate reaction time
			const reactionTime = Date.now() - startTime;
			const message = MessageResult.find(m => reactionTime <= m.time)?.message || 'Keep practicing!';
			
			handleTestResult({
				type: 'success',
				time: reactionTime,
				message
			});
			setTestState('result');
		} else if (testState === 'ready' || testState === 'result') {
			startTest();
		}
	};

	return (
		<section className="w-full animate-slide-up" id="reaction-test" aria-labelledby="reaction-test-heading">
			<h2
				id="reaction-test-heading"
				className="text-3xl md:text-4xl font-bold uppercase mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
			>
				Reaction Test
			</h2>

			<article className="card-modern rounded-2xl p-8 md:p-12 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
				<div className="flex flex-col items-center gap-8 max-w-md mx-auto">
					{/* Instructions */}
					<div className="text-center space-y-2">
						{testState === 'ready' && (
							<p className="text-lg md:text-xl text-gray-300">
								Test your reaction time! Click the button as quickly as possible when it turns green.
							</p>
						)}
						{testState === 'waiting' && (
							<p className="text-lg md:text-xl text-yellow-400 animate-pulse">
								Wait for it... Don&apos;t click yet!
							</p>
						)}
						{testState === 'clickable' && (
							<p className="text-lg md:text-xl text-green-400 animate-pulse">
								Click NOW!
							</p>
						)}
						{testState === 'result' && result && (
							<div className="space-y-3">
								<p className={`text-lg md:text-xl ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
									{result.message}
								</p>
								{result.type === 'success' && result.time && (
									<div className="text-center">
										<p className="text-3xl font-bold text-white mb-2">
											{result.time}ms
										</p>
										<p className="text-sm text-gray-400">
											Average human reaction time is 200-300ms
										</p>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Test Button */}
					<div className="relative">
						<Button
							variants={
								testState === 'waiting' ? 'secondary' :
									testState === 'clickable' ? 'primary' :
										'primary'
							}
							onClick={handleClick}
							className={`
								min-w-[200px] h-16 text-lg font-semibold transition-all duration-300
								${testState === 'waiting' ? 'cursor-not-allowed animate-pulse' : 'hover:scale-105'}
								${testState === 'clickable' ? 'animate-bounce shadow-lg shadow-green-500/50' : ''}
							`}
						>
							{testState === 'ready' && 'Start Test'}
							{testState === 'waiting' && 'Wait...'}
							{testState === 'clickable' && 'CLICK!'}
							{testState === 'result' && 'Try Again'}
						</Button>
					</div>

					{/* Reset Button */}
					{testState === 'result' && (
						<button
							onClick={resetTest}
							className="text-sm text-gray-400 hover:text-white transition-colors duration-200 underline"
						>
							Reset Test
						</button>
					)}

					{/* Tips */}
					{testState === 'ready' && (
						<div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
							<h3 className="text-sm font-semibold text-purple-300 mb-2">Tips:</h3>
							<ul className="text-xs text-gray-400 space-y-1">
								<li>• Keep your finger ready over the button</li>
								<li>• Focus on the button color change</li>
								<li>• Don&apos;t anticipate - wait for green!</li>
							</ul>
						</div>
					)}
				</div>
			</article>
		</section>
	);
}