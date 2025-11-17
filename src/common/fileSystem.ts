import { FileType, Uri, workspace, WorkspaceEdit } from "vscode";
import { AppError, ErrorForDisplay } from "../models/errors";

export class FileSystemUtils {
    private notesFilePath: Uri;

    constructor() {
        const workspaceFolder = workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new ErrorForDisplay("Workspace has no folder");
        }

        this.notesFilePath = Uri.joinPath(workspaceFolder.uri, "notes");
    }

    public async initializeNotesFile(): Promise<void> {
        try {
            await this.createFolder("");
        } catch (error: unknown) {
            throw AppError.fromUnknown(error, "Note file initialization failed");
        }
    }

    public async createFolder(relativePath: string): Promise<void> {
        try {
            const newFilePath: Uri = Uri.joinPath(this.notesFilePath, relativePath);
            await workspace.fs.createDirectory(newFilePath);
        } catch (error: unknown) {
            throw AppError.fromUnknown(error, "Error while creating a folder");
        }
    }

    public async retrieveFolderContents(relativePath: string): Promise<[string, FileType][]> {
        try {
            const filePath: Uri = Uri.joinPath(this.notesFilePath, relativePath);
            return await workspace.fs.readDirectory(filePath);
        } catch (error: unknown) {
            throw AppError.fromUnknown(error, "Error while retrieving folder contents");
        }
    }

    public async createFile(relativePath: string, title: string): Promise<void> {
        const newFileUri: Uri = Uri.joinPath(this.notesFilePath, relativePath, title);

        try {
            const wsEdit = new WorkspaceEdit();
            wsEdit.createFile(newFileUri);
            await workspace.applyEdit(wsEdit);
        } catch (error: unknown) {
            throw AppError.fromUnknown(error, "Error creating new file");
        }
    }
}
