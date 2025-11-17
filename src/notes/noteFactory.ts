import { TextNote } from "../models/noteTypes/textNote";
import { Note, NoteType } from "../models/notes";

class NoteFactory {
    create(title: string, type: NoteType): Note {
        switch (type) {
            case NoteType.Text:
                return new TextNote(title);
            case NoteType.Todo:
                return new TodoNote(title);
            case NoteType.Markdown:
                return new MarkdownNote(.title);
            default:
                throw new Error(`Unknown note type: ${type satisfies never}`);
        }
    }
}
