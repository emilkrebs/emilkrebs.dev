export type Locale = "en" | "zh";

export interface PreviewConsentCopy {
    notice: string;
    load: string;
}

export const previewConsentCopy: Record<Locale, PreviewConsentCopy> = {
    en: {
        notice: "The preview loads a third-party site with its own scripts.",
        load: "Load preview",
    },
    zh: {
        notice: "预览将加载包含自身脚本的第三方网站。",
        load: "加载预览",
    },
};

export interface ExternalNoticeCopy {
    open: string;
    closeNoticeAria: string;
    heading: string;
    close: string;
    prototype: [string, string];
    testing: [string, string];
    risk: [string, string];
    accept: string;
    back: string;
}

export const externalNoticeCopy: Record<Locale, ExternalNoticeCopy> = {
    en: {
        open: "Open",
        closeNoticeAria: "Close notice",
        heading: "Testing notice",
        close: "Close",
        prototype: ["", " is a prototype"],
        testing: [
            "",
            " is in active testing, not a finished product. Features break, data can be lost, and the app will change without notice.",
        ],
        risk: [
            "By proceeding you acknowledge that you are using ",
            " at your own risk. It is provided without warranty of any kind, and the author accepts no liability for anything that happens while you use it.",
        ],
        accept: "Accept and continue",
        back: "Back",
    },
    zh: {
        open: "打开",
        closeNoticeAria: "关闭提示",
        heading: "测试提示",
        close: "关闭",
        prototype: ["", " 尚属原型"],
        testing: [
            "",
            " 仍处于测试阶段，并非成品。功能可能出错，数据可能丢失，应用随时可能变更。",
        ],
        risk: [
            "继续即表示你知悉：使用 ",
            " 的风险由你自行承担。本产品按现状提供，不含任何形式的担保，作者对使用期间发生的任何问题概不负责。",
        ],
        accept: "接受并继续",
        back: "返回",
    },
};

export interface FooterCopy {
    location: string;
    copyright: string;
}

export const footerCopy: Record<Locale, FooterCopy> = {
    en: {
        location: "Emil Krebs - Kiel, Germany",
        copyright: "Emil Krebs. All rights reserved.",
    },
    zh: {
        location: "Emil Krebs - 基尔，德国",
        copyright: "Emil Krebs。保留所有权利。",
    },
};

export interface NavItem {
    href: string;
    label: string;
}

export interface LocaleSwitcherCopy {
    href: string;
    label: string;
    aria: string;
    pref: "en" | "zh";
}

