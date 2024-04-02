import Image from 'next/image';
import LinkButton from './components/link-button';
import Technologies from './components/technologies';
import Projects from './components/projects';
import { LINKEDIN_URL, GITHUB_URL } from './lib/constants';

export default async function Page() {
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
					src="/picture.webp"
					alt="Picture of Emil Krebs"
					placeholder="blur"
					blurDataURL=" data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMzQgMTM0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPjxyZWN0IGlkPSJBcnRib2FyZDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMzMuMzMzIiBoZWlnaHQ9IjEzMy4zMzMiIHN0eWxlPSJmaWxsOiM4ODNlY2U7Ii8+PGcgaWQ9IkFydGJvYXJkMTEiIHNlcmlmOmlkPSJBcnRib2FyZDEiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDQuNTM3OTIsMCwwLDQuNTM3OTIsLTE2LjMwMDEsLTcuMTQ1MDcpIj48dGV4dCB4PSI1LjA4NnB4IiB5PSIyMi4wNXB4IiBzdHlsZT0iZm9udC1mYW1pbHk6J01vbnRzZXJyYXQtQm9sZCcsICdNb250c2VycmF0Jztmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2LjUyN3B4O2ZpbGw6I2ZmZjsiPkU8L3RleHQ+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMTYuNTI3NCwwLDAsMTYuNTI3NCwyOC42MDQ0LDIyLjA1MDEpIj48L2c+PHRleHQgeD0iMTYuMTc2cHgiIHk9IjIyLjA1cHgiIHN0eWxlPSJmb250LWZhbWlseTonTW9udHNlcnJhdC1FeHRyYUJvbGRJdGFsaWMnLCAnTW9udHNlcnJhdCc7Zm9udC13ZWlnaHQ6ODAwO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtc2l6ZToxNi41MjdweDtmaWxsOiNmZmY7Ij5LPC90ZXh0PjwvZz48L2c+PC9zdmc+"
					width={100}
					height={100}
				/>
			</div>


			<div className="flex flex-col items-center justify-start flex-nowrap min-w-fit h-full">
				<h1 className="text-[5vb] text-center font-bold uppercase w-full">Emil Krebs</h1>
				<h2 className="text-base text-center font-light w-full text-gray-200">Passionate Software Engineer</h2>

				<div className="flex flex-col items-center justify-start gap-4 mt-4 h-full">
					<LinkButton className="w-full" href={LINKEDIN_URL} target="_blank">
						<div className="flex items-center gap-2">
							<Image
								className="filter-white"
								src="/icons/linkedin.svg"
								alt="Open LinkedIn"
								width={20}
								height={20}
							/>
							<span>LinkedIn</span>
						</div>
					</LinkButton>

					<LinkButton className="w-full" href={GITHUB_URL} target="_blank">
						<div className="flex items-center gap-2">
							<Image
								className="filter-white"
								src="/icons/github.svg"
								alt="Open GitHub"
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

			<section id="about" className="flex flex-col items-start gap-4 bg-purple-900 rounded-lg p-4 shadow-md">
				<p className="text-base text-start font-light w-full ">
					Hi there 👋
					<br />
					I am a passionate software engineer from Kiel, Germany, learning and growing every day.
					<br />
					I contribute to open-source projects and I love constantly learning new skills with my side projects.
					<br />
					<br />
					I am driven by creativity and a never-ending urge for knowledge.
				</p>

				<div className="flex flex-row w-full justify-start flex-wrap gap-2">
					{/* Download Resume Button */}
					<LinkButton className="w-fit" href="/resume.pdf" download>
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
				</div>
			</section>
		</div>
	);
}