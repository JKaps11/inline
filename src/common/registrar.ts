import { Disposable, ExtensionContext } from "vscode";

export class Registrar {
    constructor(private readonly context: ExtensionContext) { }

    add(...disposables: Disposable[]) {
        this.context.subscriptions.push(...disposables);
        return this;
    }
}
