import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { FileSystemUtils } from "../common/fileSystem";

export class NoteMenuItem extends TreeItem {
    constructor(name: string, private relativePath: string, fsUtils: FileSystemUtils) {
        super(name, TreeItemCollapsibleState.None);
        this.command = {
            title: 'Open note',
            command: 'vscode.openFolder',
            arguments: [fsUtils.getFullPath(this.relativePath)]
        };
        // TODO: Setup note icon by note type
        this.iconPath = ThemeIcon.File;
        this.id = crypto.randomUUID();
    }

    public getRelativePath(): string {
        return this.relativePath;
    }

    public setRelativePath(relativePath: string): void {
        this.relativePath = relativePath;
    }

}