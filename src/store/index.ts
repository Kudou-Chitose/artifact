import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import { IState, YasConfig } from "./types";
import { Affix, Artifact } from "@/ys/artifact";
import { CharacterData, PresetData } from "@/ys/data";
import { ElMessage } from "element-plus";
import good from "@/ys/ext/good";
import chs from "@/ys/locale/chs";
import storage from "./storage";
import filterRules from "./filterRules";
import { assign } from "./utils";
import { AffnumSort, PBuildSort, DefeatSort } from "@/ys/sort";
import type { IBuild, IWeight } from "@/ys/types";

const LOADING_DELAY = 250;

function getBuilds() {
    // 读取localStorage
    let builds = storage.builds.value as IBuild[];
    // 增量更新
    let keys = new Set(
        builds.reduce((p, c) => p.concat([c.key]), [] as string[])
    );
    let newKeys = Object.keys(CharacterData).filter((key) => !keys.has(key));
    newKeys.forEach((key) => {
        let c = CharacterData[key];
        builds.push({
            key,
            name: chs.character[key],
            set: [...c.build.set],
            main: {
                sands: [...c.build.main.sands],
                goblet: [...c.build.main.goblet],
                circlet: [...c.build.main.circlet],
            },
            weight: { ...c.build.weight },
        });
    });
    // 写入localStorage
    storage.builds.value = builds;

    return builds;
}

export const key: InjectionKey<Store<IState>> = Symbol();

