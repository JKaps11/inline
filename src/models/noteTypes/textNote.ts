import { Metadata } from "../../common/metadata";
import { Note, NoteType } from "../notes";

export class TextNote extends Metadata implements Note {
    private title: string;
    public type: NoteType = NoteType.Text;

    constructor(title: string) {
        super();
        this.title = title;
    }

    public getTitle(): string {
        return this.title;
    };

    public setTitle(title: string): void {
        this.title = title;
    }

    public open: () => void;
    public close: () => Promise<void>;
    public delete: () => Promise<void>;
}