export interface ProjectCopy {
    id: string;
    name: string;
    description: string;
    status?: string;
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
    fieldLead: [string, string];
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

export const copy: Record<Locale, LandingCopy> = {
    en: {
        navAria: "Primary",
        nav: [
            { href: "/story", label: "Story" },
            { href: "#work", label: "Work" },
            { href: "#projects", label: "Projects" },
        ],
        heroTagline: "Software engineer at TypeFox. Kiel, Germany.",
        ctas: { github: "GitHub", linkedin: "LinkedIn", email: "Email" },
        portraitAlt: "Emil Krebs, Software engineer",
        thinking: "Thinking...",
        fieldHeading: "Field",
        fieldLead: [
            "I build the tools that read, understand, and transform code. At",
            " that means custom domain-specific tools like IDEs. In my free time it means products: a spaced-repetition app, a lifestyle IDE powered by its own language & native AI, and a note tool built for privacy. I contribute to various open source projects.",
        ],
        strengthsHeading: "What I do",
        strengths: [
            {
                title: "Developer tooling",
                proof:
                    "Language servers, the LSP, Langium DSLs, Theia-based IDEs, and generators — the domain-specific tools that let editors understand code.",
            },
            {
                title: "Security & privacy",
                proof:
                    "Zero-knowledge encryption in VailNote, WearOS locking in WatchLock, no telemetry by default.",
            },
            {
                title: "Open source",
                proof:
                    "The Langium showcase, Theia, the Fresh ecosystem, and the BIPoC Climate Justice conference site.",
            },
        ],
        workHeading: "Work",
        workBlurb:
            "Software Engineer: language servers, the LSP, and the tooling that lets editors understand code. This is the craft the rest of this page proves.",
        projectsHeading: "Projects",
        open: "Open",
        privateLabel: "Private",
        previewTitleSuffix: " preview",
        screenshotAltSuffix: " screenshot",
        flagships: [
            {
                id: "prami",
                name: "Prami",
                description:
                    "Active recall and spaced repetition, engineered so the review schedule fades into the background.",
                status: "Preview",
                imageCaption: "In testing - Prami",
            },
            {
                id: "healthstack",
                name: "Healthstack",
                description:
                    "A specialized IDE for lifestyle optimization on Eclipse Theia: biomarker tracking, unit conversion, and a purpose-built DSL for intervention protocols.",
                status: "Concept",
                imageCaption: "Concept Page",
            },
        ],
        projects: [
            {
                id: "vailnote",
                name: "VailNote",
                description:
                    "Encrypted note sharing with zero-knowledge encryption and self-destructing notes.",
                imageCaption: "Live - vailnote.com",
            },
            {
                id: "watchlock",
                name: "WatchLock",
                description:
                    "Lock your phone with your smartwatch. WearOS and Android, built for personal security.",
                imageCaption: "Live - github.com/emilkrebs/WatchLock",
            },
            {
                id: "bipoc",
                name: "BIPoC Climate Justice Conference",
                description:
                    "The official site for the BIPoC Climate Justice Conference 2024 and 2025, localized and fully markdown-driven.",
                imageCaption: "Live - bipoclimatejusticenetwork.org",
            },
            {
                id: "langium-showcase",
                name: "Langium Showcase",
                description:
                    "DSL showcases built with Langium: state machines, arithmetic, MiniLogo, and domain models.",
                previewCaption: "Live - langium.org/showcase/minilogo",
            },
            {
                id: "this-site",
                name: "This site",
                description:
                    "Static export. No server, no database. Typeset per the spec you are reading.",
                imageCaption: "Live - emilkrebs.dev",
            },
        ],
        consent: previewConsentCopy.en,
        externalNotice: externalNoticeCopy.en,
        jsonLd: {
            personDescription:
                "Software engineer at TypeFox GmbH from Kiel, Germany, building language servers, DSLs, and products like Prami and Healthstack. Everything ships open source.",
            websiteName: "Emil Krebs - Software engineer in Kiel",
            websiteDescription:
                "Personal website of Emil Krebs, a Software engineer at TypeFox GmbH from Kiel, Germany, building language servers, DSLs, and products like Prami and Healthstack.",
        },
    },
    zh: {
        navAria: "主导航",
        nav: [
            { href: "/story", label: "故事" },
            { href: "#work", label: "工作" },
            { href: "#projects", label: "项目" },
        ],
        switcher: { href: "/", label: "EN", aria: "Switch to English", pref: "en" },
        heroTagline: "TypeFox 软件工程师。德国基尔。",
        ctas: { github: "GitHub", linkedin: "LinkedIn", email: "邮件" },
        portraitAlt: "Emil Krebs，软件工程师",
        thinking: "思考中...",
        fieldHeading: "领域",
        fieldLead: [
            "我构建能读取、理解并转换代码的工具。在",
            "，这意味着 IDE 之类的定制领域特定工具。业余时间则是产品：一款间隔重复应用、一个由自有语言和原生 AI 驱动的生活方式 IDE，以及一款为隐私而生的笔记工具。我参与多个开源项目。",
        ],
        strengthsHeading: "我的专长",
        strengths: [
            {
                title: "开发者工具",
                proof:
                    "语言服务器、LSP、Langium DSL、基于 Theia 的 IDE 与代码生成器——让编辑器理解代码的领域特定工具。",
            },
            {
                title: "安全与隐私",
                proof:
                    "VailNote 的零知识加密、WatchLock 的 WearOS 锁定，默认无遥测。",
            },
            {
                title: "开源",
                proof:
                    "Langium Showcase、Theia、Fresh 生态系统，以及 BIPoC Climate Justice 会议网站。",
            },
        ],
        workHeading: "工作",
        workBlurb:
            "软件工程师：语言服务器、LSP，以及让编辑器理解代码的工具。这份手艺，由本页其余部分来证明。",
        projectsHeading: "项目",
        open: "打开",
        privateLabel: "私有",
        previewTitleSuffix: " 预览",
        screenshotAltSuffix: " 截图",
        flagships: [
            {
                id: "prami",
                name: "Prami",
                description:
                    "主动回忆与间隔重复，复习日程经精心设计，近乎无感。",
                status: "预览",
                imageCaption: "测试中 - Prami",
            },
            {
                id: "healthstack",
                name: "Healthstack",
                description:
                    "基于 Eclipse Theia 的生活方式优化专用 IDE：生物标记追踪、单位转换，以及为干预协议量身打造的 DSL。",
                status: "概念",
                imageCaption: "概念页",
            },
        ],
        projects: [
            {
                id: "vailnote",
                name: "VailNote",
                description: "加密笔记分享，采用零知识加密与自毁笔记。",
                imageCaption: "在线 - vailnote.com",
            },
            {
                id: "watchlock",
                name: "WatchLock",
                description:
                    "用智能手表锁定手机。支持 WearOS 与 Android，为个人安全而造。",
                imageCaption: "在线 - github.com/emilkrebs/WatchLock",
            },
            {
                id: "bipoc",
                name: "BIPoC Climate Justice Conference",
                description:
                    "BIPoC Climate Justice Conference 2024 与 2025 的官方网站，支持本地化，完全由 Markdown 驱动。",
                imageCaption: "在线 - bipoclimatejusticenetwork.org",
            },
            {
                id: "langium-showcase",
                name: "Langium Showcase",
                description:
                    "用 Langium 构建的 DSL 示例集：状态机、算术运算、MiniLogo 与领域模型。",
                previewCaption: "在线 - langium.org/showcase/minilogo",
            },
            {
                id: "this-site",
                name: "本站",
                description:
                    "静态导出。无服务器，无数据库。按你正在阅读的这份规范排版。",
                imageCaption: "在线 - emilkrebs.dev",
            },
        ],
        consent: previewConsentCopy.zh,
        externalNotice: externalNoticeCopy.zh,
        jsonLd: {
            personDescription:
                "德国基尔 TypeFox GmbH 的软件工程师，构建语言服务器、DSL 以及 Prami、Healthstack 等产品。一切以开源发布。",
            websiteName: "Emil Krebs - 基尔的软件工程师",
            websiteDescription:
                "Emil Krebs 的个人网站。德国基尔 TypeFox GmbH 的软件工程师，构建语言服务器、DSL 以及 Prami、Healthstack 等产品。",
        },
    },
};
