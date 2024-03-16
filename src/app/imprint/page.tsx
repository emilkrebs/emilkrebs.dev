export default function Imprint() {
	return (
		<main className="flex min-h-screen w-full flex-col items-center justify-start p-4">
			<section className="flex flex-col justify-center items-center gap-2 gap-x-4 w-full h-full p-4">

				<h1 className="text-2xl font-bold uppercase w-full">Imprint</h1>

				<p className="text-abse font-bold w-full">
                    Information in accordance with Section 5 TMG (Telemediengesetz)
				</p>
				<p className="text-base font-light w-full">
                    Emil Krebs
					<br />
                    Hansastraße 70
					<br />
                    24118 Kiel
				</p>
				<p className="text-base font-light w-full">
                    E-Mail:
					<br />
					<a href="mailto:emil.krebs@outlook.de">
                        emil.krebs@outlook.de
					</a>
				</p>

				<p className="text-lg font-bold w-full mt-2">
                    Disclaimer
				</p>

				<p className="text-base font-bold w-full">
                    Liability for Content
				</p>

				<p className="text-base font-light w-full">
                    As a service provider we are responsible according to § 7 paragraph 1 of TMG for own contents on these pages under the general laws. According to § § 8 to 10 TMG we are not obliged as a service provider to monitor transmitted or stored foreign information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under the general laws remain unaffected. However, a relevant liability is only possible from the date of knowledge of a specific infringement. Upon notification of such violations, we will remove the content immediately.
				</p>

				<p className="text-base font-bold w-full">
                    Liability for Links
				</p>

				<p className="text-base font-light w-full">
                    This site contains links to external websites over which we have no control. Therefore we can not accept any responsibility for their content. The respective provider or operator of the pages is always responsible for the contents of any Linked Site. The linked sites were checked at the time of linking for possible violations of law. Illegal contents were at the time of linking. A permanent control of the linked pages is unreasonable without concrete evidence of a violation. Upon notification of violations, we will remove such links immediately.
				</p>


			</section>
		</main>
	);
}