import type { LangiumDocument } from 'langium';
import { EmptyFileSystem } from 'langium';
import { URI } from 'vscode-uri';
import { createBiohackingServices } from './lang/biohacking-module.js';
import { parseBioWithImports, type BioImportParseResult } from './lang/utils/import-loader.js';
import { SAMPLES } from './samples';

const ENTRY_URI = 'file:///protocol.bio';

const SAMPLE_BY_FILE = new Map(SAMPLES.map((s) => [s.file, s.content]));

async function readSampleFile(uri: URI): Promise<string | undefined> {
  return SAMPLE_BY_FILE.get(uri.path.split('/').pop() ?? '');
}

export interface LanguageServer {
  parse(text: string): Promise<BioImportParseResult>;
  completion(doc: LangiumDocument, line: number, character: number): Promise<unknown>;
  hover(doc: LangiumDocument, line: number, character: number): Promise<unknown>;
}

export function createLanguageServer(): LanguageServer {
  const { Biohacking: biohacking } = createBiohackingServices({
    fileExtensions: ['.bio'],
    ...EmptyFileSystem,
  });

  return {
    async parse(text: string): Promise<BioImportParseResult> {
      return parseBioWithImports(biohacking, text, URI.parse(ENTRY_URI), readSampleFile, {
        validation: true,
      });
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
  };
}
