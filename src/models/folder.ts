import { FileSystemUtils } from "../common/fileSystem";
import logService from "../common/logger";
import { ErrorForDisplay, InternalError } from "./errors";

interface ChildItem {
    name: string;
    id: string;
}

export class Folder {
    private id: string;
    private name: string;
    private relativePath: string;
    /**We are using child names for indexing and behavior since the file system saves our state and file names are unique*/
    // private children: ChildItem[] = [];

    constructor(name: string, relativePath: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.relativePath = relativePath;

        logService.info(`Creating a new folder with id: ${this.id}, name: ${name}, and relative path: ${relativePath}`);
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

    public setRelativePath(relativePath: string): void {
        this.relativePath = relativePath;
    }
}