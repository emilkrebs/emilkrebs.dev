/**
 * Bundled `.bio` library resolution — `@std/<name>` and `@builtin/<name>`.
 *
 * Lets a .bio file import a shipped library by name instead of a relative path,
 * e.g. `import "@std/sarms"` rather than `import "../../../std/sarms.bio"`.
 *
 * HOW THIS WORKS NOW
 * The library files are embedded into the package at build time by
 * scripts/generate-bundled-sources.mjs, so there is no directory to locate at
 * runtime. This module deals only in specifiers and URIs and never touches the
 * filesystem, which makes it identical in the Theia backend, the CLI, vitest
 * and the browser. It is safe to pull into the frontend bundle: it imports the
 * ~1 KB specifier list, never the ~580 KB source text. Content lookup lives in
 * ./bundled-content.ts, which the document-loading path imports separately so
 * webpack can tree-shake the bulk out of builds that never parse .bio.
 *
 * This replaces an earlier approach that walked up from `import.meta.url`,
 * probed four candidate directories, and reached for `eval('require')` /
 * `process.getBuiltinModule` to touch `fs` without breaking the browser build.
 * That guesswork silently broke whenever the package was repackaged. If you are
 * tempted to reintroduce a filesystem lookup here, add a bundle to
 * scripts/generate-bundled-sources.mjs instead.
 *
 * STD IS NOT BUILTIN. The two bundles are shipped by the same mechanism but
 * play different roles, and they get different URI schemes to keep that
 * visible:
 *   std/     — a catalog. Import it to use it, shadow it with your own
 *              declaration if you disagree with it. Ordinary documents.
 *   builtin/ — the type library. Never imported, always in scope, loaded into
 *              every workspace by BiohackingWorkspaceManager. `builtin:` is the
 *              scheme Langium's builtin-library recipe uses.
 *
 * URI MAPPING — bidirectional and total:
 *   `@std/peptides/healing`  <->  `bundled:/std/peptides/healing.bio`
 *   `@builtin/core`          <->  `builtin:/core.bio`
 * (An empty authority is dropped when serialising, so `builtin:///core.bio`
 * parses to that same URI — both spellings name one document.)
 */
import { URI } from 'vscode-uri';
import { STD_SPECIFIERS, BUILTIN_SPECIFIERS } from '../bundled/bundled-specifiers.js';

/** Prefix marking an import as a bundled standard-library reference. */
export const STD_IMPORT_PREFIX = '@std/';

/** Prefix marking an import as a bundled builtin-type-library reference. */
export const BUILTIN_IMPORT_PREFIX = '@builtin/';

/**
 * URI scheme for bundled documents. Deliberately NOT `file:` — these documents
 * have no on-disk location, and giving them one invites callers to try reading
 * them from a path that does not exist.
 */
export const BUNDLED_SCHEME = 'bundled';

/**
 * URI scheme for the builtin type library, per Langium's builtin-library
 * recipe. Separate from {@link BUNDLED_SCHEME} so "is this document part of the
 * language itself?" is a scheme check rather than a path-prefix check, and so
 * an editor can register a read-only content provider for exactly these.
 */
export const BUILTIN_SCHEME = 'builtin';

const BUNDLE_PREFIXES = [STD_IMPORT_PREFIX, BUILTIN_IMPORT_PREFIX] as const;

/** True if the import path names a bundled std module, e.g. `@std/sarms`. */
export function isStdImportPath(importPath: string): boolean {
    return importPath.startsWith(STD_IMPORT_PREFIX);
}

/** True if the import path names a bundled builtin module, e.g. `@builtin/core`. */
export function isBuiltinImportPath(importPath: string): boolean {
    return importPath.startsWith(BUILTIN_IMPORT_PREFIX);
}

/** True if the import path names any bundled module. */
export function isBundledImportPath(importPath: string): boolean {
    return BUNDLE_PREFIXES.some(prefix => importPath.startsWith(prefix));
}

