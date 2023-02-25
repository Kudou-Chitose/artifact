import type { ILocale, ILocaleMessages } from "./types";

const messages: ILocaleMessages = {
    yas: {
        scan: {
            success: "扫描成功",
            error: "扫描失败",
        },
        lock: {
            success: "加解锁成功",
            error: "加解锁失败",
        },
        socket: {
            connected: "WebSocket 已连接",
            disconnected: "WebSocket 已断开",
        },
    },
};

export default <ILocale>{
    key: "zhCN",
    name: "简体中文",
    messages,
};
