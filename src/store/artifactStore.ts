import { Artifact } from "@/ys/artifact";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useUiStore } from "./uiStore";
import type { ISortBy, ISortResultType } from "./types";
import { AffnumSort, PBuildSort, DefeatSort } from "@/ys/sort";
import type {
    IBuild,
    ISetBonusTable,
    IAffixWeightTable,
    IAffnumResults,
    IPBuildResults,
    IDefeatResults,
} from "@/ys/types";
import filterRules from "./filterRules";

const uiStore = useUiStore();

export const useArtifactStore = defineStore("artifact", () => {
    const artifacts = reactive<Artifact[]>([]);
    const processedArtifacts = reactive<Artifact[]>([]);
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
    const builds = reactive<IBuild[]>([]);
    const setBonusTable = reactive<ISetBonusTable>({});
    const affixWeightTable = reactive<IAffixWeightTable>([]);
    const sortResults = ref<IAffnumResults | IPBuildResults | IDefeatResults>();
    const sortResultType = ref<ISortResultType>();
    const canExport = ref(false);

    /** set artifacts, filter & sort them automatically */
    function setArtifacts(_artifacts: Artifact[], _canExport: boolean) {
        artifacts.splice(0, artifacts.length);
        artifacts.concat(_artifacts);
        canExport.value = _canExport;
        processArtifacts();
    }

    /** filter and sort artifacts */
    function processArtifacts() {
        uiStore.run(() => {
            processedArtifacts.splice(0, processedArtifacts.length);
            // filter
            for (let a of artifacts) {
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
                processedArtifacts.push(a);
            }
            // sort
            switch (sort.by) {
                case "avg":
                    sortResults.value = AffnumSort.sort(
                        processedArtifacts,
                        {},
                        []
                    );
                    sortResultType.value = "affnum";
                    break;
                case "avgpro":
                    sortResults.value = AffnumSort.sort(
                        processedArtifacts,
                        setBonusTable,
                        affixWeightTable
                    );
                    sortResultType.value = "affnum";
                    break;
                case "pmulti":
                    sortResults.value = PBuildSort.sort(
                        processedArtifacts,
                        builds.filter((b) => sort.buildKeys.includes(b.key))
                    );
                    sortResultType.value = "pbuild";
                    break;
                case "psingle":
                    sortResults.value = PBuildSort.sort(processedArtifacts, [
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
                    sortResults.value = DefeatSort.sort(processedArtifacts);
                    sortResultType.value = "defeat";
                    break;
                case "index":
                default:
                    processedArtifacts.sort(
                        (a, b) => a.data.index - b.data.index
                    );
                    sortResults.value = undefined;
                    sortResultType.value = undefined;
            }
        });
    }

    return {
        processedArtifacts,
        filter,
        sort,
        builds,
        setBonusTable,
        affixWeightTable,
        sortResults,
        sortResultType,
        canExport,
        setArtifacts,
        processArtifacts,
    };
});
