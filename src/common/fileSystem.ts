import { FileType, Uri, workspace, WorkspaceEdit } from "vscode";
import { AppError, ErrorForDisplay } from "../models/errors";
import { Folder } from "../models/folder";
import logService from "./logger";

export class FileSystemUtils {
    /**Base directory where all of the files for this extension are stored */
    private notesFilePath: Uri = Uri.file("/dev/null");
    private codeFilePath: Uri = Uri.file("/dev/null");

    private notesFolder: Folder = new Folder("invalid", "");

    private isInWorkspaceFolder: boolean;
    private isWritableFileSystem: boolean | undefined;

    constructor() {
        this.isInWorkspaceFolder = !!workspace.workspaceFolders?.[0];
        this.isWritableFileSystem = workspace.fs.isWritableFileSystem("file");
    }

    /**
     * Must be called when the workspace changes.
     * Initializes real file paths only when ready.
     */
    public initializeForWorkspace() {
        this.ensureReady();

        const root = workspace.workspaceFolders![0].uri;

        this.notesFilePath = Uri.joinPath(root, "inline-notes");
        this.codeFilePath = Uri.joinPath(this.notesFilePath, "code");

        // Ensure base folders exist
        this.ensureFolderExists(this.notesFilePath);
        this.ensureFolderExists(this.codeFilePath);

        this.notesFolder = new Folder("inline-notes", "");
    }

    /**
     * Guard: prevents all FS operations when workspace is unavailable
     */
    public isReadyQuiet(): boolean {
        return this.isInWorkspaceFolder && this.isWritableFileSystem === true;
    }

    private ensureReady() {
        if (!this.isInWorkspaceFolder) {
            throw new ErrorForDisplay("Open a folder to use Inline Notes.");
        }

        if (!this.isWritableFileSystem) {
            throw new ErrorForDisplay("File system is read-only.");
        }
    }

    /**
     * Wraps all public FS operations to avoid repeating ensureReady().
     */
    private async withReady<T>(fn: () => Promise<T>): Promise<T> {
        this.ensureReady();
        return fn();
    }

    /**
     * Ensures a folder exists, but does not throw if it already exists.
     */
    private async ensureFolderExists(uri: Uri): Promise<void> {
        try {
            await workspace.fs.stat(uri);
        } catch {
            await workspace.fs.createDirectory(uri);
        }
    }

    // ------------------------------------------------------------
    // PUBLIC API
    // ------------------------------------------------------------

    public getNotesFolder(): Folder {
        return this.notesFolder;
    }

    public getFullPath(relativePath: string): Uri {
        return Uri.joinPath(this.notesFilePath, relativePath);
    }

    public createFolder(relativePath: string): Promise<void> {
        return this.withReady(async () => {
            try {
                const newFolder = Uri.joinPath(this.notesFilePath, relativePath);
                await workspace.fs.createDirectory(newFolder);
            } catch (error) {
                throw AppError.fromUnknown(error, "Error while creating a folder");
            }
        });
    }

    public deleteFolder(relativePath: string): Promise<void> {
        return this.withReady(async () => {
            try {
                const target = Uri.joinPath(this.notesFilePath, relativePath);
                await workspace.fs.delete(target, { recursive: true });
            } catch (error) {
                throw AppError.fromUnknown(error, "Error while deleting a folder");
            }
        });
    }

    /**Returns a list of child names and file types from a directory */
    public retrieveFolderContents(relativePath: string): Promise<[string, FileType][]> {
        return this.withReady(async () => {
            try {
                const dirUri = Uri.joinPath(this.notesFilePath, relativePath);
                return await workspace.fs.readDirectory(dirUri);
            } catch (error) {
                throw AppError.fromUnknown(error, "Error retrieving folder contents");
            }
        });
    }

    public createFile(relativePath: string): Promise<void> {
        return this.withReady(async () => {
            try {
                const fileUri = Uri.joinPath(this.notesFilePath, relativePath);
                const edit = new WorkspaceEdit();
                edit.createFile(fileUri, { overwrite: false });
                await workspace.applyEdit(edit);
            } catch (error) {
                throw AppError.fromUnknown(error, "Error creating new file");
            }
        });
    }

    /**Renames a file or folder and returns the new relative path */
    public renameFileOrFolder(relativePath: string, newName: string): Promise<string> {
        return this.withReady(async () => {
            const oldUri = Uri.joinPath(this.notesFilePath, relativePath);

            const lastSlash = relativePath.lastIndexOf("/");
            const newRelative = `${relativePath.slice(0, lastSlash)}/${newName}`;
            const newUri = Uri.joinPath(this.notesFilePath, newRelative);

            try {
                await workspace.fs.rename(oldUri, newUri, { overwrite: false });
            } catch (error) {
                logService.error(JSON.stringify(error));
                throw new ErrorForDisplay("Error renaming file or folder");
            }

            return newRelative;
        });
    }
}
