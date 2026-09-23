import enJson from "./en.json";
import zhJson from "./zh.json";
import type {
    BackHeaderCopy,
    ExternalNoticeCopy,
    FooterCopy,
    LandingCopy,
    Locale,
    LocaleBundle,
    PreviewConsentCopy,
    StoryCopy,
} from "./types";

export type {
    BackHeaderCopy,
    ExternalNoticeCopy,
    FooterCopy,
    LandingCopy,
    Locale,
    LocaleSwitcherCopy,
    NavItem,
    PreviewConsentCopy,
    ProjectCopy,
    StoryCopy,
} from "./types";

const en = enJson satisfies LocaleBundle;

// JSON imports widen "pref" to string; re-narrow the one literal we own.
const zh = {
    ...zhJson,
    switcher: { ...zhJson.switcher, pref: zhJson.switcher.pref as Locale },
} satisfies LocaleBundle;

export const previewConsentCopy: Record<Locale, PreviewConsentCopy> = {
    en: en.consent,
    zh: zh.consent,
};

export const externalNoticeCopy: Record<Locale, ExternalNoticeCopy> = {
    en: en.externalNotice,
    zh: zh.externalNotice,
};

export const footerCopy: Record<Locale, FooterCopy> = {
    en: en.footer,
    zh: zh.footer,
};

export const backHeaderCopy: Record<Locale, BackHeaderCopy> = {
    en: en.backHeader,
    zh: zh.backHeader,
};

export const storyCopy: Record<Locale, StoryCopy> = {
    en: en.story,
    zh: zh.story,
};

export const copy: Record<Locale, LandingCopy> = {
    en,
    zh,
};
