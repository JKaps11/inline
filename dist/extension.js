"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var import_vscode7 = require("vscode");

// src/common/logger.ts
function toOrderedLevel(level) {
  switch (level) {
    case "error":
      return 1 /* Error */;
    case "warn":
      return 2 /* Warn */;
    case "info":
      return 3 /* Info */;
    case "debug":
      return 4 /* Debug */;
    case "off":
    default:
      return 0 /* Off */;
  }
}
var SimpleLogger = class {
  level = 3 /* Info */;
  constructor(logLevel = "info") {
    this.setLevel(logLevel);
  }
  setLevel(level) {
    this.level = toOrderedLevel(level);
  }
  get timestamp() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  write(kind, message, ...params) {
    const prefix = `${this.timestamp}`;
    console[kind](prefix, message, ...params);
  }
  error(message, ...params) {
    if (this.level < 1 /* Error */) return;
    this.write("error", message, ...params);
  }
  warn(message, ...params) {
    if (this.level < 2 /* Warn */) return;
    this.write("warn", message, ...params);
  }
  info(message, ...params) {
    if (this.level < 3 /* Info */) return;
    this.write("log", message, ...params);
  }
  debug(message, ...params) {
    if (this.level < 4 /* Debug */) return;
    this.write("log", message, ...params);
  }
};
var logService = new SimpleLogger();
var logger_default = logService;

// src/notes/noteMenuProvider.ts
var import_vscode4 = require("vscode");

// src/notes/noteMenuItem.ts
var import_vscode = require("vscode");
var NoteMenuItem = class extends import_vscode.TreeItem {
  constructor(name, relativePath, fsUtils) {
    super(name, import_vscode.TreeItemCollapsibleState.None);
    this.relativePath = relativePath;
    this.command = {
      title: "Open note",
      command: "vscode.openFolder",
      arguments: [fsUtils.getFullPath(this.relativePath)]
    };
    this.iconPath = import_vscode.ThemeIcon.File;
    this.id = crypto.randomUUID();
  }
  getRelativePath() {
    return this.relativePath;
  }
  setRelativePath(relativePath) {
    this.relativePath = relativePath;
  }
};

// src/notes/folderMenuItem.ts
var import_vscode2 = require("vscode");
var FolderMenuItem = class extends import_vscode2.TreeItem {
  constructor(folder, collapsibleState) {
    super(folder.getName(), collapsibleState);
    this.folder = folder;
    this.collapsibleState = collapsibleState;
    this.iconPath = import_vscode2.ThemeIcon.Folder;
    this.id = folder.getId();
    this.folder = folder;
  }
};

// src/models/folder.ts
var Folder = class {
  id;
  name;
  relativePath;
  /**We are using child names for indexing and behavior since the file system saves our state and file names are unique*/
  // private children: ChildItem[] = [];
  constructor(name, relativePath) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.relativePath = relativePath;
    logger_default.info(`Creating a new folder with id: ${this.id}, name: ${name}, and relative path: ${relativePath}`);
  }
  getId() {
    return this.id;
  }
  getRelativePath() {
    return this.relativePath;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  setRelativePath(relativePath) {
    this.relativePath = relativePath;
  }
};

// src/common/vscodeErrorHandler.ts
var import_vscode3 = require("vscode");

