export const SITE_URL = "https://emilkrebs.dev";
export const SITE_NAME = "Emil Krebs";
// The name used in China.
export const CHINESE_NAME = "爱米尔";

export const EMAIL_ADDRESS = "hello@emilkrebs.dev";
export const PHONE_NUMBER = "+49 157 74601 701";

export const LINKEDIN_URL = "https://linkedin.com/in/emilkrebs";
export const GITHUB_URL = "https://github.com/emilkrebs";

// Where the med-research-mcp pages link out, in both locales. Set `demo` to a
// running instance's URL and both pages link it; left undefined, they show no
// demo link and say there is no public hosted instance.
export const MED_RESEARCH_MCP_LINKS: { source: string; npm: string; demo?: string } = {
    source: "https://github.com/emilkrebs/med-research-mcp",
    npm: "https://www.npmjs.com/package/med-research-mcp",
    demo: undefined,
};

// Chinese site only: WeChat has no profile URL, so the QR card is shown instead.
export const WECHAT_ID = "emilkrebs";
export const WECHAT_QR_PATH = "/pictures/wechat.webp";

export const RESUME_PATH = "/resume.pdf";
