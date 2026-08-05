import '@fontsource/schibsted-grotesk/400.css';
import '@fontsource/schibsted-grotesk/500.css';
import '@fontsource/schibsted-grotesk/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/instrument-serif/400-italic.css';
import './style.css';

import * as monaco from 'monaco-editor';
import EditorWorker from './editor-worker.js?worker';
import type { Diagnostic } from 'vscode-languageserver';
import type { LangiumDocument } from 'langium';






import { createLanguageServer, type LanguageServer } from './dsl';
import { registerBiohackingTokens } from './tokenizer';
import { SAMPLES, type Sample } from './samples';

self.MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
};

const LANGUAGE_ID = 'biohacking';
const EDITOR_URI = monaco.Uri.parse('file:///protocol.bio');

monaco.editor.defineTheme('specsheet', {
  base: 'vs',
  inherit: false,
  rules: [
    { token: '', foreground: '141310', background: 'F7F5F0' },
    { token: 'comment', foreground: '5F5B55', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'E8450C' },
    { token: 'constant', foreground: 'E8450C' },
    { token: 'number', foreground: '141310' },
    { token: 'unit', foreground: '141310', fontStyle: 'bold' },
    { token: 'string', foreground: '55524C' },
    { token: 'type', foreground: '141310', fontStyle: 'bold' },
    { token: 'property', foreground: '141310' },
    { token: 'delimiter', foreground: '55524C' },
  ],
  colors: {
    'editor.background': '#F7F5F0',
    'editor.foreground': '#141310',
    'editorLineNumber.foreground': '#5F5B55',
    'editorLineNumber.activeForeground': '#141310',
    'editorCursor.foreground': '#E8450C',
    'editor.selectionBackground': '#E4DED2',
    'editor.lineHighlightBackground': '#F2EFE7',
    'editorGutter.background': '#F7F5F0',
    'editorIndentGuide.background1': '#E4E0D6',
    'editorIndentGuide.activeBackground1': '#C9C4B8',
    'editorWidget.background': '#F7F5F0',
    'editorWidget.border': '#B5B0A7',
    'editorSuggestWidget.background': '#F7F5F0',
    'editorSuggestWidget.selectedBackground': '#ECE8DF',
    'editorHoverWidget.background': '#F7F5F0',
    'editorHoverWidget.border': '#B5B0A7',
  },
});

function el(html: string): HTMLElement {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild as HTMLElement;
}

function resolveInitialSample(): { sample: Sample; index: number } {
  const requested = new URLSearchParams(window.location.search).get('sample');
  if (requested) {
    const index = SAMPLES.findIndex(
      (s) => s.file === requested || s.file.replace(/\.bio$/, '') === requested,
    );
    if (index >= 0) {
      return { sample: SAMPLES[index], index };
    }
  }
  return { sample: SAMPLES[0], index: 0 };
}

