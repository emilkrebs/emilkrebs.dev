/**
 * Content access for bundled `.bio` libraries (`@std/*`, `@builtin/*`).
 *
 * Split from ./std-lib.ts on purpose. This module imports the generated source
 * text (~580 KB); std-lib.ts imports only the ~1 KB specifier list. Anything
 * that merely needs to recognise or name a bundled document — completion,
 * scoping, URI mapping — should import std-lib.ts so the bulk stays
 * tree-shakeable out of bundles that never parse a .bio file.
 *
 * No filesystem access: the sources are embedded at build time by
 * scripts/generate-bundled-sources.mjs, so this behaves identically in the
 * Theia backend, the CLI, vitest and the browser.
 */
import { URI } from 'vscode-uri';
import { STD_SOURCES, BUILTIN_SOURCES } from '../bundled/bundled-sources.js';
import { bundledUriToSpecifier, isBundledUri } from './std-lib.js';

const ALL_SOURCES: Readonly<Record<string, string>> = {
    ...STD_SOURCES,
    ...BUILTIN_SOURCES,
};

/**
 * Source text for a bundled import specifier (e.g. `@std/sarms`), or undefined
 * when no such library file ships with this build.
 */
export function getBundledSourceBySpecifier(specifier: string): string | undefined {
    return ALL_SOURCES[specifier];
}

/**
 * Source text for a bundled document URI, or undefined when the URI is not a
 * bundled reference or names a library file that does not exist.
 */
export function getBundledSource(uri: URI): string | undefined {
    if (!isBundledUri(uri)) {
        return undefined;
    }
    const specifier = bundledUriToSpecifier(uri);
    return specifier === undefined ? undefined : ALL_SOURCES[specifier];
}

/** Every bundled document as `[uri-string, source]`, for workspace registration. */
export function allBundledSources(): ReadonlyArray<readonly [string, string]> {
    return Object.entries(ALL_SOURCES);
}
