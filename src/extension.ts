import { commands, ExtensionContext, window } from 'vscode';
import logService from './common/logger';
import { NoteMenuProvider } from './notes/noteMenuProvider';
import { FileSystemUtils } from './common/fileSystem';
import { Registrar } from './common/registrar';

export function activate(context: ExtensionContext) {
	const fsUtils: FileSystemUtils = new FileSystemUtils();
	const registrar: Registrar = new Registrar(context);

	registrar.add(
		window.registerTreeDataProvider('inline_notes_view',
			new NoteMenuProvider(fsUtils),
		)
	);


	registrar.add(
		// TODO: Figure out where to add new file/note directory wise. should mimic normal vscode behavior
		commands.registerCommand("inline.note.add", async () => {
			// fsUtils.createFile();

		}),

		commands.registerCommand("inline.file.add", async () => {
			// show popup to enter name?

			fsUtils.createFolder();
		}),

		commands.registerCommand("inline.menu.delete", async () => {
			//delete
			fsUtils.deleteFolder();
		}),

		commands.registerCommand("inline.note.edit", async () => {
			//change name
		}),
	);
}

export function deactivate(): void {
	logService.debug("Deactivating inline");
}