// src/models/errors.ts
var AppError = class _AppError extends Error {
  isUserFacing;
  constructor(message, isUserFacing = false) {
    super(message);
    this.name = new.target.name;
    this.isUserFacing = isUserFacing;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  static fromUnknown(error, context) {
    if (error instanceof _AppError) {
      return error;
    }
    if (error instanceof Error) {
      return new InternalError(`${context}: ${error.message}`);
    }
    return new InternalError(`${context}: ${String(error)}`);
  }
};
var ErrorForDisplay = class extends AppError {
  constructor(message) {
    super(message, true);
  }
};
var InternalError = class extends AppError {
  constructor(message) {
    super(message, false);
  }
};

// src/constants.ts
var DEFAULT_SUPPORT_MESSAGE = "Please contact kapsjosh11@gmail.com for support";

// src/common/vscodeErrorHandler.ts
function handleVsCodeError(error) {
  if (error instanceof AppError) {
    const userMessage = error.isUserFacing ? error.message : "An error has occurred within the Inline extension.";
    import_vscode3.window.showErrorMessage(`${userMessage}
${DEFAULT_SUPPORT_MESSAGE}`);
    logger_default.error(error.message, error);
    return;
  }
  if (error instanceof Error) {
    import_vscode3.window.showErrorMessage("An error has occurred within the Inline extension. \n" + DEFAULT_SUPPORT_MESSAGE);
    logger_default.error(error.message, error);
    return;
  }
  import_vscode3.window.showErrorMessage("An unknown error has occurred. \n" + DEFAULT_SUPPORT_MESSAGE);
  logger_default.error("Unknown non-Error thrown", error);
}

// src/notes/noteMenuProvider.ts
var NoteMenuProvider = class {
  constructor(fsUtils) {
    this.fsUtils = fsUtils;
  }
  _onDidChangeTreeData = new import_vscode4.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  refresh() {
    this._onDidChangeTreeData.fire(void 0);
  }
  getTreeItem(element) {
    return element;
  }
  async getChildren(element) {
    try {
      if (!this.fsUtils.isReadyQuiet()) {
        return [];
      }
      if (!element) {
        const root = this.fsUtils.getNotesFolder();
        const rootItem = new FolderMenuItem(root, import_vscode4.TreeItemCollapsibleState.Expanded);
        return [rootItem];
      }
      if (element instanceof FolderMenuItem) {
        const relativePath = element.folder.getRelativePath();
        const items = await this.fsUtils.retrieveFolderContents(relativePath);
        return items.map(([name, type]) => {
          const newRelative = relativePath + "/" + name;
          switch (type) {
            case import_vscode4.FileType.Directory:
              const folder = new Folder(name, newRelative);
              return new FolderMenuItem(folder, import_vscode4.TreeItemCollapsibleState.Collapsed);
            case import_vscode4.FileType.File:
              return new NoteMenuItem(name, newRelative, this.fsUtils);
            default:
              import_vscode4.window.showWarningMessage("There is an unknown folder type in your notes folder");
              return [];
          }
        }).flat();
      }
      return [];
    } catch (error) {
      handleVsCodeError(error);
      return [];
    }
  }
};

// src/common/fileSystem.ts
var import_vscode5 = require("vscode");
var FileSystemUtils = class {
  /**Base directory where all of the files for this extension are stored */
  notesFilePath = import_vscode5.Uri.file("/dev/null");
  codeFilePath = import_vscode5.Uri.file("/dev/null");
  notesFolder = new Folder("invalid", "");
  isInWorkspaceFolder;
  isWritableFileSystem;
  constructor() {
    this.isInWorkspaceFolder = !!import_vscode5.workspace.workspaceFolders?.[0];
    this.isWritableFileSystem = import_vscode5.workspace.fs.isWritableFileSystem("file");
  }
  /**
   * Must be called when the workspace changes.
   * Initializes real file paths only when ready.
   */
  initializeForWorkspace() {
    this.ensureReady();
    const root = import_vscode5.workspace.workspaceFolders[0].uri;
    this.notesFilePath = import_vscode5.Uri.joinPath(root, "inline-notes");
    this.codeFilePath = import_vscode5.Uri.joinPath(this.notesFilePath, "code");
    this.ensureFolderExists(this.notesFilePath);
    this.ensureFolderExists(this.codeFilePath);
    this.notesFolder = new Folder("inline-notes", "");
  }
  /**
   * Guard: prevents all FS operations when workspace is unavailable
   */
  isReadyQuiet() {
    return this.isInWorkspaceFolder && this.isWritableFileSystem === true;
  }
  ensureReady() {
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
  async withReady(fn) {
    this.ensureReady();
    return fn();
  }
  /**
   * Ensures a folder exists, but does not throw if it already exists.
   */
  async ensureFolderExists(uri) {
    try {
      await import_vscode5.workspace.fs.stat(uri);
    } catch {
      await import_vscode5.workspace.fs.createDirectory(uri);
    }
  }
  // ------------------------------------------------------------
  // PUBLIC API
  // ------------------------------------------------------------
  getNotesFolder() {
    return this.notesFolder;
  }
  getFullPath(relativePath) {
    return import_vscode5.Uri.joinPath(this.notesFilePath, relativePath);
  }
  createFolder(relativePath) {
    return this.withReady(async () => {
      try {
        const newFolder = import_vscode5.Uri.joinPath(this.notesFilePath, relativePath);
        await import_vscode5.workspace.fs.createDirectory(newFolder);
      } catch (error) {
        throw AppError.fromUnknown(error, "Error while creating a folder");
      }
    });
  }
  deleteFolder(relativePath) {
    return this.withReady(async () => {
      try {
        const target = import_vscode5.Uri.joinPath(this.notesFilePath, relativePath);
        await import_vscode5.workspace.fs.delete(target, { recursive: true });
      } catch (error) {
        throw AppError.fromUnknown(error, "Error while deleting a folder");
      }
    });
  }
  /**Returns a list of child names and file types from a directory */
  retrieveFolderContents(relativePath) {
    return this.withReady(async () => {
      try {
        const dirUri = import_vscode5.Uri.joinPath(this.notesFilePath, relativePath);
        return await import_vscode5.workspace.fs.readDirectory(dirUri);
      } catch (error) {
        throw AppError.fromUnknown(error, "Error retrieving folder contents");
      }
    });
  }
  createFile(relativePath) {
    return this.withReady(async () => {
      try {
        const fileUri = import_vscode5.Uri.joinPath(this.notesFilePath, relativePath);
        const edit = new import_vscode5.WorkspaceEdit();
        edit.createFile(fileUri, { overwrite: false });
        await import_vscode5.workspace.applyEdit(edit);
      } catch (error) {
        throw AppError.fromUnknown(error, "Error creating new file");
      }
    });
  }
  /**Renames a file or folder and returns the new relative path */
  renameFileOrFolder(relativePath, newName) {
    return this.withReady(async () => {
      const oldUri = import_vscode5.Uri.joinPath(this.notesFilePath, relativePath);
      const lastSlash = relativePath.lastIndexOf("/");
      const newRelative = `${relativePath.slice(0, lastSlash)}/${newName}`;
      const newUri = import_vscode5.Uri.joinPath(this.notesFilePath, newRelative);
      try {
        await import_vscode5.workspace.fs.rename(oldUri, newUri, { overwrite: false });
      } catch (error) {
        logger_default.error(JSON.stringify(error));
        throw new ErrorForDisplay("Error renaming file or folder");
      }
      return newRelative;
    });
  }
};

// src/common/registrar.ts
var Registrar = class {
  constructor(context) {
    this.context = context;
  }
  add(...disposables) {
    this.context.subscriptions.push(...disposables);
    return this;
  }
};

// src/commands.ts
var import_vscode6 = require("vscode");
function registerInlineCommands(ctx) {
  const { registrar, fsUtils, tree, provider } = ctx;
  registrar.add(
    import_vscode6.commands.registerCommand(
      "inline.file.add",
      async (item) => {
        try {
          const target = item ?? tree.selection[0];
          if (!target) return;
          const relativePath = target instanceof NoteMenuItem ? target.getRelativePath() : target.folder.getRelativePath();
          const name = await import_vscode6.window.showInputBox({
            prompt: "Enter the name of the new file or folder",
            placeHolder: "note.md or /foldername"
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
    import_vscode6.commands.registerCommand(
      "inline.menu.delete",
      async (item) => {
        try {
          const target = item ?? tree.selection[0];
          if (!target) return;
          const relativePath = target instanceof NoteMenuItem ? target.getRelativePath() : target.folder.getRelativePath();
          const name = target instanceof NoteMenuItem ? target.label : target.folder.getName();
          const result = await import_vscode6.window.showWarningMessage(
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
    import_vscode6.commands.registerCommand(
      "inline.note.edit",
      async (item) => {
        try {
          const target = item ?? tree.selection[0];
          if (!target) return;
          const relativePath = target instanceof NoteMenuItem ? target.getRelativePath() : target.folder.getRelativePath();
          const newName = await import_vscode6.window.showInputBox({
            prompt: "Enter the new name",
            placeHolder: "New name (file.md or /folder)"
          });
          if (!newName) return;
          if (target instanceof NoteMenuItem) {
            if (newName.startsWith("/")) {
              throw new ErrorForDisplay("A file cannot start with '/'");
            }
            if (!newName.endsWith(".md") && !newName.endsWith(".txt")) {
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

// src/extension.ts
async function activate(context) {
  const fsUtils = new FileSystemUtils();
  const registrar = new Registrar(context);
  if (import_vscode7.workspace.workspaceFolders?.length) {
    fsUtils.initializeForWorkspace();
  }
  const inlineNotesProvider = new NoteMenuProvider(fsUtils);
  const inlineNotesTreeView = import_vscode7.window.createTreeView("inline_notes_view", {
    treeDataProvider: inlineNotesProvider
  });
  import_vscode7.workspace.onDidChangeWorkspaceFolders(() => {
    fsUtils.initializeForWorkspace();
    inlineNotesProvider.refresh();
  });
  registerInlineCommands({
    registrar,
    fsUtils,
    tree: inlineNotesTreeView,
    provider: inlineNotesProvider
  });
}
function deactivate() {
  logger_default.debug("Deactivating Inline Notes");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
