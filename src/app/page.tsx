import Image from "next/image";
import LinkButton from "./components/link-button";
import Technologies from "./components/technologies";
import Projects from "./components/projects";
import { LINKEDIN_URL, GITHUB_URL, EMAIL_ADDRESS } from "./lib/constants";
import PageNotification from "./components/notification";
import { Tab, Tabs } from "./components/tab-component";
import RenderMarkdown from "./components/markdown";
import { ContactMeButton } from "./components/footer";


export default async function Page() {
	return (
		<main className="flex min-h-screen w-full flex-col items-center justify-start">
			<PageNotification>
				<div className="flex flex-col items-start justify-center gap-3 w-fit sm:w-96 px-6 py-8 sm:p-8">
					<h2 className="text-xl font-bold flex items-center gap-2">
						📢 Looking for testers 
						<span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">Limited</span>
					</h2>
					<p className="text-sm text-start text-wrap leading-relaxed">
						Requirements to participate:
						
						<ul className="list-disc list-inside text-sm mt-2 space-y-1">
							<li>
								Android phone with Android 11.0 or higher
							</li>
							<li>
								WearOS smartwatch with WearOS 3.0 or higher
							</li>
						</ul>


						<details className="w-full mt-3">
							<summary className="cursor-pointer hover:text-purple-300 transition-colors">More Info</summary>
							<p className="text-sm text-start text-wrap mt-2 leading-relaxed">
								WatchLock is a WearOS app for personal security that allows you to unlock your phone with your smartwatch. Never leave your phone unlocked for bad people.<br />
							</p>
						</details>

					</p>

					<LinkButton href="https://groups.google.com/g/watchlock" target="_blank">Join Now! 🚀💪</LinkButton>
				</div>
			</PageNotification>

			<div className="flex flex-col items-center justify-center w-full gap-16 pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">

				{/* Header */}
				<Header />

				<div className="flex flex-col items-center justify-center gap-20 w-full max-w-7xl">

					<About />

					<Technologies />

					<HireMe />

					<Projects />

				</div>
			</div>
		</main>
	);
}

function Header() {
	return (
		<section className="flex flex-col justify-center items-center gap-8 w-full max-w-2xl mx-auto text-center animate-fade-in">
			<div className="relative group">
				<div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
				<Image
					className="relative rounded-3xl w-48 h-48 object-cover shadow-2xl border-2 border-white/20"
					src="/pictures/main.webp"
					alt="Picture of Emil Krebs"
					placeholder="blur"
					blurDataURL=" data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMzQgMTM0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPjxyZWN0IGlkPSJBcnRib2FyZDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMzMuMzMzIiBoZWlnaHQ9IjEzMy4zMzMiIHN0eWxlPSJmaWxsOiM4ODNlY2U7Ii8+PGcgaWQ9IkFydGJvYXJkMTEiIHNlcmlmOmlkPSJBcnRib2FyZDEiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDQuNTM3OTIsMCwwLDQuNTM3OTIsLTE2LjMwMDEsLTcuMTQ1MDcpIj48dGV4dCB4PSI1LjA4NnB4IiB5PSIyMi4wNXB4IiBzdHlsZT0iZm9udC1mYW1pbHk6J01vbnRzZXJyYXQtQm9sZCcsICdNb250c2VycmF0Jztmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2LjUyN3B4O2ZpbGw6I2ZmZjsiPkU8L3RleHQ+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMTYuNTI3NCwwLDAsMTYuNTI3NCwyOC42MDQ0LDIyLjA1MDEpIj48L2c+PHRleHQgeD0iMTYuMTc2cHgiIHk9IjIyLjA1cHgiIHN0eWxlPSJmb250LWZhbWlseTonTW9udHNlcnJhdC1FeHRyYUJvbGRJdGFsaWMnLCAnTW9udHNlcnJhdCc7Zm9udC13ZWlnaHQ6ODAwO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtc2l6ZToxNi41MjdweDtmaWxsOiNmZmY7Ij5LPC90ZXh0PjwvZz48L2c+PC9zdmc+"
					width={192}
					height={192}
				/>
			</div>

			<div className="flex flex-col items-center justify-center gap-6">
				<div className="space-y-2">
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
						Emil Krebs
					</h1>
					<h2 className="text-lg md:text-xl font-light text-gray-300 max-w-md">
						Passionate Software Engineer from Kiel, Germany
					</h2>
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
					<LinkButton className="min-w-[140px]" href={LINKEDIN_URL} target="_blank">
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

					<LinkButton className="min-w-[140px]" href={GITHUB_URL} target="_blank">
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

				{/* Scroll indicator */}
				<div className="flex flex-col items-center mt-12 animate-bounce">
					<div className="w-1 h-12 bg-gradient-to-b from-purple-400 to-transparent rounded-full"></div>
					<svg className="w-6 h-6 text-purple-300 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</div>
			</div>
		</section>
	);
}

