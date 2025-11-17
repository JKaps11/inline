import { TreeItem } from "vscode";
import { Note } from "../models/notes";

export class NoteMenuItem extends TreeItem {
    constructor(note: Note) {
        super(note.getTitle());
        this.command;
        this.iconPath;
        this.id = note.id;

    }
}