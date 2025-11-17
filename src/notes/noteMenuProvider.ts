import { FileType, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window } from "vscode";
import { NoteMenuItem } from "./noteMenuItem";
import { FolderMenuItem } from "./folderMenuItem";
import { FileSystemUtils } from "../common/fileSystem";
import logService from "../common/logger";
import { handleUnkownError } from "../common/vscodeErrorHandler";
import { ErrorForDisplay } from "../models/errors";
import { Folder } from "../models/folder";

export class NoteMenuProvider implements TreeDataProvider<(NoteMenuItem | FolderMenuItem)> {
    constructor() { }

    getChildren(element?: NoteMenuItem | FolderMenuItem | undefined): ProviderResult<(NoteMenuItem | FolderMenuItem)[]> {
        if (!element) {
            window.showInformationMessage("You have no notes or folders in your repository");
            return Promise.resolve([]);
        }

        if (element instanceof FolderMenuItem) {
            const fsUtils = new FileSystemUtils();
            const children = element.folder.getChildren();
            const relativePath: string = element.folder.getRelativePath();

            try {
                const folderContents = fsUtils.retrieveFolderContents(relativePath);
                folderContents.then((contents) => {
                    contents.map((content) => {
                        switch (content[1]) {
                            case FileType.Directory:
                                // get folder

                                const folder: Folder;
                                return new FolderMenuItem(folder, TreeItemCollapsibleState.Collapsed);
                                break;
                            case FileType.File:
                                break;
                            default:
                                window.showWarningMessage("There is an unkown folder type in your notes folder");
                        }
                    });
                });
            } catch (error: unknown) {
                handleUnkownError(error);
            }
        }

        return Promise.resolve([]);
    }

    getTreeItem(element: (NoteMenuItem | FolderMenuItem)): TreeItem {
        return element;
    }

}