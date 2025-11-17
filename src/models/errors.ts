export abstract class AppError extends Error {
    readonly isUserFacing: boolean;

    protected constructor(message: string, isUserFacing = false) {
        super(message);
        this.name = new.target.name;
        this.isUserFacing = isUserFacing;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static fromUnknown(error: unknown, context: string): AppError {
        if (error instanceof AppError) {
            return error;
        }

        if (error instanceof Error) {
            return new InternalError(`${context}: ${error.message}`);
        }

        return new InternalError(`${context}: ${String(error)}`);
    }
}

export class ErrorForDisplay extends AppError {
    constructor(message: string) {
        super(message, true);
    }
}

export class InternalError extends AppError {
    constructor(message: string) {
        super(message, false);
    }
}
