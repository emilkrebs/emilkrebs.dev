import RenderMarkdown from "../components/markdown";
import Link from "next/link";
import { EMAIL_ADDRESS, PHONE_NUMBER } from "../lib/constants";

const markdown = `
# Imprint

## Information in accordance with Section 5 TMG (Telemediengesetz)

Emil Krebs

Hansastraße 70,
24118 Kiel


\
E-Mail: [${EMAIL_ADDRESS}](mailto:${EMAIL_ADDRESS})

Phone: ${PHONE_NUMBER}

## Disclaimer

### Liability for Content

As a service provider we are responsible according to § 7 paragraph 1 of TMG for own contents on these pages under the general laws. According to § § 8 to 10 TMG we are not obliged as a service provider to monitor transmitted or stored foreign information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under the general laws remain unaffected. However, a relevant liability is only possible from the date of knowledge of a specific infringement. Upon notification of such violations, we will remove the content immediately.


### Liability for Links

This site contains links to external websites over which we have no control. Therefore we can not accept any responsibility for their content. The respective provider or operator of the pages is always responsible for the contents of any Linked Site. The linked sites were checked at the time of linking for possible violations of law. Illegal contents did not exist at the time of linking. A permanent control of the linked pages is unreasonable without concrete evidence of a violation. Upon notification of violations, we will remove such links immediately.
`;

export default function Imprint() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-start px-6">
            <div className="w-full max-w-3xl my-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                >
                    <span className="text-signal" aria-hidden="true">←</span>
                    Back to home
                </Link>
            </div>
            <section className="w-full max-w-3xl pb-24">
                <RenderMarkdown content={markdown} />
            </section>
        </main>
    );
}
