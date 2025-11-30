import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Folder } from "../models/folder";

export class FolderMenuItem extends TreeItem {

    constructor(
        public folder: Folder,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(folder.getName(), collapsibleState);
        this.iconPath = ThemeIcon.Folder;
        this.id = folder.getId();
        this.folder = folder;
    }
}