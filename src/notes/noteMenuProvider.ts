import { ProviderResult, TreeDataProvider, TreeItem, window } from "vscode";
import { NoteMenuItem } from "./noteMenuItem";
import { FolderMenuItem } from "./folderMenuItem";

export class NoteMenuProvider implements TreeDataProvider<(NoteMenuItem | FolderMenuItem)> {
    constructor() { }

    getChildren(element?: NoteMenuItem | FolderMenuItem | undefined): ProviderResult<(NoteMenuItem | FolderMenuItem)[]> {
        if (!element) {
            window.showInformationMessage("You have no notes or folders in your repository");
            return Promise.resolve([]);
        }

        if (element instanceof FolderMenuItem) {
            const child_ids: string[] = element.folder.getChildIds();


            //TODO: return children nodes
            return Promise.resolve([]);
        }

        return Promise.resolve([]);
    }

    getTreeItem(element: (NoteMenuItem | FolderMenuItem)): TreeItem {
        return element;
    }

}