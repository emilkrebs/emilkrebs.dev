import Image from "next/image";
import LinkButton from "./link-button";
import { GITHUB_URL } from "../lib/constants";
import Link from "next/link";



export default function Projects() {
	return (
		<div className="w-full">
			<h2 className="w-full mt-8 text-2xl font-bold uppercase text-start">Featured Projects</h2>

			<section id="projects" className="flex flex-wrap justify-end w-full gap-4 mt-2 bg-transparent rounded-lg">

				<Project
					title="BIPoC Climate Justice Summit Website"
					icon="https://bipoclimatejusticenetwork.org/logo.jpg"
					description="The official website for the BIPoC Climate Justice Summit 2024"
					link="https://bipoclimatejusticenetwork.org/"
					tags={["Next.js", "Tailwind CSS", "TypeScript"]}
				/>

				<Project
					title="WatchLock"
					icon="https://github.com/emilkrebs/WatchLock/raw/main/images/WatchLock.webp"
					description="An Android & WearOS app to lock your phone using your smartwatch"
					link="https://github.com/emilkrebs/WatchLock"
					tags={["Android", "Kotlin", "WearOS"]}
				/>

				<Project
					title="Emil Krebs Website"
					icon="/favicon.svg"
					description="My personal website built with Next.js, Tailwind CSS and TypeScript"
					link="/"
					tags={["Next.js", "Tailwind CSS", "TypeScript"]}
				/>

				<Project
					title="Generator-Discord"
					icon="https://github.com/emilkrebs/Generator-Discord/raw/main/assets/icon.svg"
					description="A Yeoman generator for Discord bots supporting multiple languages"
					link="https://github.com/emilkrebs/Generator-Discord"
					tags={["Node.js", "TypeScript", "Discord.js", "Rust", "Python", "Yeoman", "npm"]}
				/>

				<Project
					title="Langium Showcase"
					icon="https://langium.org/assets/nib.svg"
					description="Showcases for DSLs built with Langium (State Machine, Arithmetics, MiniLogo, Domain Model)"
					link="https://langium.org/showcase/"
					tags={["Langium", "Node.js", "TypeScript", "React", "Hugo"]}
				/>

				<LinkButton href={`${GITHUB_URL}?tab=repositories`}>View More</LinkButton>
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

		<Link href={props.link} className="flex flex-row items-start justify-start w-full gap-4 p-4 bg-gray-900 border-2 border-white rounded-lg bg-opacity-10 hover:bg-opacity-20 h-fit hover:shadow-md">
			{props.icon && <Image src={props.icon} alt={props.title} className="hidden rounded-md sm:block size-32" width={36} height={36} />}

			<div className="flex flex-col items-start justify-between h-full gap-2">

				<div className="flex flex-row items-center justify-start w-full gap-2">
					{props.icon && <Image src={props.icon} alt={props.title} className="block rounded-md sm:hidden size-8" width={36} height={36} />}
					<h3 className="text-xl font-bold">{props.title}</h3>
				</div>

				<p className="text-base text-gray-200 sm:text-lg size-full">{props.description}</p>

				<div className="flex flex-wrap h-full gap-2">
					{props.tags.map((tag, index) => (
						<span key={index} className="px-2 py-1 text-sm bg-purple-900 rounded-lg">{tag}</span>
					))}
				</div>
			</div>
		</Link>
	);
}