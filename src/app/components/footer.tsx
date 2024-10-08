import Link from "next/link";
import { EMAIL_ADDRESS } from "../lib/constants";
import LinkButton from "./link-button";
import Image from "next/image";

export function ContactMeButton() {
	return (
		<LinkButton className="w-fit" href={`mailto:${EMAIL_ADDRESS}`}>
			<div className="flex items-center gap-2">
				<Image
					className="filter-white"
					src="/icons/email.svg"
					alt="Contact"
					width={20}
					height={20}
				/>
				<span>Contact Me</span>
			</div>
		</LinkButton>
	);
}

export function Footer() {
	return (
		<footer className="flex flex-col mt-auto sm:flex-row items-center justify-between w-full gap-y-4 bg-black px-16 py-4">
			<Link className="uppercase text-lg hover:underline" href="/imprint">Imprint</Link>


			{/* Contact Me Button */}
			<ContactMeButton />

			<Link className="uppercase text-lg hover:underline" href="/privacy">Privacy Policy</Link>
		</footer>
	);
}