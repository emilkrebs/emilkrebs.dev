import Image from "next/image";
import LinkButton from "./components/link-button";
import Technologies from "./components/technologies";
import Projects from "./components/projects";
import { LINKEDIN_URL, GITHUB_URL, EMAIL_ADDRESS } from "./lib/constants";
import PageNotification from "./components/notification";
import Link from "next/link";
import { Tab, Tabs } from "./components/tab-component";
import RenderMarkdown from "./components/markdown";
import { ContactMeButton } from "./components/footer";


export default async function Page() {
	return (
		<main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
			
				
			<PageNotification>
				<div className="flex flex-col items-start justify-center gap-2 w-fit sm:w-96 px-4 py-6 sm:p-6">
					<h2 className="text-lg font-bold ">📢 Are you going to the gym?</h2>
					<p className="text-sm text-start text-wrap">Get the chance to win a <strong className="shine-effect">10€ Amazon gift card</strong> by participating in this <strong>2-minute</strong> survey!</p>

					<LinkButton href="https://forms.gle/VoqPnzx83hUq6faj6" target="_blank">Take the survey</LinkButton>
				</div>
			</PageNotification>

			<div className="flex flex-col items-center justify-center w-full gap-4 mt-8 overflow-x-hidden">

				{/* Header */}
				<Header />

				<div className="flex flex-col items-center justify-center gap-12 w-fit max-w-screen-xl md:p-24 xl:p-48">


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
		<section className="flex flex-col justify-center items-center gap-2 gap-x-4 w-full h-full">
			<div className="group h-fit w-fit">
				<Image
					className="rounded-3xl w-44 h-full shadow-md group-hover:hidden"
					src="/pictures/eyebrow_down.webp"
					alt="Picture of Emil Krebs"
					placeholder="blur"
					blurDataURL=" data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMzQgMTM0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPjxyZWN0IGlkPSJBcnRib2FyZDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMzMuMzMzIiBoZWlnaHQ9IjEzMy4zMzMiIHN0eWxlPSJmaWxsOiM4ODNlY2U7Ii8+PGcgaWQ9IkFydGJvYXJkMTEiIHNlcmlmOmlkPSJBcnRib2FyZDEiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDQuNTM3OTIsMCwwLDQuNTM3OTIsLTE2LjMwMDEsLTcuMTQ1MDcpIj48dGV4dCB4PSI1LjA4NnB4IiB5PSIyMi4wNXB4IiBzdHlsZT0iZm9udC1mYW1pbHk6J01vbnRzZXJyYXQtQm9sZCcsICdNb250c2VycmF0Jztmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2LjUyN3B4O2ZpbGw6I2ZmZjsiPkU8L3RleHQ+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMTYuNTI3NCwwLDAsMTYuNTI3NCwyOC42MDQ0LDIyLjA1MDEpIj48L2c+PHRleHQgeD0iMTYuMTc2cHgiIHk9IjIyLjA1cHgiIHN0eWxlPSJmb250LWZhbWlseTonTW9udHNlcnJhdC1FeHRyYUJvbGRJdGFsaWMnLCAnTW9udHNlcnJhdCc7Zm9udC13ZWlnaHQ6ODAwO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtc2l6ZToxNi41MjdweDtmaWxsOiNmZmY7Ij5LPC90ZXh0PjwvZz48L2c+PC9zdmc+"
					width={100}
					height={100}
				/>

				<Image
					className="rounded-3xl w-44 h-full shadow-md hidden group-hover:block"
					src="/pictures/eyebrow_up.webp"
					alt="Picture of Emil Krebs"
					placeholder="blur"
					blurDataURL=" data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMzQgMTM0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MjsiPjxyZWN0IGlkPSJBcnRib2FyZDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMzMuMzMzIiBoZWlnaHQ9IjEzMy4zMzMiIHN0eWxlPSJmaWxsOiM4ODNlY2U7Ii8+PGcgaWQ9IkFydGJvYXJkMTEiIHNlcmlmOmlkPSJBcnRib2FyZDEiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDQuNTM3OTIsMCwwLDQuNTM3OTIsLTE2LjMwMDEsLTcuMTQ1MDcpIj48dGV4dCB4PSI1LjA4NnB4IiB5PSIyMi4wNXB4IiBzdHlsZT0iZm9udC1mYW1pbHk6J01vbnRzZXJyYXQtQm9sZCcsICdNb250c2VycmF0Jztmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2LjUyN3B4O2ZpbGw6I2ZmZjsiPkU8L3RleHQ+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMTYuNTI3NCwwLDAsMTYuNTI3NCwyOC42MDQ0LDIyLjA1MDEpIj48L2c+PHRleHQgeD0iMTYuMTc2cHgiIHk9IjIyLjA1cHgiIHN0eWxlPSJmb250LWZhbWlseTonTW9udHNlcnJhdC1FeHRyYUJvbGRJdGFsaWMnLCAnTW9udHNlcnJhdCc7Zm9udC13ZWlnaHQ6ODAwO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtc2l6ZToxNi41MjdweDtmaWxsOiNmZmY7Ij5LPC90ZXh0PjwvZz48L2c+PC9zdmc+"
					width={100}
					height={100}
				/>
		
			</div>


			<div className="flex flex-col items-center justify-start flex-nowrap min-w-fit h-full">
				<h1 className="text-5xl my-2 text-center font-bold uppercase w-full">Emil Krebs</h1>
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

function BusinessCards() {
	return (
		<Link
			href="https://www.instagram.com/p/C7HkuPnIMto/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
			target="_blank"
			className="group hidden xl:flex flex-col absolute -right-16 h-fit hover:-translate-x-2 transition-transform"
		>
			<Image
				className="size-64 object-contain"
				src="/business_cards.webp"
				alt="Emil Krebs Business Cards"
				width={100}
				height={100}
			/>
			<span className="group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 transition-opacity">
				New business cards available!
			</span>
		</Link>
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
		<div className="w-full">
			<h2 className="text-2xl text-start font-bold uppercase w-full">Hire Me</h2>
			<Tabs>
				{tabs.map((tab, index) => (
					<Tab title={tab.title} key={index}>
						<div className="flex flex-col items-start gap-4">
							<RenderMarkdown content={tab.content} />

							{/* Intersted? Contact me! */}
							<h3 className="text-lg font-bold">Interested in working together?</h3>
							<ContactMeButton />
						</div>
					</Tab>
				))}
			</Tabs>
		</div>
	);
}
