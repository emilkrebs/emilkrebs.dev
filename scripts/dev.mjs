#!/usr/bin/env node
/**
 * Dev runner: Next.js site + Vite playground together.
 *
 * `npm run dev` starts both and proxies /playground from Next to the Vite
 * dev server (see next.config.mjs), so the playground editor hot-reloads.
 * Ctrl-C (or either process exiting) stops both.
 */
import { spawn } from "node:child_process";

const children = [
    spawn("npm", ["run", "dev:site"], { stdio: "inherit" }),
    spawn("npm", ["run", "dev:playground"], { stdio: "inherit" }),
];

let shuttingDown = false;
function shutdown(code) {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const child of children) child.kill("SIGTERM");
    process.exit(code ?? 0);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
for (const child of children) {
    child.on("exit", (code) => shutdown(code ?? 0));
}
