// Monaco ships these entry modules without type declarations; the worker
// bootstrap uses them directly. Vite resolves them at build time.
declare module 'monaco-editor/internal/common/initialize.js' {
  export function isWorkerInitialized(): boolean;
}

declare module 'monaco-editor/editor/editor.worker.start.js' {
  export function start(
    factory: (workerId: string, label: string) => unknown,
  ): void;
}
