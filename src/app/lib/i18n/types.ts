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

export interface FooterCopy {
    location: string;
    copyright: string;
    resume: string;
}

export interface BackHeaderCopy {
    label: string;
}

export interface StoryCopy {
    contents: string;
    confidentialNotice: string;
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
}

export interface LandingCopy {
    navAria: string;
    nav: { story: string; work: string; projects: string };
    switcher: LocaleSwitcherCopy;
    heroTagline: string;
    ctas: { github: string; linkedin: string; email: string };
    portraitAlt: string;
    thinking: string;
    fieldHeading: string;
    fieldLead: string[];
    strengthsHeading: string;
    strengths: { title: string; proof: string }[];
    workHeading: string;
    workBlurb: string;
    projectsHeading: string;
    open: string;
    privateLabel: string;
    previewTitleSuffix: string;
    screenshotAltSuffix: string;
    flagships: ProjectCopy[];
    projects: ProjectCopy[];
    consent: PreviewConsentCopy;
    externalNotice: ExternalNoticeCopy;
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
}
