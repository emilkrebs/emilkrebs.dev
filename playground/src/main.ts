import '@fontsource/schibsted-grotesk/400.css';
import '@fontsource/schibsted-grotesk/500.css';
import '@fontsource/schibsted-grotesk/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/instrument-serif/400-italic.css';
import './style.css';
import shellTemplate from './shell.html?raw';

import * as monaco from 'monaco-editor';
import EditorWorker from './editor-worker.js?worker';
import LspWorker from './lsp-worker.ts?worker';
import { LanguageClientWrapper, type LanguageClientConfig } from 'monaco-languageclient/lcwrapper';
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
    'editorError.foreground': '#E8450C',
    'editorWarning.foreground': '#5F5B55',
    'editorInfo.foreground': '#5F5B55',
  },
});

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
  if (window.self !== window.top) {
    document.body.classList.add('embed');
  }
  const sampleButtons = SAMPLES.map(
    (s, i) => `<button type="button" data-sample="${i}" class="${i === activeIndex ? 'active' : ''}" aria-pressed="${i === activeIndex}">${s.label}</button>`,
  ).join('');
  app.innerHTML = shellTemplate
    .replace('{{SAMPLE_BUTTONS}}', sampleButtons)
    .replace('{{FILE_NAME}}', fileName);
}

function renderCrash(message: string): void {
  const list = document.getElementById('diag-list')!;
  list.innerHTML = `
    <div class="diag-row">
      <span class="sev error"><span class="sr-only">Error.</span></span>
      <span class="where mono">server</span>
      <span class="msg">Language server failed · ${escapeHtml(message)}</span>
    </div>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function severityClass(severity: monaco.MarkerSeverity): string {
  if (severity === monaco.MarkerSeverity.Error) return 'error';
  if (severity === monaco.MarkerSeverity.Warning) return 'warning';
  return 'info';
}

function renderMarkers(model: monaco.editor.ITextModel): void {
  const counts = document.getElementById('diag-counts')!;
  const list = document.getElementById('diag-list')!;
  const markers = monaco.editor.getModelMarkers({ resource: model.uri });

  const errors = markers.filter((m) => m.severity === monaco.MarkerSeverity.Error).length;
  const warnings = markers.filter((m) => m.severity === monaco.MarkerSeverity.Warning).length;
  const rest = markers.length - errors - warnings;
  counts.textContent = `${errors} errors · ${warnings} warnings · ${rest} notes`;

  if (markers.length === 0) {
    list.innerHTML = '<div class="empty mono">No diagnostics · all checks passed</div>';
    return;
  }

  list.innerHTML = markers.map((m) => {
    const sev = severityClass(m.severity);
    const label = sev === 'error' ? 'Error.' : sev === 'warning' ? 'Warning.' : 'Note.';
    return `
      <div class="diag-row">
        <span class="sev ${sev}"><span class="sr-only">${label}</span></span>
        <span class="where mono">${m.startLineNumber}:${m.startColumn}</span>
        <span class="msg">${escapeHtml(m.message)}</span>
      </div>
    `;
  }).join('');
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

  try {
    await registerBiohackingTokens();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    document.getElementById('status')!.textContent = 'Language engine failed to load';
    renderCrash(msg);
    const host = document.getElementById('editor-host')!;
    host.innerHTML = '<div class="empty mono">Editor unavailable · reload the page to retry</div>';
    return;
  }

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

  const status = document.getElementById('status')!;
  const lspWorker = new LspWorker();
  const languageClientConfig: LanguageClientConfig = {
    languageId: LANGUAGE_ID,
    connection: {
      options: {
        $type: 'WorkerDirect',
        worker: lspWorker,
      },
    },
    clientOptions: {
      documentSelector: [LANGUAGE_ID],
    },
  };
  const client = new LanguageClientWrapper(languageClientConfig);

  try {
    await client.start();
    status.textContent = 'Language server live · running in a worker';
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    status.textContent = 'Language server failed';
    renderCrash(msg);
  }

  monaco.editor.onDidChangeMarkers((uris) => {
    if (uris.some((uri) => uri.toString() === model.uri.toString())) {
      renderMarkers(model);
    }
  });
  renderMarkers(model);

  const sampleButtons = document.querySelectorAll<HTMLButtonElement>('[data-sample]');
  let pristine = initial.sample.content;
  let activeSample = initial.index;
  let pendingIdx: number | null = null;

  const confirmBar = document.getElementById('switch-confirm')!;
  const confirmMsg = confirmBar.querySelector<HTMLElement>('.confirm-msg')!;
  const confirmKeep = document.getElementById('confirm-keep')!;
  const confirmDiscard = document.getElementById('confirm-discard')!;

  function syncSampleState(idx: number): void {
    activeSample = idx;
    pristine = SAMPLES[idx].content;
    document.getElementById('editor-caption')!.textContent = `Editor · ${SAMPLES[idx].file}`;
    sampleButtons.forEach((b, i) => {
      const on = i === idx;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    history.replaceState(null, '', `?sample=${SAMPLES[idx].file}`);
  }

  function hideConfirm(): void {
    pendingIdx = null;
    confirmBar.hidden = true;
  }

  function showConfirm(idx: number): void {
    pendingIdx = idx;
    confirmMsg.textContent = `Unsaved edits · switching to ${SAMPLES[idx].label} discards them`;
    confirmBar.hidden = false;
  }

  function switchSample(idx: number): void {
    if (idx === activeSample) return;
    editor.executeEdits('sample-switch', [
      {
        range: model.getFullModelRange(),
        text: SAMPLES[idx].content,
        forceMoveMarkers: true,
      },
    ]);
    editor.setPosition({ lineNumber: 1, column: 1 });
    syncSampleState(idx);
    hideConfirm();
  }

  sampleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.sample);
      if (idx === activeSample) return;
      if (model.getValue() !== pristine) {
        showConfirm(idx);
      } else {
        switchSample(idx);
      }
    });
  });

  confirmKeep.addEventListener('click', hideConfirm);
  confirmDiscard.addEventListener('click', () => {
    if (pendingIdx !== null) switchSample(pendingIdx);
  });

  window.addEventListener('beforeunload', () => {
    void client.dispose(true);
  });
}

void main();
