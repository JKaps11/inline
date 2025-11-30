import {
	commands,
	ExtensionContext,
	TreeView,
	window,
	workspace,
} from "vscode";

import logService from "./common/logger";
import { NoteMenuProvider } from "./notes/noteMenuProvider";
import { FileSystemUtils } from "./common/fileSystem";
import { Registrar } from "./common/registrar";
import { NoteMenuItem } from "./notes/noteMenuItem";
import { FolderMenuItem } from "./notes/folderMenuItem";
import { registerInlineCommands } from "./commands";

export async function activate(context: ExtensionContext) {
	const fsUtils = new FileSystemUtils();
	const registrar = new Registrar(context);

	if (workspace.workspaceFolders?.length) {
		fsUtils.initializeForWorkspace();
	}

	const inlineNotesProvider = new NoteMenuProvider(fsUtils);

	const inlineNotesTreeView: TreeView<NoteMenuItem | FolderMenuItem> =
		window.createTreeView("inline_notes_view", {
			treeDataProvider: inlineNotesProvider,
		});

	workspace.onDidChangeWorkspaceFolders(() => {
		fsUtils.initializeForWorkspace();
		inlineNotesProvider.refresh();
	});

	registerInlineCommands({
		registrar,
		fsUtils,
		tree: inlineNotesTreeView,
		provider: inlineNotesProvider,
	});
}

export function deactivate(): void {
	logService.debug("Deactivating Inline Notes");
}