function buildShell(activeIndex: number, fileName: string): void {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="topbar mono">
      <a href="/">Emil Krebs · home</a>
      <span>Healthstack · .bio protocol language</span>
    </div>
    <header class="masthead">
      <h1>The .bio language, <span class="accent">live</span>.</h1>
      <p>
        This page runs the real Healthstack language server in your browser.
        Parsing, validation, completions and hover documentation all execute
        locally. Your data never leaves your machine. A curated, supplements-only
        reference library ships with the page; the full clinical catalog does not.
        <a href="/healthstack/">What is Healthstack?</a>
      </p>
    </header>
    <nav class="samples mono" aria-label="Sample protocols">
      ${SAMPLES.map((s, i) => `<button type="button" data-sample="${i}"${i === activeIndex ? ' class="active"' : ''}>${s.label}</button>`).join('')}
    </nav>
    <section class="plate">
      <div class="caption mono">
        <span><span class="token"></span><span id="editor-caption">Editor · ${fileName}</span></span>
      </div>
      <div id="editor-host"></div>
    </section>
    <section class="plate">
      <div class="caption mono">
        <span><span class="token"></span>Diagnostics · real validator output</span>
        <span id="diag-counts"></span>
      </div>
      <div class="diag-summary mono" id="diag-summary"></div>
      <div id="diag-list"></div>
    </section>
    <p class="statusline mono">
      <span class="dot"></span><span id="status">Language server starting…</span>
    </p>
    <footer class="mono">Emil Krebs · 2026 · protocols as code, biology as data</footer>
  `;
}

const SEVERITY_LABEL: Record<number, string> = {
  1: 'error',
  2: 'warning',
  3: 'info',
  4: 'hint',
};

function severityClass(severity: number): string {
  if (severity <= 1) return 'error';
  if (severity === 2) return 'warning';
  return 'info';
}

function renderDiagnostics(diags: Diagnostic[], missingImports: string[]): void {
  const counts = document.getElementById('diag-counts')!;
  const summary = document.getElementById('diag-summary')!;
  const list = document.getElementById('diag-list')!;

  const errors = diags.filter((d) => d.severity === 1).length;
  const warnings = diags.filter((d) => d.severity === 2).length;
  const rest = diags.length - errors - warnings;
  counts.textContent = `${errors} errors · ${warnings} warnings · ${rest} notes`;

  const summaryParts: string[] = [];
  if (errors > 0) summaryParts.push(`<span class="count error">${errors} error${errors === 1 ? '' : 's'}</span>`);
  if (warnings > 0) summaryParts.push(`<span class="count">${warnings} warning${warnings === 1 ? '' : 's'}</span>`);
  summary.innerHTML = summaryParts.join(' ');

  const rows: string[] = [];
  for (const d of diags) {
    rows.push(`
      <div class="diag-row">
        <span class="sev ${severityClass(d.severity ?? 3)}"></span>
        <span class="where mono">${d.range.start.line + 1}:${d.range.start.character + 1}</span>
        <span class="msg">${escapeHtml(String(d.message))}</span>
      </div>
    `);
  }
  for (const imp of missingImports) {
    rows.push(`
      <div class="diag-row">
        <span class="sev warning"></span>
        <span class="where mono">import</span>
        <span class="msg">Unresolved import · ${escapeHtml(imp)} (relative imports resolve against the browser bundle; use @std/…)</span>
      </div>
    `);
  }
  if (rows.length === 0) {
    list.innerHTML = `<div class="empty mono">No diagnostics · all checks passed</div>`;
  } else {
    list.innerHTML = rows.join('');
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toMonacoSeverity(severity: number): monaco.MarkerSeverity {
  if (severity <= 1) return monaco.MarkerSeverity.Error;
  if (severity === 2) return monaco.MarkerSeverity.Warning;
  if (severity === 3) return monaco.MarkerSeverity.Info;
  return monaco.MarkerSeverity.Hint;
}

function lspKindToMonaco(kind: number | undefined): monaco.languages.CompletionItemKind {
  return (kind ?? 0) as monaco.languages.CompletionItemKind;
}

async function main(): Promise<void> {
  const initial = resolveInitialSample();
  buildShell(initial.index, initial.sample.file);

  monaco.languages.register({ id: LANGUAGE_ID, extensions: ['.bio'] });
  monaco.languages.setLanguageConfiguration(LANGUAGE_ID, {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
    ],
  });
  await registerBiohackingTokens();

  const model = monaco.editor.createModel(initial.sample.content, LANGUAGE_ID, EDITOR_URI);
  const editor = monaco.editor.create(document.getElementById('editor-host')!, {
    model,
    theme: 'specsheet',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    lineHeight: 20,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    renderLineHighlight: 'all',
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    padding: { top: 14, bottom: 14 },
  });

  const lang: LanguageServer = createLanguageServer();
  let latest: LangiumDocument | null = null;
  let seq = 0;
  const status = document.getElementById('status')!;

  async function analyze(): Promise<void> {
    const mySeq = ++seq;
    const text = model.getValue();
    status.textContent = 'Analyzing…';
    try {
      const result = await lang.parse(text);
      if (mySeq !== seq) return;
      latest = result.entryDocument;
      const diags = result.entryDocument.diagnostics ?? [];
      monaco.editor.setModelMarkers(
        model,
        LANGUAGE_ID,
        diags.map((d) => ({
          severity: toMonacoSeverity(d.severity ?? 3),
          message: String(d.message),
          startLineNumber: d.range.start.line + 1,
          startColumn: d.range.start.character + 1,
          endLineNumber: d.range.end.line + 1,
          endColumn: d.range.end.character + 1,
        })),
      );
      renderDiagnostics(diags, result.missingImports);
      status.textContent = result.missingImports.length > 0
        ? `Analyzed · ${result.missingImports.length} unresolved import${result.missingImports.length === 1 ? '' : 's'}`
        : 'Language server live · everything runs in this tab';
    } catch (err) {
      if (mySeq !== seq) return;
      console.error('analyze failed:', err);
      monaco.editor.setModelMarkers(model, LANGUAGE_ID, [
        {
          severity: monaco.MarkerSeverity.Error,
          message: String(err instanceof Error ? err.message : err),
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1,
        },
      ]);
      status.textContent = 'Analysis failed';
    }
  }

  let timer: number | undefined;
  model.onDidChangeContent(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(analyze, 350);
  });

  monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
    triggerCharacters: ['.'],
    provideCompletionItems: async (m, position) => {
      if (!latest) return { suggestions: [] };
      const items = await lang.completion(latest, position.lineNumber - 1, position.column - 1);
      const suggestions: monaco.languages.CompletionItem[] = ((items ?? []) as unknown[]).map((it) => {
        const item = it as {
          label: string;
          kind?: number;
          detail?: string;
          documentation?: { value?: string } | string;
          insertText?: string;
          filterText?: string;
        };
        const doc = item.documentation;
        const documentation = typeof doc === 'string' ? doc : doc?.value ?? '';
        return {
          label: item.label,
          kind: lspKindToMonaco(item.kind),
          detail: item.detail,
          documentation: documentation ? { value: documentation } : undefined,
          insertText: item.insertText ?? item.label,
          filterText: item.filterText ?? item.label,
          range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column },
        };
      });
      return { suggestions };
    },
  });

  monaco.languages.registerHoverProvider(LANGUAGE_ID, {
    provideHover: async (m, position) => {
      if (!latest) return null;
      const hover = await lang.hover(latest, position.lineNumber - 1, position.column - 1);
      if (!hover) return null;
      const contents = (hover as { contents: unknown }).contents;
      const list = Array.isArray(contents) ? contents : [contents];
      const mapped = list.map((c) => {
        if (typeof c === 'string') return { value: c };
        const v = (c as { value?: string }).value;
        return { value: v ?? '' };
      });
      return {
        contents: mapped.map((c) => ({ value: String(c.value) })),
        range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
      };
    },
  });

  monaco.languages.registerDefinitionProvider(LANGUAGE_ID, {
    provideDefinition: async (m, position) => {
      const isEntry = m.uri.toString() === EDITOR_URI.toString();
      const doc = isEntry ? latest : lang.document(m.uri.toString());
      if (!doc) return [];
      const links = await lang.definition(doc, position.lineNumber - 1, position.column - 1);
      if (!links || links.length === 0) return [];
      const locations: monaco.languages.LocationLink[] = [];
      for (const link of links) {
        const uri = monaco.Uri.parse(link.targetUri);
        if (uri.toString() !== EDITOR_URI.toString() && !monaco.editor.getModel(uri)) {
          const source = lang.source(link.targetUri);
          if (source === undefined) continue;
          monaco.editor.createModel(source, LANGUAGE_ID, uri);
        }
        locations.push({
          uri,
          range: new monaco.Range(
            link.targetRange.start.line + 1,
            link.targetRange.start.character + 1,
            link.targetRange.end.line + 1,
            link.targetRange.end.character + 1,
          ),
          originSelectionRange: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column,
          ),
        });
      }
      return locations;
    },
  });

  monaco.languages.registerLinkProvider(LANGUAGE_ID, {
    provideLinks: async (m, token) => {
      if (m.uri.toString() !== EDITOR_URI.toString() || !latest) return { links: [] };
      const links = await lang.links(latest);
      if (token.isCancellationRequested) return { links: [] };
      return {
        links: links.map((l) => ({
          range: new monaco.Range(
            l.sourceRange.start.line + 1,
            l.sourceRange.start.character + 1,
            l.sourceRange.end.line + 1,
            l.sourceRange.end.character + 1,
          ),
          url: l.crossFile
            ? 'command:editor.action.peekDefinition'
            : 'command:editor.action.revealDefinition',
          tooltip: l.crossFile
            ? 'cmd/ctrl+click to peek the definition'
            : 'cmd/ctrl+click to go to the definition',
        })),
      };
    },
  });

  const sampleButtons = document.querySelectorAll<HTMLButtonElement>('[data-sample]');
  sampleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.sample);
      sampleButtons.forEach((b) => b.classList.toggle('active', b === btn));
      document.getElementById('editor-caption')!.textContent = `Editor · ${SAMPLES[idx].file}`;
      model.setValue(SAMPLES[idx].content);
      editor.setPosition({ lineNumber: 1, column: 1 });
      void analyze();
    });
  });

  void analyze();
}

void main();
