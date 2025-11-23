import { FileType, Uri, workspace, WorkspaceEdit } from "vscode";
import { AppError, ErrorForDisplay } from "../models/errors";
import { Folder } from "../models/folder";

export class FileSystemUtils {
    /**Base directory where all of the files for this extension is store */
    private notesFilePath: Uri;
    private notesFolder: Folder;

    /**Directory where inline notes for code go. Matches directaly with your code structure*/
    private codeFilePath: Uri;

    constructor() {
        const workspaceFolder = workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new ErrorForDisplay("Workspace has no folder");
        }

        //TODO check if this is needed
        if (!workspace.fs.isWritableFileSystem('file')) {
            throw new ErrorForDisplay("Workspace system is not writable");
        }
        this.notesFilePath = Uri.joinPath(workspaceFolder.uri, "/inline-notes");
        this.codeFilePath = Uri.joinPath(this.notesFilePath, "/code");

        //TODO: this is really unstable. maybe an ensure notes file is created or something
        this.createFolder("");

        this.notesFolder = new Folder("inline-notes", "");
    }

    public getNotesFolder(): Folder {
        return this.notesFolder;
    }

    public getFullPath(relativePath: string): Uri {
        return Uri.joinPath(this.notesFilePath, relativePath);
    }

    /**Traverses notes directory and gets menu items to populate notes menu.
     * We do this at the start of every activation of extension 
     * so multiple users can work on same codebase with same notes
     */
    // public async loadExtensionSpecficFilesInProject(): Promise<MenuItems> {
    //     let inlineContext: MenuItems = { folders: [], notes: [] };

    //     const notesFolder: Folder = this.ensureNotesFolder();
    //     // const codeFolder: Folder = this.ensureCodeFolder();

    //     const [nNotes, nFolders]: [notes: { name: string, id: string }[], folders: Folder[]] = this.readNotesFolder()
    //     // const [cNotes, cFolders]: [notes: {name: string, id: string}[], folders: Folder[]] = this.readCodeFolder()

    //     inlineContext.folders = nFolders.map((folder) => new FolderMenuItem(folder, TreeItemCollapsibleState.Collapsed));

    //     const folderContents = this.retrieveFolderContents(relativePath);
    //     folderContents.then((contents) => {
    //         contents.map((content) => {
    //             const name: string = content[0];
    //             switch (content[1]) {
    //                 case FileType.Directory:
    //                     const folder: Folder()
    //                 // get children and apply
    //                 // inlineContext.folders.push(new FolderMenuItem(name, TreeItemCollapsibleState.Collapsed))
    //                 //repeat process
    //                 case FileType.File:
    //                     return new NoteMenuItem(name);
    //                 default:
    //                     window.showWarningMessage("There is an unkown folder type in your notes folder");
    //             }
    //         });
    //     });


    //     return notes;
    // }

    public async createFolder(relativePath: string): Promise<void> {
        try {
            const newFilePath: Uri = Uri.joinPath(this.notesFilePath, relativePath);
            await workspace.fs.createDirectory(newFilePath);
        } catch (error: unknown) {
            throw AppError.fromUnknown(error, "Error while creating a folder");
        }
    }

    public async deleteFolder(relativePath: string): Promise<void> {
        try {
            const deleteFilePath: Uri = Uri.joinPath(this.notesFilePath, relativePath);
            await workspace.fs.delete(deleteFilePath);
        } catch (error: unknown) {
            throw AppError.fromUnknown(error, "Error while creating a folder");
        }
    }

    /**Returns a list of child names and their filetype from a directory */
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
