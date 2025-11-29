import { commands, ExtensionContext, TreeDataProvider, TreeView, window } from 'vscode';
import logService from './common/logger';
import { NoteMenuProvider } from './notes/noteMenuProvider';
import { FileSystemUtils } from './common/fileSystem';
import { Registrar } from './common/registrar';
import { NoteMenuItem } from './notes/noteMenuItem';
import { FolderMenuItem } from './notes/folderMenuItem';
import { ErrorForDisplay } from './models/errors';
import { handleVsCodeError } from './common/vscodeErrorHandler';

export function activate(context: ExtensionContext) {
	const fsUtils: FileSystemUtils = new FileSystemUtils();
	const registrar: Registrar = new Registrar(context);
	const inlineNotesMenu: NoteMenuProvider = new NoteMenuProvider(fsUtils);

	const treeView: TreeView<NoteMenuItem | FolderMenuItem> =
		window.createTreeView('inline_notes_view', {
			treeDataProvider: inlineNotesMenu,
		});

	registrar.add(treeView);

	registrar.add(
		commands.registerCommand(
			"inline.file.add",
			async (item?: (NoteMenuItem | FolderMenuItem)) => {
				try {
					const selected = item ?? treeView.selection[0];
					const relativePath: string = selected instanceof NoteMenuItem ? selected.getRelativePath() : selected.folder.getRelativePath();

					const newFileName: string | undefined = await window.showInputBox({
						prompt: "Enter the name of the new file",
						placeHolder: "/name or note.md"
					});
					if (!newFileName) return;

					if (newFileName.charAt(0) === '/') {
						await fsUtils.createFolder(`${relativePath}/newFileName`);
					} else {
						await fsUtils.createFile(relativePath);
					}
				} catch (error: unknown) {
					handleVsCodeError(error);
				}
			}
		),

		commands.registerCommand(
			"inline.menu.delete",
			async (item?: (NoteMenuItem | FolderMenuItem)) => {
				try {
					const selected = item ?? treeView.selection[0];
					if (!selected) return;

					//TODO: display popconfirm
					const relativePath: string = selected instanceof NoteMenuItem ? selected.getRelativePath() : selected.folder.getRelativePath();
					await fsUtils.deleteFolder(relativePath);
				} catch (error: unknown) {
					handleVsCodeError(error);
				}
			}
		),

		commands.registerCommand(
			"inline.note.edit",
			async (item?: (NoteMenuItem | FolderMenuItem)) => {
				try {
					const selected = item ?? treeView.selection[0];
					if (!selected) return;

					const relativePath: string = selected instanceof NoteMenuItem ? selected.getRelativePath() : selected.folder.getRelativePath();

					const newFileName: string | undefined = await window.showInputBox({
						prompt: "Enter the new name for the file",
						placeHolder: "/name or note.md"
					});

					if (!newFileName) return;
					if (newFileName.charAt(0) !== '/' && selected instanceof NoteMenuItem) {
						throw new ErrorForDisplay("A file can not start with a /");
					}

					const newRelativePath = await fsUtils.renameFileOrFolder(relativePath, newFileName);

					//TODO: Revist strucutre of notemenuitme and foldermenutiem maybe folder class is uncessairy
					if (selected instanceof FolderMenuItem) {
						selected.folder.setName(newFileName);
						selected.folder.setRelativePath(newRelativePath);
					} else {
						selected.setRelativePath(newRelativePath);
					}

					selected.label = newFileName;

				} catch (error: unknown) {
					handleVsCodeError(error);
				}
			}
		)
	);
}

export function deactivate(): void {
	logService.debug("Deactivating inline");
}
