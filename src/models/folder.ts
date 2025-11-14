export class Folder {
    private id: string;
    private name: string;
    private child_ids: string[] = [];

    constructor(name: string) {
        this.id = crypto.randomUUID();
        this.name = name;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public addNote(noteId: string): void {
        this.child_ids.push(noteId);
    }

    public getChildIds(): string[] {
        return this.child_ids;
    }

    public deleteNote(noteId: string): void {
        this.child_ids.filter((note) => note !== noteId);
    }
}