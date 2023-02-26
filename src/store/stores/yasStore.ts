import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useArtifactStore } from "./artifactStore";
import { useUiStore } from "./uiStore";
import { GoodFormat } from "@/ys/ext";
import { i18n } from "@/i18n";
import { assign } from "../utils";

class YasConfig {
    max_row = 1000;
    min_star = 5;
    min_level = 0;
    max_wait_switch_artifact = 800;
    default_stop = 500;
    lock_stop = 100;
    scroll_stop = 100;
    number = 0;
    speed = 5;
    max_wait_scroll = 0;
    no_check = false;
    dxgcap = false;

    constructor(o?: any) {
        assign(this, o);
    }
    toArgv() {
        let argv = [];
        for (let key in this) {
            let arg = "--" + key.replaceAll("_", "-");
            if (typeof this[key] == "boolean") {
                if (this[key]) {
                    argv.push(arg);
                }
            } else {
                argv.push(arg);
                argv.push(String(this[key]));
            }
        }
        return argv;
    }
}

export const useYasStore = defineStore("yas", () => {
    const artStore = useArtifactStore();
    const uiStore = useUiStore();

    const version = ref("");
    const config = reactive(new YasConfig());
    const connected = ref(false);
    const socketUrl = ref("");

    let socket: WebSocket | undefined = undefined;

    /** set socket by url, or clear socket if url is null */
    function setSocket(url: string | null) {
        if (!url) {
            socket = undefined;
            connected.value = false;
            socketUrl.value = "";
            return;
        }

        socketUrl.value = url;

        // create socket and bind events
        socket = new WebSocket(url);
        socket.onopen = () => (connected.value = true);
        socket.onclose = () => (connected.value = false);
        socket.onerror = (ev) => uiStore.alert(String(ev), "error");
        socket.onmessage = (ev) => {
            try {
                const pkt = JSON.parse(ev.data);

                switch (pkt.cmd) {
                    case "ScanRsp":
                        uiStore.loading = false;
                        if (pkt.data.success === true) {
                            uiStore.alert(
                                i18n.global.t("yas.scan.success"),
                                "success"
                            );
                            artStore.setArtifacts(
                                GoodFormat.loads(pkt.data.good_json),
                                true
                            );
                        } else {
                            uiStore.alert(
                                i18n.global.t("yas.scan.error") +
                                    ": " +
                                    pkt.data.message,
                                "error"
                            );
                        }
                        break;
                    case "LockRsp":
                        uiStore.loading = false;
                        if (pkt.data.success === true) {
                            uiStore.alert(
                                i18n.global.t("yas.lock.success"),
                                "success"
                            );
                        } else {
                            uiStore.alert(
                                i18n.global.t("yas.lock.error") +
                                    ": " +
                                    pkt.data.message,
                                "error"
                            );
                        }
                        break;
                    case "ConfigNotify":
                        assign(config, pkt.data.config);
                        break;
                    default:
                        console.warn("unknown packet: ", pkt);
                }
            } catch (e) {
                console.error("invalid packet: ", ev.data);
                uiStore.alert("invalid packet", "error");
            }
        };
    }

    /** send ScanReq to server */
    function sendScanReq() {
        if (!socket) {
            uiStore.alert(i18n.global.t("yas.socket.disconnected"), "error");
            return;
        }
        uiStore.loading = true;
        socket.send(
            JSON.stringify({
                cmd: "ScanReq",
                data: {
                    argv: config.toArgv(),
                },
            })
        );
    }

    /**
     * Send LockReq to server
     * @param data should contain 'indices' or 'lock_json'
     */
    function sendLockReq(data: any) {
        if (!socket) {
            uiStore.alert(i18n.global.t("yas.socket.disconnected"), "error");
            return;
        }
        uiStore.loading = true;
        socket.send(
            JSON.stringify({
                cmd: "LockReq",
                data: {
                    argv: config.toArgv(),
                    ...data,
                },
            })
        );
    }

    return {
        version,
        connected,
        config,
        socketUrl,
        setSocket,
        sendScanReq,
        sendLockReq,
    };
});
