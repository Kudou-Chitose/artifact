<script lang="ts" setup>
import SectionTitle from "@/components/sections/SectionTitle.vue";
import MultiSelect from "@/components/widgets/MultiSelect.vue";
import SingleSelect from "@/components/widgets/SingleSelect.vue";
import CharSelect from "@/components/widgets/CharSelect.vue";
import RangeSlider from "@/components/widgets/RangeSlider.vue";
import chs from "@/ys/locale/chs";
import { computed, watch } from "vue";
import { useArtifactStore } from "@/store";
import { Artifact } from "@/ys/artifact";
import { ArtifactData, CharacterData } from "@/ys/data";
import filterRules from "@/store/filterRules";
import { IOption } from "@/store/types";

const artStore = useArtifactStore();

const pro = computed<boolean>({
    get() {
        return artStore.filter.pro;
    },
    set(v) {
        artStore.filter.pro = v;
    },
});

function countArtifactAttr(key: keyof Artifact) {
    let c: { [key: string]: number } = {};
    for (let a of artStore.artifacts) {
        let akey = a[key].toString();
        c[akey] = akey in c ? c[akey] + 1 : 1;
    }
    return c;
}
// 套装
const setOptions = computed(() => {
    let c = countArtifactAttr("set");
    return Object.keys(chs.set)
        .filter((key) => key in c)
        .map((key) => ({
            key,
            label: chs.set[key],
            icon: `./assets/artifacts/${key}/flower.webp`,
            tip: c[key].toString(),
        }));
});
// 部位
const slotOptions = computed(() => {
    let c = countArtifactAttr("slot");
    return Object.keys(chs.slot)
        .filter((key) => key in c)
        .map((key) => ({
            key,
            label: chs.slot[key],
            icon: `./assets/game_icons/${key}.webp`,
            tip: c[key].toString(),
        }));
});
// 主词条
const mainOptions = computed(() => {
    let c = countArtifactAttr("mainKey");
    return ArtifactData.mainKeys.all
        .filter((key) => key in c)
        .map((key) => ({
            key,
            label: chs.affix[key],
            tip: c[key].toString(),
        }));
});
// 锁
const lockOptions = computed(() => {
    let c = countArtifactAttr("lock");
    return ["true", "false"]
        .filter((key) => key in c)
        .map((key) => ({
            key,
            label: key == "true" ? "加锁" : "解锁",
            tip: c[key].toString(),
        }));
});
// 佩戴角色
const charOptions = computed(() => {
    let c = countArtifactAttr("location");
    return ["", "Traveler"]
        .concat(Object.keys(CharacterData))
        .filter((key) => key in c)
        .map((key) => ({
            key,
            tip: c[key].toString(),
        }));
});
// 特殊筛选规则
const ruleOptions: IOption[] = filterRules.map((v, i) => ({
    key: i,
    label: v.label,
}));
// 更新，填充
watch(
    () => artStore.nResetFilter,
    () => {
        artStore.filter.set = setOptions.value.map((o) => o.key);
        artStore.filter.slot = slotOptions.value.map((o) => o.key);
        artStore.filter.main = mainOptions.value.map((o) => o.key);
        artStore.filter.lock = lockOptions.value.map((o) => o.key);
        artStore.filter.lvRange = [0, 20];
        artStore.filter.location = charOptions.value.map((o) => o.key);
    }
);
</script>

<template>
    <div class="section">
        <section-title title="筛选">
            <span v-show="pro" @click="pro = false">基本</span>
            <span v-show="!pro" @click="pro = true">高级</span>
        </section-title>
        <div class="section-content">
            <multi-select
                class="filter"
                title="套装"
                :options="setOptions"
                v-model="artStore.filter.set"
                :use-icon="true"
            />
            <multi-select
                class="filter"
                title="部位"
                :options="slotOptions"
                v-model="artStore.filter.slot"
                :use-icon="true"
            />
            <multi-select
                class="filter"
                title="主词条"
                :options="mainOptions"
                v-model="artStore.filter.main"
            />
            <multi-select
                class="filter"
                title="锁"
                :options="lockOptions"
                v-model="artStore.filter.lock"
            />
            <range-slider class="filter" v-model="artStore.filter.lvRange" />
            <div v-show="pro">
                <char-select
                    class="filter"
                    title="角色"
                    :options="charOptions"
                    v-model="artStore.filter.location"
                />
                <single-select
                    class="filter"
                    title="特殊筛选规则"
                    :options="ruleOptions"
                    v-model="artStore.filter.ruleId"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.filter {
    margin-top: 15px;
}

.check {
    --el-checkbox-font-size: 16px;
    // --el-checkbox-font-weight: bold;
    // --el-checkbox-text-color: #444;
    height: 30px;

    &.p2 {
        width: 170px;
    }

    &.p3 {
        width: 100px;
    }

    &.p5 {
        width: 50px;
    }
}
</style>