export const store = createStore<IState>({
    state: () => {
        return {
            artifacts: [],
            filteredArtifacts: [],
            filter: {
                set: [],
                slot: [],
                main: [],
                lock: [],
                lvRange: [0, 20],
                pro: false,
                location: [],
                ruleId: 0,
            },
            sort: {
                by: storage.sort.by.value, // 'avg', 'avgpro', 'pmulti', 'psingle', 'defeat', 'index',
                // avg
                weight: storage.sort.weight.value,
                // pmulti
                buildKeys: storage.sort.buildKeys.value,
                // psingle
                sets: storage.sort.sets.value,
                sands: storage.sort.sands.value,
                goblet: storage.sort.goblet.value,
                circlet: storage.sort.circlet.value,
            },
            builds: getBuilds(),
            setBonusTable: storage.setBonusTable.value,
            affixWeightTable: storage.affixWeightTable.value,
            sortResults: undefined,
            sortResultType: undefined,
            artMode: {
                showAffnum: storage.artMode.showAffnum.value,
                useMaxAsUnit: storage.artMode.useMaxAsUnit.value,
                reverseOrder: storage.artMode.reverseOrder.value,
                alikeEnabled: storage.artMode.alikeEnabled.value,
            },
            ws: {
                server: undefined,
                connected: false,
            },
            yas: {
                version: storage.yas.version.value,
                config: new YasConfig(storage.yas.config.value),
            },
            canExport: false,
            nReload: 0, // for UI refreshing
            loading: false,
            nResetFilter: 0, // 更新filter
        };
    },
    getters: {},
    mutations: {
        setFilter(state, payload) {
            assign(state.filter, payload);
        },
        setSort(state, { key, value }: { key: string; value: any }) {
            if (!(key in state.sort)) return;
            (state.sort as any)[key] = value;
            (storage.sort as any)[key].value = value;
        },
        usePreset(state, { presetKey }: { presetKey: string }) {
            let w = PresetData[presetKey];
            if (!w) return;
            state.sort.weight = { ...w };
            storage.sort.weight.value = w;
        },
        useBuild(state, { buildKey }: { buildKey: string }) {
            let b = state.builds.filter((b) => b.key == buildKey)[0];
            if (!b) return;
            // 不要直接赋值
            state.sort.sets = [...b.set];
            state.sort.sands = [...b.main.sands];
            state.sort.goblet = [...b.main.goblet];
            state.sort.circlet = [...b.main.circlet];
            state.sort.weight = { ...b.weight };
            // store
            storage.sort.sets.value = b.set;
            storage.sort.sands.value = b.main.sands;
            storage.sort.goblet.value = b.main.goblet;
            storage.sort.circlet.value = b.main.circlet;
            storage.sort.weight.value = b.weight;
        },
        setArtMode(state, payload) {
            for (let key in payload) {
                if (key in state.artMode) {
                    state.artMode[key] = payload[key];
                    (storage.artMode as any)[key].value = payload[key];
                }
            }
        },
        setYasConfig(state, { config }: { config: YasConfig }) {
            state.yas.config = config;
            storage.yas.config.value = config;
        },
        setYasVersion(state, { version }: { version: string }) {
            state.yas.version = version;
            storage.yas.version.value = version;
        },
        setBuilds(state, { builds }: { builds: IBuild[] }) {
            state.builds = builds;
            storage.builds.value = builds;

            let keys = new Set(builds.map((b) => b.key));
            state.sort.buildKeys = state.sort.buildKeys.filter((k) =>
                keys.has(k)
            );
            storage.sort.buildKeys.value = state.sort.buildKeys;
        },
    },
    actions: {
        reload({ state }) {
            // 仅弹出加载界面
            state.loading = true;
            setTimeout(() => {
                state.loading = false;
                state.nReload++;
            }, LOADING_DELAY);
        },
        setArtifacts(
            { state, dispatch },
            {
                canExport,
                artifacts,
            }: { canExport: boolean; artifacts: Artifact[] }
        ) {
            state.canExport = canExport;
            state.artifacts = artifacts;
            state.nResetFilter++;
            dispatch("updFilteredArtifacts");
        },
        updFilteredArtifacts({ state }) {
            state.loading = true;
            setTimeout(() => {
                let ret = state.artifacts;
                // filter
                ret = ret.filter((a) => {
                    if (!state.filter.set.includes(a.set)) return false;
                    if (!state.filter.slot.includes(a.slot)) return false;
                    if (!state.filter.main.includes(a.mainKey)) return false;
                    if (!state.filter.lock.includes(a.lock.toString()))
                        return false;
                    if (
                        a.level < state.filter.lvRange[0] ||
                        state.filter.lvRange[1] < a.level
                    )
                        return false;
                    return true;
                });
                if (state.filter.pro) {
                    ret = ret.filter((a) => {
                        if (!state.filter.location.includes(a.location))
                            return false;
                        return filterRules[state.filter.ruleId].accept(a);
                    });
                }
                // sort
                switch (state.sort.by) {
                    case "avg":
                        state.sortResults = AffnumSort.sort(
                            ret,
                            {},
                            { "*:*": state.sort.weight }
                        );
                        state.sortResultType = "affnum";
                        break;
                    case "avgpro":
                        state.sortResults = AffnumSort.sort(
                            ret,
                            state.setBonusTable,
                            state.affixWeightTable
                        );
                        state.sortResultType = "affnum";
                        break;
                    case "pmulti":
                        state.sortResults = PBuildSort.sort(
                            ret,
                            state.builds.filter((b) =>
                                state.sort.buildKeys.includes(b.key)
                            )
                        );
                        state.sortResultType = "pbuild";
                        break;
                    case "psingle":
                        state.sortResults = PBuildSort.sort(ret, [
                            {
                                key: "",
                                name: "",
                                set: state.sort.sets,
                                main: {
                                    sands: state.sort.sands,
                                    goblet: state.sort.goblet,
                                    circlet: state.sort.circlet,
                                },
                                weight: state.sort.weight,
                            },
                        ]);
                        state.sortResultType = "pbuild";
                        break;
                    case "defeat":
                        state.sortResults = DefeatSort.sort(ret);
                        state.sortResultType = "defeat";
                        break;
                    case "index":
                    default:
                        // sort in ascending order of index
                        ret.sort((a, b) => a.data.index - b.data.index);
                        state.sortResults = undefined;
                        state.sortResultType = undefined;
                }
                // update
                state.filteredArtifacts = ret;
                state.nReload++;
                state.loading = false;
            }, LOADING_DELAY);
        },
        updArtifact(
            { state, dispatch },
            {
                index,
                toSwap,
                newArt,
            }: {
                index: number;
                toSwap: boolean;
                newArt: {
                    location: string;
                    slot: string;
                    level: number;
                    minors: Affix[];
                };
            }
        ) {
            for (let a of state.filteredArtifacts) {
                if (a.data.index == index) {
                    if (toSwap) {
                        for (let b of state.artifacts) {
                            if (
                                b.location == newArt.location &&
                                b.slot == newArt.slot
                            ) {
                                b.location = a.location;
                                break;
                            }
                        }
                    }
                    a.location = newArt.location;
                    a.level = newArt.level;
                    a.minors = newArt.minors;
                    break;
                }
            }
            dispatch("updFilteredArtifacts"); // 也许可以改为部分更新
        },
        delArtifacts({ state, dispatch }, { indices }: { indices: number[] }) {
            let indices_set = new Set(indices);
            // 在state.artifacts中删除
            let artifacts: Artifact[] = [];
            for (let a of state.artifacts) {
                if (!indices_set.has(a.data.index)) artifacts.push(a);
            }
            state.artifacts = artifacts;
            // 在state.artifacts中删除
            let filteredArtifacts: Artifact[] = [];
            for (let a of state.filteredArtifacts) {
                if (!indices_set.has(a.data.index)) filteredArtifacts.push(a);
            }
            state.filteredArtifacts = filteredArtifacts;
            dispatch("reload");
        },
        addArtifacts(
            { state, dispatch },
            { artifacts }: { artifacts: Artifact[] }
        ) {
            // Array.concat貌似不好用，只能一个个push
            for (let a of artifacts) state.artifacts.push(a);
            state.nResetFilter++;
            dispatch("updFilteredArtifacts"); // 也许可以改为部分更新
        },
        flipLock({ state }, { index }: { index: number }) {
            for (let a of state.artifacts) {
                if (a.data.index == index) {
                    a.lock = !a.lock;
                    return;
                }
            }
        },
        setLock(
            { state },
            { indices, lock }: { indices: number[]; lock: boolean }
        ) {
            let s: Set<number> = new Set(indices);
            for (let a of state.artifacts) {
                if (s.has(a.data.index)) {
                    a.lock = lock;
                }
            }
        },
        setWebSocket({ state, dispatch }, { ws }: { ws?: string }) {
            if (!ws) {
                state.ws.server = undefined;
                state.ws.connected = false;
                return;
            }
            // console.log(ws)
            state.ws.server = new WebSocket(ws);
            state.ws.server.onopen = () => {
                state.ws.connected = true;
            };
            state.ws.server.onclose = () => {
                state.ws.connected = false;
            };
            state.ws.server.onerror = (ev) => {
                ElMessage({
                    message: String(ev),
                    type: "error",
                });
            };
            state.ws.server.onmessage = (ev) => {
                try {
                    let pkt = JSON.parse(ev.data);
                    switch (pkt.cmd) {
                        case "ScanRsp":
                            state.loading = false;
                            if (pkt.data.success == true) {
                                ElMessage({
                                    message: "扫描成功",
                                    type: "success",
                                });
                                dispatch("setArtifacts", {
                                    canExport: true,
                                    artifacts: good.loads(pkt.data.good_json),
                                });
                            } else {
                                ElMessage({
                                    message: "扫描失败：" + pkt.data.message,
                                    type: "error",
                                });
                            }
                            break;
                        case "LockRsp":
                            state.loading = false;
                            if (pkt.data.success == true) {
                                ElMessage({
                                    message: "加解锁成功",
                                    type: "success",
                                });
                            } else {
                                ElMessage({
                                    message: "加解锁失败：" + pkt.data.message,
                                    type: "error",
                                });
                            }
                            break;
                        case "ConfigNotify":
                            if (!storage.yas.config.exists()) {
                                state.yas.config = new YasConfig(
                                    pkt.data.config
                                );
                            }
                            break;
                        default:
                            break;
                    }
                } catch (e) {
                    ElMessage({
                        message: String(e),
                        type: "error",
                    });
                }
            };
        },
        sendScanReq({ state }) {
            if (!state.ws.server) {
                ElMessage({
                    message: "WebSocket未连接",
                    type: "error",
                });
                return;
            }
            state.loading = true;
            let pkt = {
                cmd: "ScanReq",
                data: {
                    argv: state.yas.config.toArgv(),
                },
            };
            state.ws.server.send(JSON.stringify(pkt));
        },
        sendLockReq({ state }, data) {
            if (!state.ws.server) {
                ElMessage({
                    message: "WebSocket未连接",
                    type: "error",
                });
                return;
            }
            state.loading = true;
            let pkt = {
                cmd: "LockReq",
                data: Object.assign(data, {
                    argv: state.yas.config.toArgv(),
                }),
            };
            state.ws.server.send(JSON.stringify(pkt));
        },
    },
});

export function useStore() {
    return baseUseStore(key);
}
