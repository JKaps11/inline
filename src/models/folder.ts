import { ErrorForDisplay, InternalError } from "./errors";

interface ChildItem {
    name: string;
    id: string;
}

export class Folder {
    private id: string;
    private name: string;
    private readonly relativePath: string;
    /**We are using child names for indexing and behavior since the file system saves our state and file names are unique*/
    private children: ChildItem[] = [];

    constructor(name: string, relativePath: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.relativePath = relativePath;
    }

    public getId(): string {
        return this.id;
    }

    public getRelativePath(): string {
        return this.relativePath;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public addChild(fileId: string, name: string): void {
        this.children.forEach((child: ChildItem) => {
            if (child.name === name) {
                throw new ErrorForDisplay(`File of name: ${name} already exists in this directory`);
            }

            if (child.id === fileId) {
                throw new InternalError(`Id collision happened for id ${fileId}`);
            }
        });

        this.children.push({
            id: fileId,
            name: name,
        });
    }

    public getChildren(): ChildItem[] {
        return this.children;
    }

    public deleteChild(name: string): void {
        const startLength = this.children.length;
        this.children.filter((child: ChildItem) => child.name !== name);
        if (startLength === this.children.length) {
            // This should be an internall error unless we let user give a name we don't provider (cli feature)
            throw new InternalError(`File with name: ${name} not found in directory: ${this.relativePath}`);
        }
    }
}