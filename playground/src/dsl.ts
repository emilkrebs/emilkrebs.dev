import type { LangiumDocument } from 'langium';
import { EmptyFileSystem, isMultiReference } from 'langium';
import { URI } from 'vscode-uri';
import type { LocationLink, Range } from 'vscode-languageserver';
import { createBiohackingServices } from './lang/index.js';
import { parseBioWithImports, type BioImportParseResult } from './lang/index.js';
import { SAMPLES } from './samples';

const ENTRY_URI = 'file:///protocol.bio';

const SAMPLE_BY_FILE = new Map(SAMPLES.map((s) => [s.file, s.content]));

async function readSampleFile(uri: URI): Promise<string | undefined> {
  return SAMPLE_BY_FILE.get(uri.path.split('/').pop() ?? '');
}

/** A resolvable cross-reference in a document, for link decoration and ctrl+click. */
export interface LinkInfo {
  /** Range of the reference token (LSP, zero-based). */
  sourceRange: Range;
  /** Whether the definition lives in a different document (e.g. the builtin library). */
  crossFile: boolean;
}

export interface LanguageServer {
  parse(text: string): Promise<BioImportParseResult>;
  completion(doc: LangiumDocument, line: number, character: number): Promise<unknown>;
  hover(doc: LangiumDocument, line: number, character: number): Promise<unknown>;
  definition(doc: LangiumDocument, line: number, character: number): Promise<LocationLink[] | undefined>;
  links(doc: LangiumDocument): Promise<LinkInfo[]>;
  document(uri: string): LangiumDocument | undefined;
  source(uri: string): string | undefined;
}

export function createLanguageServer(): LanguageServer {
  const { Biohacking: biohacking } = createBiohackingServices({
    fileExtensions: ['.bio'],
    ...EmptyFileSystem,
  });

  const documents = new Map<string, LangiumDocument>();

  return {
    async parse(text: string): Promise<BioImportParseResult> {
      const result = await parseBioWithImports(biohacking, text, URI.parse(ENTRY_URI), readSampleFile, {
        validation: true,
      });
      documents.clear();
      documents.set(result.entryDocument.uri.toString(), result.entryDocument);
      for (const model of result.imported) {
        if (model.$document) {
          documents.set(model.$document.uri.toString(), model.$document);
        }
      }
      return result;
    },

    async completion(doc: LangiumDocument, line: number, character: number) {
      return biohacking.lsp.CompletionProvider.getCompletion(
        doc,
        {
          textDocument: { uri: doc.uri.toString() },
          position: { line, character },
        },
      );
    },

    async hover(doc: LangiumDocument, line: number, character: number) {
      return biohacking.lsp.HoverProvider.getHoverContent(doc, {
        position: { line, character },
      });
    },

    async definition(doc: LangiumDocument, line: number, character: number) {
      const provider = biohacking.lsp.DefinitionProvider;
      if (!provider) return undefined;
      return provider.getDefinition(doc, {
        textDocument: { uri: doc.uri.toString() },
        position: { line, character },
      });
    },

    async links(doc: LangiumDocument): Promise<LinkInfo[]> {
      const result: LinkInfo[] = [];
      for (const ref of doc.references) {
        if (isMultiReference(ref)) {
          if (ref.items.length === 0 || !ref.$refNode) continue;
          result.push({
            sourceRange: ref.$refNode.range,
            crossFile: ref.items.some((item) => item.ref.$document !== doc),
          });
          continue;
        }
        if (!ref.ref || !ref.$refNode) continue;
        result.push({
          sourceRange: ref.$refNode.range,
          crossFile: ref.ref.$document !== doc,
        });
      }
      return result;
    },

    document(uri: string) {
      return documents.get(URI.parse(uri).toString());
    },

    source(uri: string) {
      return documents.get(URI.parse(uri).toString())?.textDocument.getText();
    },
  };
}
