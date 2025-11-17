import { window } from "vscode";
import { AppError } from "../models/errors";
import logService from "./logger";
import { DEFAULT_SUPPORT_MESSAGE } from "../constants";

export function handleVsCodeError(error: unknown): void {
    if (error instanceof AppError) {
        const userMessage = error.isUserFacing
            ? error.message
            : "An error has occurred within the Inline extension.";

        window.showErrorMessage(`${userMessage} ${DEFAULT_SUPPORT_MESSAGE}`);
        logService.error(error.message, error);
        return;
    }

    if (error instanceof Error) {
        window.showErrorMessage("An error has occurred within the Inline extension. " + DEFAULT_SUPPORT_MESSAGE);
        logService.error(error.message, error);
        return;
    }

    window.showErrorMessage("An unknown error has occurred. " + DEFAULT_SUPPORT_MESSAGE);
    logService.error("Unknown non-Error thrown", error);
}
