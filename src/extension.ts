import * as vscode from 'vscode';
import logService from './system/logger';

export function activate(context: vscode.ExtensionContext) {



	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('inline.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from inline!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate(): void {
	logService.debug("Deactivating inline");
}
