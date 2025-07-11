import Image from "next/image";

const technologies: TechnologySection[] = [
	{
		name: "Languages",
		technologies: [
			{ path: "/icons/typescript.svg", title: "TypeScript" },
			{ path: "/icons/kotlin.svg", title: "Kotlin" },
			{ path: "/icons/python.svg", title: "Python" },
			{ path: "/icons/csharp.svg", title: "C-Sharp" },
			{ path: "/icons/javascript.svg", title: "JavaScript" },
		],
	},
	{
		name: "Frameworks & Libraries",
		technologies: [
			{ path: "/icons/react.svg", title: "React" },
			{ path: "/icons/tailwindcss.svg", title: "Tailwind CSS" },
			{ path: "/icons/nodedotjs.svg", title: "Node.js" },
			{ path: "/icons/nextdotjs.svg", title: "Next.js" },
			{ path: "/icons/express.svg", title: "Express" },
			{ path: "/icons/dotnet.svg", title: ".NET" },
			{ path: "/icons/jetpackcompose.svg", title: "Jetpack Compose" },
			{ path: "/icons/html5.svg", title: "HTML5" },
			{ path: "/icons/css3.svg", title: "CSS3" },
			{ path: "/icons/deno.svg", title: "Deno" },
			{ path: "/icons/fresh.svg", title: "Fresh" },
		],
	},
	{
		name: "Others",
		technologies: [
			{ path: "/icons/git.svg", title: "Git" },
			{ path: "/icons/mongodb.svg", title: "MongoDB" },
			{ path: "/icons/postgresql.svg", title: "PostgreSQL" },
			{ path: "/icons/npm.svg", title: "npm" },
			{ path: "/icons/mysql.svg", title: "MySQL" },
			{ path: "/icons/affinity.svg", title: "Affinity" },
		],
	},
];

interface TechnologyItem {
	path: string;
	title: string;
}

interface TechnologySection {
	name: string;
	technologies: TechnologyItem[];
}

export default function Technologies() {
	return (
		<section className="w-full animate-slide-up" id="technologies" aria-labelledby="technologies-heading">
			<h2 
				id="technologies-heading"
				className="text-3xl md:text-4xl font-bold uppercase mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
			>
				Technologies
			</h2>

			<article className="card-modern rounded-2xl p-8 md:p-12 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
				<p className="text-lg md:text-xl leading-relaxed text-gray-100 mb-10 text-center max-w-3xl mx-auto">
					I have extensive experience with a wide range of modern technologies and frameworks:
				</p>

				<div className="flex flex-col gap-12 w-full">
					{technologies.map((section, sectionIndex) => (
						<div key={section.name} className="flex flex-col gap-6">
							<h3 
								className="text-2xl md:text-3xl font-bold text-center text-purple-200 mb-4"
								id={`${section.name.toLowerCase().replace(/\s+/g, "-")}-heading`}
							>
								{section.name}
							</h3>

							<div 
								className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6 md:gap-8 justify-items-center"
								role="list"
								aria-labelledby={`${section.name.toLowerCase().replace(/\s+/g, "-")}-heading`}
							>
								{section.technologies.map((technology, techIndex) => (
									<div
										className="group flex flex-col items-center gap-3 p-4 rounded-xl glass hover:scale-110 hover:bg-purple-500/10 transform transition-all duration-300 ease-out cursor-pointer"
										key={technology.title}
										role="listitem"
										style={{
											animationDelay: `${(sectionIndex * section.technologies.length + techIndex) * 0.1}s`
										}}
									>
										<div className="relative">
											<div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
											<Image
												className="relative filter-white group-hover:filter-none transition-all duration-300"
												src={technology.path}
												alt={`${technology.title} technology logo`}
												width={56}
												height={56}
												loading="lazy"
											/>
										</div>
										<span className="text-xs sm:text-sm text-center font-medium text-gray-300 group-hover:text-white transition-colors duration-300 opacity-0 sm:opacity-100 group-hover:opacity-100">
											{technology.title}
										</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

			</article>
		</section>
	);
}