import * as monaco from 'monaco-editor';
import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma';
import { INITIAL, Registry, parseRawGrammar, type IGrammar } from 'vscode-textmate';
import onigWasmUrl from 'vscode-oniguruma/release/onig.wasm?url';
import { grammarSource } from './grammar-source.js';


const SCOPE_TO_TOKEN: ReadonlyArray<readonly [string, string]> = [
  ['comment.', 'comment'],
  ['keyword.control', 'keyword'],
  ['keyword.other.unit', 'unit'],
  ['constant.language', 'constant'],
  ['constant.numeric', 'number'],
  ['string.quoted', 'string'],
  ['entity.name.type', 'type'],
  ['entity.name.section', 'type'],
  ['support.type', 'type'],
  ['variable.other.property', 'property'],
  ['keyword.other', 'keyword'],
];

function toMonacoToken(scopes: readonly string[]): string {
  for (const scope of scopes) {
    for (const [prefix, token] of SCOPE_TO_TOKEN) {
      if (scope.startsWith(prefix)) return token;
    }
  }
  return '';
}

class BiohackingTokenizer implements monaco.languages.TokensProvider {
  constructor(private readonly grammar: IGrammar) {}

  getInitialState(): monaco.languages.IState {
    return INITIAL;
  }

  tokenize(line: string, state: monaco.languages.IState): monaco.languages.ILineTokens {
    const result = this.grammar.tokenizeLine(line, state as Parameters<IGrammar['tokenizeLine']>[1]);
    const tokens: monaco.languages.IToken[] = result.tokens.map(
      (t) => ({
        startIndex: t.startIndex,
        endIndex: t.endIndex,
        scopes: toMonacoToken(t.scopes),
      }),
    );
    return {
      tokens,
      endState: result.ruleStack,
    };
  }
}

let ready: Promise<void> | null = null;

export function registerBiohackingTokens(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const wasmData = await fetch(onigWasmUrl).then((r) => r.arrayBuffer());
      await loadWASM({ data: wasmData });
      const registry = new Registry({
        onigLib: Promise.resolve({ createOnigScanner, createOnigString }),
        loadGrammar: async (scopeName: string) => {
          if (scopeName === 'source.biohacking') {
            return parseRawGrammar(grammarSource, 'biohacking.tmLanguage.json');
          }
          return null;
        },
      });
      const grammar = await registry.loadGrammar('source.biohacking');
      if (!grammar) {
        throw new Error('failed to load biohacking grammar');
      }
      monaco.languages.setTokensProvider('biohacking', new BiohackingTokenizer(grammar));
    })();
  }
  return ready;
}
