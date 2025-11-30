import { commands, window } from "vscode";
import { FolderMenuItem } from "./notes/folderMenuItem";
import { NoteMenuItem } from "./notes/noteMenuItem";
import { FileSystemUtils } from "./common/fileSystem";
import { Registrar } from "./common/registrar";
import { ErrorForDisplay } from "./models/errors";
import { handleVsCodeError } from "./common/vscodeErrorHandler";
import type { TreeView } from "vscode";
import type { NoteMenuProvider } from "./notes/noteMenuProvider";

interface CommandContext {
    registrar: Registrar;
    fsUtils: FileSystemUtils;
    tree: TreeView<NoteMenuItem | FolderMenuItem>;
    provider: NoteMenuProvider;
}

export function registerInlineCommands(ctx: CommandContext) {
    const { registrar, fsUtils, tree, provider } = ctx;

    registrar.add(
        commands.registerCommand(
            "inline.file.add",
            async (item?: NoteMenuItem | FolderMenuItem) => {
                try {
                    const target = item ?? tree.selection[0];
                    if (!target) return;

                    const relativePath =
                        target instanceof NoteMenuItem
                            ? target.getRelativePath()
                            : target.folder.getRelativePath();

                    const name = await window.showInputBox({
                        prompt: "Enter the name of the new file or folder",
                        placeHolder: "note.md or /foldername",
                    });
                    if (!name) return;

                    if (name.startsWith("/")) {
                        await fsUtils.createFolder(`${relativePath}${name}`);
                    } else {
                        await fsUtils.createFile(`${relativePath}/${name}`);
                    }

                    provider.refresh();
                } catch (error) {
                    handleVsCodeError(error);
                }
            }
        )
    );

    registrar.add(
        commands.registerCommand(
            "inline.menu.delete",
            async (item?: NoteMenuItem | FolderMenuItem) => {
                try {
                    const target = item ?? tree.selection[0];
                    if (!target) return;

                    const relativePath =
                        target instanceof NoteMenuItem
                            ? target.getRelativePath()
                            : target.folder.getRelativePath();

                    const name =
                        target instanceof NoteMenuItem
                            ? target.label
                            : target.folder.getName();

                    const result = await window.showWarningMessage(
                        `Delete "${name}"?`,
                        { modal: true },
                        "Delete",
                        "Cancel"
                    );

                    if (result !== "Delete") return;

                    await fsUtils.deleteFolder(relativePath);

                    provider.refresh();
                } catch (error) {
                    handleVsCodeError(error);
                }
            }
        )
    );

    registrar.add(
        commands.registerCommand(
            "inline.note.edit",
            async (item?: NoteMenuItem | FolderMenuItem) => {
                try {
                    const target = item ?? tree.selection[0];
                    if (!target) return;

                    const relativePath =
                        target instanceof NoteMenuItem
                            ? target.getRelativePath()
                            : target.folder.getRelativePath();

                    const newName = await window.showInputBox({
                        prompt: "Enter the new name",
                        placeHolder: "New name (file.md or /folder)",
                    });

                    if (!newName) return;

                    if (target instanceof NoteMenuItem) {
                        if (newName.startsWith("/")) {
                            throw new ErrorForDisplay("A file cannot start with '/'");
                        }

                        if (
                            !newName.endsWith(".md") &&
                            !newName.endsWith(".txt")
                        ) {
                            throw new ErrorForDisplay("A notes file must end in .txt or .md");
                        }
                    }

                    const newRel = await fsUtils.renameFileOrFolder(
                        relativePath,
                        newName
                    );

                    if (target instanceof FolderMenuItem) {
                        target.folder.setName(newName);
                        target.folder.setRelativePath(newRel);
                    } else {
                        target.setRelativePath(newRel);
                    }

                    target.label = newName;

                    provider.refresh();
                } catch (error) {
                    handleVsCodeError(error);
                }
            }
        )
    );
}
