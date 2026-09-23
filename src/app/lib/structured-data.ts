import { GITHUB_URL, LINKEDIN_URL, SITE_NAME, SITE_URL } from "./constants";
import { copy, htmlLang, type Locale } from "./i18n";
import { absoluteUrl, routeLocales, routePath, type RouteKey } from "./routes";

/**
 * schema.org graphs for the JSON-LD blocks. The person and the website carry
 * stable @ids so every page describes the same two entities; the home pages
 * define them in full, other pages reference them by @id.
 */

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const HOME_URL = absoluteUrl(routePath("home"));

const personRef = { "@type": "Person", "@id": PERSON_ID, name: SITE_NAME, url: HOME_URL };
const websiteRef = { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: HOME_URL };

function person(locale: Locale) {
    return {
        ...personRef,
        image: absoluteUrl("/pictures/portrait.webp"),
        jobTitle: "Software Engineer",
        description: copy[locale].jsonLd.personDescription,
        sameAs: [GITHUB_URL, LINKEDIN_URL],
        address: {
            "@type": "PostalAddress",
            addressLocality: "Kiel",
            addressCountry: "DE",
        },
        worksFor: {
            "@type": "Organization",
            name: "TypeFox GmbH",
            url: "https://typefox.io",
        },
        // A current student: affiliation, not alumniOf, which means graduated.
        affiliation: {
            "@type": "CollegeOrUniversity",
            name: "Kiel University",
            sameAs: "https://www.uni-kiel.de/en/",
        },
        knowsAbout: [
            "Software Engineering",
            "Language Server Protocol",
            "Langium",
            "Theia",
            "Developer Tools",
            "TypeScript",
            "Kotlin",
            "Open Source",
            "Spaced Repetition",
            "Health Optimization",
        ],
    };
}

function website() {
    return {
        ...websiteRef,
        alternateName: "emilkrebs.dev",
        inLanguage: routeLocales("home").map((locale) => htmlLang[locale]),
        publisher: { "@id": PERSON_ID },
    };
}

function graph(...nodes: object[]) {
    return { "@context": "https://schema.org", "@graph": nodes };
}

/** Home page: the site plus a ProfilePage whose main entity is the person. */
export function profilePageSchema(locale: Locale) {
    const url = absoluteUrl(routePath("home", locale));
    return graph(website(), {
        "@type": "ProfilePage",
        "@id": `${url}#profilepage`,
        url,
        name: copy[locale].meta.title,
        inLanguage: htmlLang[locale],
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: person(locale),
    });
}

interface PageSchemaOptions {
    route: RouteKey;
    locale: Locale;
    name: string;
    description: string;
}

export function aboutPageSchema({ route, locale, name, description }: PageSchemaOptions) {
    return graph({
        "@type": "AboutPage",
        url: absoluteUrl(routePath(route, locale)),
        name,
        description,
        inLanguage: htmlLang[locale],
        isPartOf: websiteRef,
        about: personRef,
        author: personRef,
    });
}

/**
 * A page about one of the projects. A WebPage, not a SoftwareApplication:
 * Google reads that as a Software App rich result and flags it invalid
 * without offers and ratings, which an unreleased project has neither of.
 */
export function projectPageSchema({ route, locale, name, description, image }: PageSchemaOptions & { image: string }) {
    return graph({
        "@type": "WebPage",
        url: absoluteUrl(routePath(route, locale)),
        name,
        description,
        inLanguage: htmlLang[locale],
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image) },
        isPartOf: websiteRef,
        author: personRef,
    });
}
