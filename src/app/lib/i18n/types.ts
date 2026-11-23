export type Locale = "en" | "zh";

export interface LocaleSwitcherCopy {
    label: string;
    aria: string;
}

export interface PreviewConsentCopy {
    notice: string;
    load: string;
}

export interface ExternalNoticeCopy {
    open: string;
    closeNoticeAria: string;
    heading: string;
    close: string;
    prototype: string[];
    testing: string[];
    risk: string[];
    accept: string;
    back: string;
}

export interface WeChatCopy {
    label: string;
    heading: string;
    idLabel: string;
    qrAlt: string;
    close: string;
    closeAria: string;
}

export interface FooterCopy {
    location: string;
    copyright: string;
    resume: string;
    links: { story: string; healthstack: string; medResearch: string; imprint: string; privacy: string };
}

export interface BackHeaderCopy {
    label: string;
}

export interface StoryCopy {
    contents: string;
    confidentialNotice: string;
    events: string;
    waterkant: { place: string; role: string };
}

export interface ProjectPageCopy {
    /** The head's install block-link: jumps to the README's install section. */
    installGuide: string;
    /** Accessible name of the head's contents jump row. */
    contentsAria: string;
    demoAlt: string;
    /** One line under the demo plate: what the ten seconds show. */
    demoNote: string;
    skillsHeading: string;
    skillsLead: string;
    skillRead: string;
    skillClose: string;
    /** Label for the plain-markdown download. */
    skillDownload: string;
    skills: { id: string; description: string }[];
}

export interface MetaCopy {
    title: string;
    description: string;
    keywords: string[];
}

export interface ProjectCopy {
    id: string;
    name: string;
    description: string;
    status?: string;
    caption?: string;
    /** Names the link's destination; falls back to the generic "Open". */
    linkLabel?: string;
    /** Overrides the href; used for special routing cases. */
    linkOverride?: string;
    /** A second arrow link on the card, e.g. Healthstack's live playground. */
    extraLinkLabel?: string;
}


export interface LandingCopy {
    navAria: string;
    nav: { story: string; work: string; projects: string; contact: string };
    switcher: LocaleSwitcherCopy;
    /** [before, accent, after]: the title and the claim; the middle part is set in the serif accent. */
    heroTagline: string[];
    ctas: { github: string; linkedin: string; email: string };
    /** Chinese locale only. */
    wechat?: WeChatCopy;
    portraitAlt: string;
    thinking: string;
    strengthsHeading: string;
    strengths: { title: string; proof: string }[];
    workHeading: string;
    workBlurb: string;
    projectsHeading: string;
    /** Closes the project list: the homepage's one way into /story besides the nav. */
    storyLink: string;
    open: string;
    privateLabel: string;
    previewTitleSuffix: string;
    screenshotAltSuffix: string;
    flagships: ProjectCopy[];
    projects: ProjectCopy[];
    consent: PreviewConsentCopy;
    externalNotice: ExternalNoticeCopy;
    contact: { heading: string; lead: string };
    jsonLd: {
        personDescription: string;
    };
}

export interface LocaleBundle extends LandingCopy {
    meta: MetaCopy;
    skipLink: string;
    footer: FooterCopy;
    backHeader: BackHeaderCopy;
    story: StoryCopy;
    projectPage: ProjectPageCopy;
}
