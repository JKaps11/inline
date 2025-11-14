import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { Folder } from "../models/folder";

export class FolderMenuItem extends TreeItem {

    constructor(
        public folder: Folder,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(folder.getName(), collapsibleState);
        this.command;
        this.iconPath;
        this.id = folder.getId();
        this.folder = folder;
    }
}