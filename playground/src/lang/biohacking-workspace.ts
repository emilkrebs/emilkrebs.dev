import { DefaultWorkspaceManager, type LangiumDocument, type WorkspaceFolder } from 'langium';
import type { LangiumSharedServices } from 'langium/lsp';
import { createBuiltinDocuments } from './builtin-library.js';

/**
 * Adds the builtin type library to every workspace.
 *
 * This is Langium's documented builtin-library hook: `loadAdditionalDocuments`
 * runs during workspace startup, before the initial build, so core.bio is
 * indexed alongside the user's files and needs no special case downstream.
 *
 * The library is in scope everywhere and is never imported. std/ is not loaded
 * here on purpose — it is a catalog the user imports and may override, not part
 * of the language.
 */
export class BiohackingWorkspaceManager extends DefaultWorkspaceManager {

    constructor(private readonly sharedServices: LangiumSharedServices) {
        super(sharedServices);
    }

    protected override async loadAdditionalDocuments(
        folders: WorkspaceFolder[],
        collector: (document: LangiumDocument) => void,
    ): Promise<void> {
        await super.loadAdditionalDocuments(folders, collector);
        for (const document of createBuiltinDocuments(this.sharedServices)) {
            collector(document);
        }
    }
}