/** True if the URI addresses a document of the builtin type library. */
export function isBuiltinUri(uri: URI): boolean {
    return uri.scheme === BUILTIN_SCHEME;
}

/** True if the URI addresses any document embedded in this package (std or builtin). */
export function isBundledUri(uri: URI): boolean {
    return uri.scheme === BUNDLED_SCHEME || uri.scheme === BUILTIN_SCHEME;
}

/**
 * Normalises a specifier to its canonical form: `@std/sarms.bio` and
 * `@std/sarms` both denote the same document.
 */
function stripBioExtension(specifier: string): string {
    return specifier.endsWith('.bio') ? specifier.slice(0, -'.bio'.length) : specifier;
}

/**
 * Resolves a bundled import path to its document URI, or undefined when the
 * path is not a bundled reference (a relative import, say).
 *
 * Note this does NOT check that the document exists — callers resolve content
 * via bundled-content.ts and report a missing import if it comes back empty.
 * Keeping resolution total means scoping and loading agree on the URI for a
 * specifier even when the specifier is misspelled.
 */
export function resolveStdImportUri(importPath: string): URI | undefined {
    const prefix = BUNDLE_PREFIXES.find(candidate => importPath.startsWith(candidate));
    if (!prefix) {
        return undefined;
    }
    const name = stripBioExtension(importPath.slice(prefix.length));
    if (!name) {
        return undefined;
    }
    if (prefix === BUILTIN_IMPORT_PREFIX) {
        return URI.from({ scheme: BUILTIN_SCHEME, path: `/${name}.bio` });
    }
    // '@std/' -> 'std'
    const bundle = prefix.slice(1, -1);
    return URI.from({ scheme: BUNDLED_SCHEME, path: `/${bundle}/${name}.bio` });
}

/** URIs of every document in the builtin type library. */
export function listBuiltinUris(): URI[] {
    return listBuiltinSpecifiers()
        .map(resolveStdImportUri)
        .filter((uri): uri is URI => uri !== undefined);
}

/**
 * Inverse of {@link resolveStdImportUri}: maps a bundled document URI back to
 * the import specifier that names it, or undefined for any other URI.
 */
export function bundledUriToSpecifier(uri: URI): string | undefined {
    if (isBuiltinUri(uri)) {
        // '/core.bio' -> '@builtin/core'
        const name = stripBioExtension(uri.path.replace(/^\//, ''));
        return name ? `${BUILTIN_IMPORT_PREFIX}${name}` : undefined;
    }
    if (!isBundledUri(uri)) {
        return undefined;
    }
    // '/std/peptides/healing.bio' -> ['std', 'peptides/healing.bio']
    const withoutLeadingSlash = uri.path.replace(/^\//, '');
    const separator = withoutLeadingSlash.indexOf('/');
    if (separator <= 0) {
        return undefined;
    }
    const bundle = withoutLeadingSlash.slice(0, separator);
    const rest = stripBioExtension(withoutLeadingSlash.slice(separator + 1));
    if (!rest) {
        return undefined;
    }
    const specifier = `@${bundle}/${rest}`;
    return isBundledImportPath(specifier) ? specifier : undefined;
}

/**
 * Import specifiers for bundled std `.bio` files, e.g. `@std/sarms`,
 * `@std/prescription/rx`. Drives import-path completion.
 */
export function listStdImportSpecifiers(): string[] {
    return [...STD_SPECIFIERS];
}

/** Import specifiers for bundled builtin `.bio` files, e.g. `@builtin/core`. */
export function listBuiltinSpecifiers(): string[] {
    return [...BUILTIN_SPECIFIERS];
}

/**
 * Every bundled specifier. Used by the workspace initialiser to register the
 * builtin library, and by completion to offer std imports.
 */
export function listBundledSpecifiers(): string[] {
    return [...STD_SPECIFIERS, ...BUILTIN_SPECIFIERS];
}
