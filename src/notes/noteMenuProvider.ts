import { FileType, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, Uri, EventEmitter, Event, window } from "vscode";
import { NoteMenuItem } from "./noteMenuItem";
import { FolderMenuItem } from "./folderMenuItem";
import { FileSystemUtils } from "../common/fileSystem";
import { Folder } from "../models/folder";
import { handleVsCodeError } from "../common/vscodeErrorHandler";

export class NoteMenuProvider implements TreeDataProvider<NoteMenuItem | FolderMenuItem> {
    private _onDidChangeTreeData = new EventEmitter<NoteMenuItem | FolderMenuItem | undefined>();
    readonly onDidChangeTreeData: Event<NoteMenuItem | FolderMenuItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private fsUtils: FileSystemUtils) { }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: NoteMenuItem | FolderMenuItem): TreeItem {
        return element;
    }

    async getChildren(element?: NoteMenuItem | FolderMenuItem): Promise<(NoteMenuItem | FolderMenuItem)[]> {
        try {
            if (!this.fsUtils.isReadyQuiet()) {
                return [];
            }


            if (!element) {
                const root = this.fsUtils.getNotesFolder();
                const rootItem = new FolderMenuItem(root, TreeItemCollapsibleState.Expanded);
                return [rootItem];
            }

            if (element instanceof FolderMenuItem) {
                const relativePath = element.folder.getRelativePath();
                const items = await this.fsUtils.retrieveFolderContents(relativePath);

                return items.map(([name, type]) => {
                    const newRelative = relativePath + "/" + name;

                    switch (type) {
                        case FileType.Directory:
                            const folder = new Folder(name, newRelative);
                            return new FolderMenuItem(folder, TreeItemCollapsibleState.Collapsed);
                        case FileType.File:
                            return new NoteMenuItem(name, newRelative, this.fsUtils);
                        default:
                            window.showWarningMessage("There is an unknown folder type in your notes folder");
                            return [];
                    }
                }).flat();
            }

            return [];
        } catch (error) {
            handleVsCodeError(error);
            return [];
        }
    }
}
