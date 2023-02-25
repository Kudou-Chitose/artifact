export interface ILocaleMessages {
    yas: {
        scan: {
            success: string;
            error: string;
        };
        lock: {
            success: string;
            error: string;
        };
        socket: {
            connected: string;
            disconnected: string;
        };
    };
}

export interface ILocale {
    key: string;
    name: string;
    messages: ILocaleMessages;
}
