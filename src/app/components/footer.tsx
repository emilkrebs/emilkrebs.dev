import Link from 'next/link';
import { EMAIL_ADDRESS } from '../lib/constants';
import LinkButton from './link-button';

export function ContactMeButton() {
	return (
		<LinkButton 
			className="group" 
			href={`mailto:${EMAIL_ADDRESS}`}
			icon="/icons/email.svg"
			iconAlt="Contact"
			iconSize={18}
		>
			<span className="font-medium">Contact Me</span>
		</LinkButton>
	);
}

export function Footer() {
	return (
		<footer className="w-full mt-auto bg-gradient-to-t from-slate-900 to-slate-800 border-t border-purple-500/20">
			<div className="flex justify-center w-full px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl gap-y-6">
					
					{/* Left side - Links */}
					<div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
						<Link 
							className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group" 
							href="/imprint"
						>
							<span className="relative z-10">Imprint</span>
							<div className="absolute inset-0 bg-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
						</Link>
						<Link 
							className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group" 
							href="/privacy"
						>
							<span className="relative z-10">Privacy Policy</span>
							<div className="absolute inset-0 bg-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
						</Link>
					</div>

					{/* Center - Contact Button */}
					<div className="flex-shrink-0">
						<ContactMeButton />
					</div>

					{/* Right side - Copyright */}
					<div className="text-center sm:text-right">
						<p className="text-gray-400 text-sm">
							© {new Date().getFullYear()} Emil Krebs
						</p>
						<p className="text-gray-500 text-xs mt-1">
							Built with Next.js & Tailwind CSS
						</p>
					</div>

				</div>
			</div>
		</footer>
	);
}