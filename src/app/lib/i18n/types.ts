export type Locale = "en" | "zh";

export interface NavItem {
    href: string;
    label: string;
}

export interface LocaleSwitcherCopy {
    href: string;
    label: string;
    aria: string;
    pref: Locale;
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
    storyHref: string;
}

export interface BackHeaderCopy {
    href: string;
    label: string;
}

export interface StoryCopy {
    contents: string;
    confidentialNotice: string;
}

export interface ProjectCopy {
    id: string;
    name: string;
    description: string;
    status?: string;
    href?: string;
    imageCaption?: string;
    previewCaption?: string;
}

export interface LandingCopy {
    navAria: string;
    nav: NavItem[];
    switcher?: LocaleSwitcherCopy;
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
        websiteName: string;
        websiteDescription: string;
    };
}

export interface LocaleBundle extends LandingCopy {
    footer: FooterCopy;
    backHeader: BackHeaderCopy;
    story: StoryCopy;
}
