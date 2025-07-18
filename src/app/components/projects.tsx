'use client';

import Image from 'next/image';
import LinkButton from './link-button';
import { GITHUB_URL } from '../lib/constants';
import Link from 'next/link';

export default function Projects() {
	const projects: ProjectProps[] = [
		{
			title: 'VailNote',
			icon: 'https://vailnote.com/apple-touch-icon.png',
			description: 'Open-source, encrypted note sharing with zero-knowledge encryption, self-destructing notes, and anonymous rate limiting.',
			link: 'https://vailnote.com/',
			tags: ['TypeScript', 'Fresh', 'Tailwind CSS', 'Deno', 'Preact', 'MongoDB', 'Cybersecurity', 'Encryption', 'Zero-Knowledge']
		},
		{
			title: 'BIPoC Climate Justice Conference Website',
			icon: 'https://bipoclimatejusticenetwork.org/poster.png',
			description: 'The official website for the BIPoC Climate Justice Conference 2024 & 2025. Featuring localized content and 100% markdown support using static site generation.',
			link: 'https://bipoclimatejusticenetwork.org/',
			tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'React', 'Localization']
		},
		{
			title: 'WatchLock',
			icon: 'https://github.com/emilkrebs/WatchLock/raw/main/images/WatchLock.webp',
			description: 'An Android & WearOS app to lock your phone using your smartwatch. Built for personal security.',
			link: 'https://github.com/emilkrebs/WatchLock',
			tags: ['Android', 'Kotlin', 'WearOS', 'Gradle', 'Google Play']
		},
		{
			title: 'Emil Krebs Website',
			icon: '/favicon.svg',
			description: 'My personal website built with Next.js, Tailwind CSS and TypeScript using static site generation for fast performance.',
			link: '/',
			tags: ['Next.js', 'Tailwind CSS', 'TypeScript']
		},
		{
			title: 'Generator-Discord',
			icon: 'https://github.com/emilkrebs/Generator-Discord/raw/main/assets/icon.svg',
			description: 'A Yeoman generator for Discord bots supporting multiple languages, simplifying bot creation with templates.',
			link: 'https://github.com/emilkrebs/Generator-Discord',
			tags: ['Node.js', 'TypeScript', 'Discord.js', 'Rust', 'Python', 'Yeoman', 'npm']
		},
		{
			title: 'Langium Showcase',
			icon: 'https://langium.org/assets/nib.svg',
			description: 'Showcases for custom Domain-Specific Languages (DSLs) built with Langium (State Machine, Arithmetics, MiniLogo, Domain Model)',
			link: 'https://langium.org/showcase/',
			tags: ['Langium', 'Node.js', 'TypeScript', 'React', 'Hugo', 'Tailwind CSS', 'DSLs']
		}
	];

	return (
		<div className="w-full animate-slide-up">		
			<h2 
				id="projects-heading"
				className="text-3xl md:text-4xl font-bold uppercase mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
			>
				Featured Projects
			</h2>

			<section 
				id="projects" 
				className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 w-full"
				role="region"
				aria-labelledby="projects-heading"
			>
				{projects.map((project, index) => (
					<Project
						key={project.title}
						{...project}
					/>
				))}
			</section>
			
			<div className="flex justify-center sm:justify-end mt-8 sm:mt-12">
				<LinkButton href={`${GITHUB_URL}?tab=repositories`} aria-label="View more projects on GitHub">
					<span className="text-base sm:text-lg font-medium">View More Projects</span>
				</LinkButton>
			</div>
		</div>
	);
}

interface ProjectProps {
	icon?: string;
	title: string;
	description: string;
	link: string;
	tags: string[];
}

export function Project(props: ProjectProps) {
	return (
		<article>
			<Link 
				href={props.link} 
				className="group card-modern rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 cursor-pointer block h-full"
				aria-label={`View project: ${props.title}`}
			>
				<div className="flex flex-col gap-4 sm:gap-6 h-full">
					{/* Header with icon and title */}
					<header className="flex items-start gap-3 sm:gap-4">
						{props.icon && (
							<div className="relative flex-shrink-0">
								<div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
								<Image 
									src={props.icon} 
									alt={`${props.title} logo`}
									className="relative rounded-lg sm:rounded-xl object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" 
									width={80} 
									height={80}
									sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
									loading="lazy"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = '/favicon.svg';
									}}
								/>
							</div>
						)}
						<div className="flex-1 min-w-0">
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300 mb-1 sm:mb-2 leading-tight">
								{props.title}
							</h3>
						</div>
					</header>

					{/* Description */}
					<p className="text-sm sm:text-base md:text-lg leading-relaxed flex-1 text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
						{props.description}
					</p>

					{/* Tags */}
					<footer className="flex flex-wrap gap-1.5 sm:gap-2" role="list" aria-label="Technologies used">
						{props.tags.map((tag, index) => (
							<span 
								key={index} 
								className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 rounded-full text-purple-200 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all duration-300 whitespace-nowrap"
								role="listitem"
							>
								#{tag}
							</span>
						))}
					</footer>
				</div>
			</Link>
		</article>
	);
}
