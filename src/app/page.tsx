import Image from 'next/image';
import LinkButton from './components/link-button';
import Technologies from './components/technologies';
import Projects from './components/projects';

export default function Home() {
	return (
		<main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
			<div className="flex flex-col items-center justify-center w-full gap-4 mt-8">
				{/* Header */}
				<Header />
				<div className="flex flex-col items-center justify-center gap-4 w-fit max-w-screen-xl  md:p-24 xl:p-48">
				
					<About />
			
					<Technologies />

					<Projects />
				
				</div>
			</div>
		</main>
	);
}

function Header() {
	return (
		<section className="flex flex-col justify-center items-center gap-2 gap-x-4 w-full h-full">
			<div className="h-fit w-fit">
				<Image
					className="rounded-3xl w-44 h-full shadow-md"
					src="/picture.png"
					alt="Picture of Emil Krebs"
					width={100}
					height={100}
					unoptimized={true}
					priority
				/>
			</div>


			<div className="flex flex-col items-center justify-start flex-nowrap min-w-fit h-full">
				<h1 className="text-[5vb] text-center font-bold uppercase w-full">Emil Krebs</h1>
				<h2 className="text-base text-center font-light w-full text-gray-200">Passionate Software Engineer</h2>

				<div className="flex flex-col items-center justify-start gap-4 mt-4 h-full">
					<LinkButton className="w-full" href="https://linkedin.com/in/emilkrebs" target="_blank">
						<div className="flex items-center gap-2">
							<Image
								className="filter-white"
								src="/icons/linkedin.svg"
								alt="LinkedIn"
								width={20}
								height={20}
							/>
							<span>LinkedIn</span>
						</div>
					</LinkButton>

					<LinkButton className="w-full" href="https://github.com/emilkrebs" target="_blank">
						<div className="flex items-center gap-2">
							<Image
								className="filter-white"
								src="/icons/github.svg"
								alt="GitHub"
								width={20}
								height={20}
							/>
							<span>GitHub</span>
						</div>
					</LinkButton>
				</div>
			</div>
		</section>
	);
}

function About() {
	return (
		<div className="w-full">
			<h2 className="text-2xl text-start font-bold uppercase w-full">About</h2>

			<section className="flex flex-col items-start gap-4 bg-purple-900 rounded-lg p-4 shadow-md">
				<p className="text-base text-start font-light w-full ">
          Hi there 👋
					<br />
          I am a passionate software engineer from Kiel, Germany learning and growing every day.
					<br />
          I contribute to open-source projects and I love constantly learning new skills with my side projects.
					<br />
					<br />
          I am driven by creativity and a never-ending urge for knowledge.
				</p>

				{/* Download Resume Button */}
				<LinkButton href="/resume.pdf" download>
					<div className="flex items-center gap-2">
						<Image
							className="filter-white"
							src="/icons/download.svg"
							alt="Download"
							width={20}
							height={20}
						/>
						<span>Download Resume</span>
					</div>
				</LinkButton>
			</section>
		</div>

	);
}
