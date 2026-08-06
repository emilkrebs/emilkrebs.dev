/**
 * Public API over the prebuilt language bundle (src/lang/vendor/).
 *
 * The DSL implementation — grammar, validators, type system, IR — is built
 * from the private biohacking-ide repo into one minified artifact; this
 * repo commits only that artifact (see scripts/build-lang-bundle.mjs). The
 * curated supplements-only .bio content in bundled/ stays editable here and
 * is imported by the artifact at runtime.
 */
export {
  createBiohackingServices,
  parseBioWithImports,
  grammarSource,
} from './vendor/biohacking-language.min.mjs';

export type {
  BioImportParseResult,
  BioFileReader,
  BiohackingServicesLike,
  BiohackingLspProviders,
} from './vendor/biohacking-language.min.mjs';
