import Image from 'next/image';

export const technologies: TechnologySection[] = [
	{
		name: 'Languages',
		technologies: [
			{ path: '/icons/typescript.svg', title: 'TypeScript' },
			{ path: '/icons/kotlin.svg', title: 'Kotlin' },
			{ path: '/icons/python.svg', title: 'Python' },
			{ path: '/icons/csharp.svg', title: 'C-Sharp' },
			{ path: '/icons/javascript.svg', title: 'JavaScript' },
		],
	},
	{
		name: 'Frameworks & Libraries',
		technologies: [
			{ path: '/icons/react.svg', title: 'React' },
			{ path: '/icons/tailwindcss.svg', title: 'Tailwind CSS' },
			{ path: '/icons/nodedotjs.svg', title: 'Node.js' },
			{ path: '/icons/nextdotjs.svg', title: 'Next.js' },
			{ path: '/icons/express.svg', title: 'Express' },
			{ path: '/icons/dotnet.svg', title: '.NET' },
			{ path: '/icons/jetpackcompose.svg', title: 'Jetpack Compose' },
			{ path: '/icons/html5.svg', title: 'HTML5' },
			{ path: '/icons/css3.svg', title: 'CSS3' },
			{ path: '/icons/deno.svg', title: 'Deno' },
			{ path: '/icons/fresh.svg', title: 'Fresh' },
		],
	},
	{
		name: 'Others',
		technologies: [
			{ path: '/icons/git.svg', title: 'Git' },
			{ path: '/icons/mongodb.svg', title: 'MongoDB' },
			{ path: '/icons/postgresql.svg', title: 'PostgreSQL' },
			{ path: '/icons/npm.svg', title: 'npm' },
			{ path: '/icons/mysql.svg', title: 'MySQL' },
			{ path: '/icons/affinity.svg', title: 'Affinity' },
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
		<div className="w-full">
			<h2 className="text-2xl text-start font-bold uppercase w-full mt-8">Technologies</h2>

			<section className="flex flex-col items-start gap-4 bg-purple-900 rounded-lg p-4 shadow-md">
				<p className="text-base text-start font-light w-full ">
					I have experience with a wide range of technologies, including but not limited to:
				</p>

				<div className="flex flex-col gap-4 w-full">
					{technologies.map((section) => (
						<div key={section.name} className="flex flex-col gap-2">
							<h3 className="text-lg text-start font-bold uppercase w-full mt-2">{section.name}</h3>

							<div className="flex flex-row flex-wrap gap-4">
								{section.technologies.map((technology) => (
									<div
										className="group flex flex-col items-center gap-2 w-fit h-fit hover:translate-y-[-0.25em] transform transition-transform duration-300 ease-in-out"
										key={technology.title}
									>
										<Image
											className="filter-white"
											src={technology.path}
											alt={technology.title}
											width={50}
											height={50}
										/>
										<span className="text-xs hidden sm:block text-center font-light group-hover:block">{technology.title}</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

			</section>
		</div>

	);
}