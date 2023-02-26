import { Affix, Artifact } from "@/ys/artifact";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useUiStore } from "./uiStore";
import type { ISortBy, ISortResultType } from "../types";
import { AffnumSort, PBuildSort, DefeatSort } from "@/ys/sort";
import type {
    IBuild,
    ISetBonusTable,
    IAffixWeightTable,
    IAffnumResults,
    IPBuildResults,
    IDefeatResults,
} from "@/ys/types";
import filterRules from "../filterRules";

export const useArtifactStore = defineStore("artifact", () => {
    const uiStore = useUiStore();

    const artifacts = ref<Artifact[]>([]);
    const processedArtifacts = ref<Artifact[]>([]);
    const filter = reactive({
        set: [] as string[],
        slot: [] as string[],
        main: [] as string[],
        lock: [] as string[],
        lvRange: [0, 20],
        pro: false,
        location: [] as string[],
        ruleId: 0,
    });
    const sort = reactive({
        by: "avg" as ISortBy,
        weight: {
            hpp: 0,
            atkp: 0.5,
            defp: 0,
            em: 0.5,
            er: 0.5,
            cr: 1,
            cd: 1,
        },
        buildKeys: [] as string[],
        set: [] as string[],
        sands: [] as string[],
        goblet: [] as string[],
        circlet: [] as string[],
    });
    const builds = ref<IBuild[]>([]);
    const setBonusTable = ref<ISetBonusTable>({});
    const affixWeightTable = ref<IAffixWeightTable>([]);
    const sortResults = ref<IAffnumResults | IPBuildResults | IDefeatResults>();
    const sortResultType = ref<ISortResultType>();
    const canExport = ref(false);
    const artMode = reactive({
        dimensionless: false,
        reverseOrder: false,
        alikeEnabled: false,
        affnumMultiplier: 1 / 0.85,
    });
    const nResetFilter = ref(0);

    /** set artifacts, filter & sort them automatically */
    function setArtifacts(_artifacts: Artifact[], _canExport: boolean) {
        artifacts.value = _artifacts;
        canExport.value = _canExport;
        nResetFilter.value++;
        filterAndSort();
    }

    /** filter and sort artifacts */
    function filterAndSort() {
        uiStore.run(() => {
            const arts: Artifact[] = [];
            // filter
            for (let a of artifacts.value) {
                if (!filter.set.includes(a.set)) continue;
                if (!filter.slot.includes(a.slot)) continue;
                if (!filter.main.includes(a.mainKey)) continue;
                if (!filter.lock.includes(a.lock.toString())) continue;
                if (a.level < filter.lvRange[0] || a.level > filter.lvRange[1])
                    continue;
                if (filter.pro && !filter.location.includes(a.location))
                    continue;
                if (filter.pro && !filterRules[filter.ruleId].accept(a))
                    continue;
                arts.push(a);
            }
            // sort
            switch (sort.by) {
                case "avg":
                    sortResults.value = AffnumSort.sort(arts, {}, [
                        {
                            set: "*",
                            type: "*",
                            label: "",
                            weight: sort.weight,
                        },
                    ]);
                    sortResultType.value = "affnum";
                    break;
                case "avgpro":
                    sortResults.value = AffnumSort.sort(
                        arts,
                        setBonusTable.value,
                        affixWeightTable.value
                    );
                    sortResultType.value = "affnum";
                    break;
                case "pmulti":
                    sortResults.value = PBuildSort.sort(
                        arts,
                        builds.value.filter((b) =>
                            sort.buildKeys.includes(b.key)
                        )
                    );
                    sortResultType.value = "pbuild";
                    break;
                case "psingle":
                    sortResults.value = PBuildSort.sort(arts, [
                        {
                            key: "",
                            name: "",
                            set: sort.set,
                            main: {
                                sands: sort.sands,
                                goblet: sort.goblet,
                                circlet: sort.circlet,
                            },
                            weight: sort.weight,
                        },
                    ]);
                    sortResultType.value = "pbuild";
                    break;
                case "defeat":
                    sortResults.value = DefeatSort.sort(arts);
                    sortResultType.value = "defeat";
                    break;
                case "index":
                default:
                    arts.sort((a, b) => a.data.index - b.data.index);
                    sortResults.value = undefined;
                    sortResultType.value = undefined;
            }
            processedArtifacts.value = arts;
        });
    }

    /** add artifacts, filter and sort automatically */
    function addArtifacts(_artifacts: Artifact[]) {
        _artifacts.forEach((a) => artifacts.value.push(a));
        nResetFilter.value++;
        filterAndSort();
    }

    /** delete artifacts, filter and sort automatically */
    function delArtifacts(indices: number[]) {
        let indices_set = new Set(indices);
        // 在state.artifacts中删除
        let arts: Artifact[] = [];
        for (let a of artifacts.value) {
            if (!indices_set.has(a.data.index)) arts.push(a);
        }
        artifacts.value = arts;
        // 在state.artifacts中删除
        arts = [];
        for (let a of processedArtifacts.value) {
            if (!indices_set.has(a.data.index))
                processedArtifacts.value.push(a);
        }
        processedArtifacts.value = arts;
        // show reload
        uiStore.run(() => {});
    }

    /** update artifact, filter and sort automatically */
    function updArtifact(
        index: number,
        toSwap: boolean,
        newArt: {
            location: string;
            slot: string;
            level: number;
            minors: Affix[];
        }
    ) {
        for (let a of processedArtifacts.value) {
            if (a.data.index == index) {
                if (toSwap) {
                    for (let b of artifacts.value) {
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
        filterAndSort();
    }

    /** flip one lock */
    function flipLock(index: number) {
        for (let a of artifacts.value) {
            if (a.data.index == index) {
                a.lock = !a.lock;
                break;
            }
        }
    }

    /** set locks */
    function setLocks(indices: number[], lock: boolean) {
        let s = new Set(indices);
        for (let a of artifacts.value) {
            if (s.has(a.data.index)) {
                a.lock = lock;
            }
        }
    }

    return {
        artifacts,
        processedArtifacts,
        filter,
        sort,
        builds,
        setBonusTable,
        affixWeightTable,
        sortResults,
        sortResultType,
        canExport,
        artMode,
        nResetFilter,
        setArtifacts,
        filterAndSort,
        addArtifacts,
        delArtifacts,
        updArtifact,
        flipLock,
        setLocks,
    };
});
