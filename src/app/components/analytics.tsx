/**
 * SimpleAnalytics, the site's one third-party script. Rendered by the pages
 * that carry it, not by the root shell: project record pages
 * (/med-research-mcp/) must render with the network restricted to
 * emilkrebs.dev, so they opt out of analytics entirely.
 */
export function Analytics() {
    return <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js" />;
}
