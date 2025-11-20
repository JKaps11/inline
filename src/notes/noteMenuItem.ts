import { Command, commands, TreeItem, Uri } from "vscode";

export class NoteMenuItem extends TreeItem {
    constructor(name: string, noteUri: Uri) {
        super(name);
        this.command = {
            title: 'Open note',
            command: 'vscode.openFolder',
            arguments: [noteUri]
        };
        this.iconPath; // TODO: note icon
        this.id = crypto.randomUUID();
    }
}