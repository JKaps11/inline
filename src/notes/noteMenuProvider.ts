import { FileType, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, Uri, window } from "vscode";
import { NoteMenuItem } from "./noteMenuItem";
import { FolderMenuItem } from "./folderMenuItem";
import { FileSystemUtils } from "../common/fileSystem";
import { Folder } from "../models/folder";
import { handleVsCodeError } from "../common/vscodeErrorHandler";

export class NoteMenuProvider implements TreeDataProvider<(NoteMenuItem | FolderMenuItem)> {
    constructor(
        private fsUtils: FileSystemUtils
    ) { }

    getChildren(element?: NoteMenuItem | FolderMenuItem | undefined): ProviderResult<(NoteMenuItem | FolderMenuItem)[]> {
        if (!element) {
            const notesFolder: Folder = this.fsUtils.getNotesFolder();
            const notesFolderMenuItem: FolderMenuItem = new FolderMenuItem(notesFolder, TreeItemCollapsibleState.Expanded);
            return Promise.resolve([notesFolderMenuItem]);
        }

        if (element instanceof FolderMenuItem) {
            const relativePath: string = element.folder.getRelativePath();

            try {
                const folderContents = this.fsUtils.retrieveFolderContents(relativePath);
                folderContents.then((contents) => {
                    return contents.map((content) => {
                        const name: string = content[0];
                        const newRelativePath: string = relativePath + "/" + name;

                        switch (content[1]) {
                            case FileType.Directory:
                                const newFolder: Folder = new Folder(name, newRelativePath);
                                return new FolderMenuItem(newFolder, TreeItemCollapsibleState.Collapsed);
                            case FileType.File:
                                return new NoteMenuItem(name, relativePath, this.fsUtils);
                            default:
                                window.showWarningMessage("There is an unkown folder type in your notes folder");
                                return [];
                        }
                    });
                });
            } catch (error: unknown) {
                handleVsCodeError(error);
            }
        }

        return Promise.resolve([]);
    }

    getTreeItem(element: (NoteMenuItem | FolderMenuItem)): TreeItem {
        return element;
    }

}