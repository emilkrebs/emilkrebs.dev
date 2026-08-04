/**
 * Type declarations for the prebuilt language bundle
 * (vendor/biohacking-language.min.mjs).
 *
 * The implementation itself is built from the private biohacking-ide repo —
 * see scripts/build-lang-bundle.mjs. These are the minimal types the
 * playground needs; keep them in sync with the bundle's public API.
 */
import type { AstNode, LangiumDocument, URI } from 'langium';
import type { DefaultSharedModuleContext } from 'langium/lsp';
import type { LocationLink } from 'vscode-languageserver';

export interface BioImportParseResult {
  /** The parsed entry model. */
  entry: AstNode;
  /** Models of all transitively imported documents, in load order. */
  imported: AstNode[];
  /** The entry document (for diagnostics after a validating build). */
  entryDocument: LangiumDocument;
  /** Import paths (as written in source) that could not be read. */
  missingImports: string[];
}

export type BioFileReader = (uri: URI) => Promise<string | undefined>;

export interface BiohackingLspProviders {
  CompletionProvider: { getCompletion(doc: LangiumDocument, params: unknown): unknown };
  HoverProvider: { getHoverContent(doc: LangiumDocument, params: unknown): unknown };
  DefinitionProvider?: {
    getDefinition(doc: LangiumDocument, params: unknown): Promise<LocationLink[] | undefined>;
  };
}

export interface BiohackingServicesLike {
  lsp: BiohackingLspProviders;
}

export declare function createBiohackingServices(
  context: DefaultSharedModuleContext & { fileExtensions?: string[] },
): { Biohacking: BiohackingServicesLike };

export declare function parseBioWithImports(
  services: BiohackingServicesLike,
  content: string,
  uri: string | URI,
  readFile?: BioFileReader,
  options?: { validation?: boolean },
): Promise<BioImportParseResult>;

/** The TextMate grammar JSON, embedded (minified) at bundle time. */
export declare const grammarSource: string;
