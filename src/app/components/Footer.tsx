import Image from "next/image";

export default function Footer() {
    return (
        <footer className="flex flex-col sm:flex-row items-center justify-between w-full gap-y-4 bg-black px-16 py-4">
            <a className="uppercase text-lg " href="/imprint">Imprint</a>

            {/* GitHub */}
            <a
                href="https://github.com/emilkrebs/emilkrebs-website"
                target="_blank"
            >
                <Image
                    className="filter-white"
                    src="/icons/github.svg"
                    alt="GitHub"
                    width={32}
                    height={32}
                />
            </a>

            <a className="uppercase text-lg" href="/privacy">Privacy Policy</a>
        </footer>
    );
}