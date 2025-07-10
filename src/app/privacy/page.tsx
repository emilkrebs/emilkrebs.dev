import RenderMarkdown from "../components/markdown";
import LinkButton from "../components/link-button";

const markdown = `

# Privacy Policy

## How do we collect information?

To get critical information about the behavior of our visitors, this website uses [Simple Analytics](https://simpleanalytics.com). 

## What information do we collect?

Simple Analytics gives insight about visitors only in general, but not about individuals per say, as it does not track visitors and does not store any personal identifiable information. 
[Go to their documentation](https://docs.simpleanalytics.com/what-we-collect) to find out what Simple Analytics collects (and most importantly what they don't).

## Cookies

This website does not use cookies. Cookies are small data files that a website transfers to your computer's hard drive when you visit the site. They allow the website to remember certain information about you, such as your preferences or browsing history.

## Third-party links

This site contains links to external websites over which we have no control. Therefore we can not accept any responsibility for their content. The respective provider or operator of the pages is always responsible for the contents of any Linked Site. The linked sites were checked at the time of linking for possible violations of law. Illegal contents did not exist at the time of linking. A permanent control of the linked pages is unreasonable without concrete evidence of a violation. Upon notification of violations, we will remove such links immediately.

## Changes to this privacy policy

We reserve the right to update this privacy policy at any time. We will notify you of any changes by posting the new privacy policy on this website.

## Contact

If you have any questions about this privacy policy, please get in touch with me at [emil.krebs@outlook.de](mailto:emil.krebs@outlook.de).

The source code for this website is available on [GitHub](https://github.com/emilkrebs/emilkrebs.dev).
`;

export default function PrivacyPolicy() {
	return (
		<main className="flex flex-col items-center justify-start w-full min-h-screen p-4">
			<div className="w-full max-w-4xl my-8">
				<LinkButton href="/">
					← Back to Home
				</LinkButton>
			</div>
			<section className="flex flex-col items-center justify-center w-full max-w-4xl h-full gap-2 p-4 gap-x-4">
				<RenderMarkdown content={markdown} />
			</section>
		</main>
	);
}