function About() {
	return (
		<div className="w-full animate-slide-up">
			<h2 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
				About
			</h2>

			<section id="about" className="card-modern rounded-2xl p-8 md:p-12 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
				<div className="max-w-4xl mx-auto">
					<p className="text-lg md:text-xl leading-relaxed text-gray-100 mb-8 text-center">
						Hi there 👋
						<br className="mb-4" />
						I am a passionate software engineer from Kiel, Germany, learning and growing every day.
						<br className="mb-4" />
						I contribute to open-source projects and I love constantly learning new skills with my side projects.
						<br className="mb-4" />
						<span className="text-purple-300 font-medium">I am driven by creativity and a never-ending urge for knowledge.</span>
					</p>

					<div className="flex justify-center">
						{/* Download Resume Button */}
						<LinkButton href="/resume.pdf" download>
							<div className="flex items-center gap-3">
								<Image
									className="filter-white"
									src="/icons/download.svg"
									alt="Download"
									width={24}
									height={24}
								/>
								<span className="text-lg font-medium">Download Resume</span>
							</div>
						</LinkButton>
					</div>
				</div>
			</section>
		</div>
	);
}

function HireMe() {

	const tabs = [
		{
			title: "Web Development",
			content: `
**Crafting Web Experiences**

As a seasoned full-stack web developer, I specialize in creating dynamic or static web experiences. Whether you need a sleek business website, a web application, or a personalized online presence, I've got you covered.

**My Expertise Includes:**

- **Frontend Development:** Building interfaces using HTML, CSS, TypeScript, and popular frameworks like React and Tailwind CSS.
- **Backend Development:** Designing robust and scalable server-side architecture with languages like Node.js, Python, and C#.
- **Full-Stack Development:** Seamlessly integrating frontend and backend technologies to deliver a complete web solution using full-stack frameworks like Next.js, ASP.net or Fresh.
- **Progressive Web Apps (PWAs):** Developing web applications that offer a native app-like experience across all devices.

Let's discuss your project and see how I can help you achieve your goals.
		  `,
		},
		{
			title: "Mobile Development",
			content: `
**Bringing Your Mobile App Ideas to Life**

I'm passionate about creating innovative and intuitive mobile applications that deliver exceptional user experiences. With a strong foundation in Android development using Kotlin and Java, I can turn your app concept into a reality.

**My Skills Include:**

- **Android App Development:** Building native Android or WearOS apps with Kotlin and Java, leveraging the latest Android SDK and design guidelines.
- **Cross-Platform Development:** Exploring options like Xamarin and React Native for efficient development across iOS and Android platforms.

Let's talk about your app idea and how we can collaborate to build something amazing.
		  `,
		},
		{
			title: "Windows Development",
			content: `
**Crafting Desktop Solutions**

If you're looking for a desktop application to streamline your business processes or enhance user productivity, I can help. With experience in developing desktop applications for Windows and Linux, I can create custom solutions tailored to your specific needs.

**My Expertise Includes:**

- **Windows Development:** Building desktop applications using C# and WPF for a seamless Windows experience.

Let's discuss your desktop application project and explore the possibilities together.
		  `,
		},
		{
			title: "Other",
			content: `
**Open to New Challenges**

If your project doesn't fall neatly into the categories above, don't hesitate to reach out. I'm always eager to learn new technologies and tackle exciting challenges.

**Some areas I'm interested in exploring include:**

- Embedded Systems Development
- Machine Learning
- Game Development
- IoT 

Let's discuss your unique requirements and find a solution that works for you.
		  `,
		},
	];

	return (
		<div className="w-full animate-slide-up">
			<h2 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
				Hire Me
			</h2>
			<Tabs>
				{tabs.map((tab, index) => (
					<Tab title={tab.title} key={index}>
						<div className="flex flex-col items-start gap-6 max-w-4xl">
							<RenderMarkdown content={tab.content} />

							{/* Interested? Contact me! */}
							<div className="mt-8 p-6 glass rounded-xl border border-purple-500/30">
								<h3 className="text-xl font-bold mb-4 text-purple-200">Interested in working together?</h3>
								<ContactMeButton />
							</div>
						</div>
					</Tab>
				))}
			</Tabs>
		</div>
	);
}
