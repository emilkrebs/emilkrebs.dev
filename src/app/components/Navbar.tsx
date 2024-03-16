'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
 
export default function Navbar() {
	const pathname = usePathname();
	if(pathname === '/') return null;
	return (
		<nav className="flex w-full justify-start items-center gap-4 p-4">
			<Link href="/" className="border-2 rounded-lg p-4">
                Home
			</Link>
		</nav>
	);
}