import { commands, ExtensionContext, window } from 'vscode';
import logService from './common/logger';
import { NoteMenuProvider } from './notes/noteMenuProvider';

export function activate(context: ExtensionContext) {
	//TODO: register activity bar
	window.createTreeView('inline_notes_view', {
		treeDataProvider: new NoteMenuProvider(),
		showCollapseAll: true,
	});

	// const disposable = vscode.commands.registerCommand('inline.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from inline!');
	// });
	const disposable = commands.registerCommand('inline.activityBar', () => {

	})
	context.subscriptions.push(disposable);
}

export function deactivate(): void {
	logService.debug("Deactivating inline");
}
