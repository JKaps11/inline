import { FolderMenuItem } from "../notes/folderMenuItem";
import { NoteMenuItem } from "../notes/noteMenuItem";

export interface MenuItems {
    notes: NoteMenuItem[],
    folders: FolderMenuItem[],
}