import { isWorkerInitialized } from 'monaco-editor/internal/common/initialize.js';
import { start } from 'monaco-editor/editor/editor.worker.start.js';

self.onmessage = () => {
  if (!isWorkerInitialized()) {
    start(() => {
      return {};
    });
  }
};
