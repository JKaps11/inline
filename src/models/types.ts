import { Metadata } from '../common/metadata';

export enum NoteType {
    Text,
    Todo,
    Markdown
}

export interface Note extends Metadata {
    type: NoteType;

    getTitle: () => string;
    setTitle: (title: string) => void;


    open: () => void;
    close: () => Promise<void>;
    delete: () => Promise<void>;
}