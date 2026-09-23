import enJson from "./en.json";
import zhJson from "./zh.json";
import type {
    BackHeaderCopy,
    FooterCopy,
    Locale,
    LocaleBundle,
    StoryCopy,
} from "./types";

export type {
    BackHeaderCopy,
    ExternalNoticeCopy,
    FooterCopy,
    LandingCopy,
    Locale,
    LocaleSwitcherCopy,
    MetaCopy,
    PreviewConsentCopy,
    ProjectCopy,
    StoryCopy,
} from "./types";

const en = enJson satisfies LocaleBundle;
const zh = zhJson satisfies LocaleBundle;

/** BCP 47 tag for `<html lang>`, hreflang attributes, and schema.org inLanguage. */
export const htmlLang: Record<Locale, string> = {
    en: "en",
    zh: "zh-CN",
};

export const ogLocale: Record<Locale, string> = {
    en: "en_US",
    zh: "zh_CN",
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

export const copy: Record<Locale, LocaleBundle> = {
    en,
    zh,
};
