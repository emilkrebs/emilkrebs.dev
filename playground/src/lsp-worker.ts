import { EmptyFileSystem } from 'langium';
import { URI } from 'vscode-uri';
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  type CompletionParams,
  type DefinitionParams,
  DiagnosticSeverity,
  type HoverParams,
  type TextDocumentChangeEvent,
  TextDocumentSyncKind,
  createConnection,
  ProposedFeatures,
  TextDocuments,
  type CompletionItem,
  type CompletionList,
  type Definition,
  type Hover,
  type InitializeResult,
} from 'vscode-languageserver/browser';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type { LangiumDocument } from 'langium';
import { createBiohackingServices } from './lang/index.js';
import { parseBioWithImports, type BioImportParseResult } from './lang/index.js';
import { SAMPLES } from './samples';

const SAMPLE_BY_FILE = new Map(SAMPLES.map((s) => [s.file, s.content]));

declare const self: DedicatedWorkerGlobalScope;

async function readSampleFile(uri: URI): Promise<string | undefined> {
  return SAMPLE_BY_FILE.get(uri.path.split('/').pop() ?? '');
}

const { Biohacking: biohacking } = createBiohackingServices({
  fileExtensions: ['.bio'],
  ...EmptyFileSystem,
});

const reader = new BrowserMessageReader(self);
const writer = new BrowserMessageWriter(self);
const connection = createConnection(ProposedFeatures.all, reader, writer);
const documents = new TextDocuments(TextDocument);

const parseByUri = new Map<string, BioImportParseResult>();
const langDocsByUri = new Map<string, LangiumDocument>();

async function parseDocument(document: TextDocument): Promise<BioImportParseResult> {
  const result = await parseBioWithImports(
    biohacking,
    document.getText(),
    URI.parse(document.uri),
    readSampleFile,
    { validation: true },
  );

  parseByUri.set(document.uri, result);
  langDocsByUri.clear();
  langDocsByUri.set(result.entryDocument.uri.toString(), result.entryDocument);
  for (const model of result.imported) {
    if (model.$document) {
      langDocsByUri.set(model.$document.uri.toString(), model.$document);
    }
  }

  return result;
}

function unresolvedImportDiagnostics(result: BioImportParseResult) {
  return result.missingImports.map((imp) => ({
    severity: DiagnosticSeverity.Warning,
    range: {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 1 },
    },
    message: `Unresolved import · ${imp} (relative imports resolve against the browser bundle; use @std/...)`,
    source: 'biohacking-ls',
  }));
}

async function validateDocument(document: TextDocument): Promise<void> {
  try {
    const result = await parseDocument(document);
    const baseDiagnostics = result.entryDocument.diagnostics ?? [];
    connection.sendDiagnostics({
      uri: document.uri,
      diagnostics: [...baseDiagnostics, ...unresolvedImportDiagnostics(result)],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    connection.sendDiagnostics({
      uri: document.uri,
      diagnostics: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 1 },
          },
          message: `Analysis failed · ${message}`,
          source: 'biohacking-ls',
        },
      ],
    });
  }
}

async function getLangDoc(uri: string): Promise<LangiumDocument | undefined> {
  const existing = langDocsByUri.get(uri);
  if (existing) return existing;
  const doc = documents.get(uri);
  if (!doc) return undefined;
  const parsed = await parseDocument(doc);
  return parsed.entryDocument;
}

connection.onInitialize((): InitializeResult => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    completionProvider: {
      triggerCharacters: ['.'],
    },
    hoverProvider: true,
    definitionProvider: true,
  },
}));

documents.onDidOpen((event: TextDocumentChangeEvent<TextDocument>) => {
  void validateDocument(event.document);
});

documents.onDidChangeContent((change: TextDocumentChangeEvent<TextDocument>) => {
  void validateDocument(change.document);
});

documents.onDidClose((event: TextDocumentChangeEvent<TextDocument>) => {
  parseByUri.delete(event.document.uri);
  langDocsByUri.delete(event.document.uri);
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

connection.onCompletion(async (params: CompletionParams): Promise<CompletionItem[] | CompletionList> => {
  const doc = await getLangDoc(params.textDocument.uri);
  if (!doc) return [];
  const completion = await biohacking.lsp.CompletionProvider.getCompletion(doc, params);
  return (completion ?? []) as CompletionItem[] | CompletionList;
});

connection.onHover(async (params: HoverParams): Promise<Hover | null> => {
  const doc = await getLangDoc(params.textDocument.uri);
  if (!doc) return null;
  const hover = await biohacking.lsp.HoverProvider.getHoverContent(doc, {
    position: params.position,
  });
  return (hover as Hover | null) ?? null;
});

connection.onDefinition(async (params: DefinitionParams): Promise<Definition | null> => {
  const doc = await getLangDoc(params.textDocument.uri);
  if (!doc) return null;
  const provider = biohacking.lsp.DefinitionProvider;
  if (!provider) return null;
  const definition = await provider.getDefinition(doc, params);
  return (definition as unknown as Definition | null) ?? null;
});

documents.listen(connection);
connection.listen();
