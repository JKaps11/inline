export type LogLevel = 'off' | 'error' | 'warn' | 'info' | 'debug';

const enum OrderedLevel {
    Off = 0,
    Error = 1,
    Warn = 2,
    Info = 3,
    Debug = 4,
}

function toOrderedLevel(level: LogLevel): OrderedLevel {
    switch (level) {
        case 'error':
            return OrderedLevel.Error;
        case 'warn':
            return OrderedLevel.Warn;
        case 'info':
            return OrderedLevel.Info;
        case 'debug':
            return OrderedLevel.Debug;
        case 'off':
        default:
            return OrderedLevel.Off;
    }
}

class SimpleLogger {
    private level: OrderedLevel = OrderedLevel.Info;

    constructor(
        logLevel: LogLevel = 'info',
    ) {
        this.setLevel(logLevel);
    }

    setLevel(level: LogLevel) {
        this.level = toOrderedLevel(level);
    }

    private get timestamp() {
        return new Date().toISOString();
    }

    private write(kind: 'log' | 'warn' | 'error', message: string, ...params: unknown[]) {
        const prefix = `${this.timestamp}`;
        console[kind](prefix, message, ...params);
    }

    error(message: string, ...params: unknown[]) {
        if (this.level < OrderedLevel.Error) return;
        this.write('error', message, ...params);
    }

    warn(message: string, ...params: unknown[]) {
        if (this.level < OrderedLevel.Warn) return;
        this.write('warn', message, ...params);
    }

    info(message: string, ...params: unknown[]) {
        if (this.level < OrderedLevel.Info) return;
        this.write('log', message, ...params);
    }

    debug(message: string, ...params: unknown[]) {
        if (this.level < OrderedLevel.Debug) return;
        this.write('log', message, ...params);
    }
}

const logService: SimpleLogger = new SimpleLogger();

export default logService;