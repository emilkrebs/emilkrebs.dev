import Image from 'next/image';
import LinkButton from './link-button';

export default function Projects() {
	return (
		<div className="w-full">
			<h2 className="text-2xl text-start font-bold uppercase w-full mt-8">Featured Projects</h2>

			<section className="flex flex-wrap justify-end gap-4 bg-transparent rounded-lg w-full mt-2">
				<Project
					title="Emil Krebs Website"
					icon="/favicon.svg"
					description="My personal website built with Next.js, Tailwind CSS and TypeScript"
					link="/"
					tags={['Next.js', 'Tailwind CSS', 'TypeScript']}
				/>

				<Project
					title="WatchLock"
					icon="https://github.com/emilkrebs/WatchLock/raw/main/images/WatchLock.png"
					description="An Android & WearOS app to lock your phone using your smartwatch"
					link="https://github.com/emilkrebs/WatchLock"
					tags={['Android', 'Kotlin', 'WearOS']}
				/>

				<Project
					title="Generator-Discord"
					icon="https://github.com/emilkrebs/Generator-Discord/raw/main/assets/icon.svg"
					description="A Yeoman generator for Discord bots supporting multiple languages"
					link="https://github.com/emilkrebs/Generator-Discord"
					tags={['Node.js', 'TypeScript', 'Discord.js', 'Rust', 'Python', 'Yeoman']}
				/>

				<LinkButton href="https://github.com/emilkrebs?tab=repositories">View More</LinkButton>
			</section>
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

		<a href={props.link} className="flex flex-row items-start justify-start gap-2 border-2 bg-gray-900 bg-opacity-10 hover:bg-opacity-20 border-white w-full h-fit rounded-lg hover:shadow-md p-4">
			{props.icon && <Image src={props.icon} alt={props.title} className="w-28 h-28 rounded-md" width={36} height={36} />}

			<div className="flex flex-col items-start justify-between h-full">
				<h3 className="text-xl font-bold">{props.title}</h3>
				<p className="text-base sm:text-lg text-gray-200">{props.description}</p>

				<div className="flex flex-wrap gap-2 mt-2">
					{props.tags.map((tag, index) => (
						<span key={index} className="text-sm bg-purple-900 px-2 py-1 rounded-lg">{tag}</span>
					))}
				</div>
			</div>
		</a>
	);
}