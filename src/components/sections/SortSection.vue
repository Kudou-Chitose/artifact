<script lang="ts" setup>
import SectionTitle from "@/components/sections/SectionTitle.vue";
import SingleSelect from "@/components/widgets/SingleSelect.vue";
import MultiSelect from "@/components/widgets/MultiSelect.vue";
import CharSelect from "@/components/widgets/CharSelect.vue";
import PresetLoader from "@/components/dialogs/PresetLoader.vue";
import BuildLoader from "@/components/dialogs/BuildLoader.vue";
import BuildEditor from "@/components/dialogs/BuildEditor.vue";
import ValueButton from "@/components/widgets/ValueButton.vue";
import { computed, ref } from "vue";
import { useArtifactStore } from "@/store";
import chs from "@/ys/locale/chs";
import { ArtifactData } from "@/ys/data";

const artStore = useArtifactStore();

// 排序方式
const sortByOptions = [
    { key: "avg", label: "按满级期望词条数" },
    { key: "avgpro", label: "按满级期望词条数（高级）" },
    { key: "pmulti", label: "按角色适配概率（多人）" },
    { key: "psingle", label: "按角色适配概率（单人）" },
    { key: "defeat", label: "按上位替代数" },
    { key: "index", label: "不排序" },
];

// 按满级期望词条数
const showPresetLoader = ref(false);
const openPresetLoader = () => (showPresetLoader.value = true);

// 按角色适配概率（多人）
const charOptions = computed(() => {
    return artStore.builds.map((b) => ({ key: b.key, name: b.name }));
});
// 按角色适配概率（单人）
const setsOptions = Object.entries(chs.set).map(([key, label]) => ({
    key,
    label,
    icon: `./assets/artifacts/${key}/flower.webp`,
}));
const sandsOptions = ArtifactData.mainKeys.sands.map((m) => ({
    key: m,
    label: chs.affix[m],
}));
const gobletOptions = ArtifactData.mainKeys.goblet.map((m) => ({
    key: m,
    label: chs.affix[m],
}));
const circletOptions = ArtifactData.mainKeys.circlet.map((m) => ({
    key: m,
    label: chs.affix[m],
}));
// 按上位替代数
// 不排序
// *词条数

// 配装加载窗口
const showBuildLoader = ref(false);
const openBuildLoader = () => (showBuildLoader.value = true);

const showBuildEditor = ref(false);
const openBuildEditor = () => (showBuildEditor.value = true);
</script>

<template>
    <div class="section">
        <section-title title="排序" />
        <div class="content">
            <single-select
                class="row"
                v-model="artStore.sort.by"
                :options="sortByOptions"
                title="排序方式"
            />
            <div v-if="artStore.sort.by == 'avg'">
                <p class="row small">
                    圣遗物的“词条数”是各个副词条数值除以单次平均提升量，再根据词条权重（折算系数）计算的加权和。
                </p>
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openPresetLoader"
                        v-text="'加载预设'"
                    />
                </p>
                <p class="info" style="margin-top: 10px">
                    词条权重（点按粗调，拖拽微调，悬停查看数值）
                </p>
                <value-button
                    class="weight-button"
                    v-for="(_, key) in artStore.sort.weight"
                    v-model="artStore.sort.weight[key]"
                >
                    {{ (chs.affix as any)[key] }}
                </value-button>
            </div>
            <div v-else-if="artStore.sort.by == 'avgpro'">
                <p class="row small">
                    圣遗物的“词条数”是 套装词条数 与 副词条词条数 的和。
                    套装词条数 是指套装效果折算的词条数加成。 副词条词条数
                    是指各个副词条数值除以单次平均提升量，再根据词条权重（折算系数）计算的加权和。
                </p>
                <p class="row small">
                    可以配置套装词条数，以及为不同的套装、主词条配置不同的词条权重。
                </p>
                <p class="row small">
                    <span class="text-btn">修改配置</span>
                </p>
            </div>
            <div v-else-if="artStore.sort.by == 'pmulti'">
                <p class="row small">
                    圣遗物a对角色c的适配概率定义为，刷100个满级圣遗物，其中和a同部位同主词条的圣遗物得分均不超过a的满级期望得分的概率。如果a对c是散件则是200个。
                </p>
                <p class="row small">
                    根据<a
                        href="https://ngabbs.com/read.php?tid=27859119"
                        target="_blank"
                        >推荐配装</a
                    >为每个角色计算适配概率，总的适配概率为所有选中角色适配概率的总和。
                </p>
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openBuildEditor"
                        v-text="'修改配装'"
                    />
                </p>
                <char-select
                    class="row"
                    title="角色"
                    :options="charOptions"
                    v-model="artStore.sort.buildKeys"
                />
            </div>
            <div v-else-if="artStore.sort.by == 'psingle'">
                <p class="row small">
                    圣遗物a对角色c的适配概率定义为，刷100个满级圣遗物，其中和a同部位同主词条的圣遗物得分均不超过a的满级期望得分的概率。如果a对c是散件则是200个。
                </p>
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openBuildEditor"
                        style="margin-right: 8px"
                        v-text="'修改配装'"
                    />
                    <span
                        class="text-btn"
                        @click="openBuildLoader"
                        v-text="'加载配装'"
                    />
                </p>
                <p class="info" style="margin-top: 10px">
                    词条权重（点按粗调，拖拽微调，悬停查看数值）
                </p>
                <value-button
                    class="weight-button"
                    v-for="(_, key) in artStore.sort.weight"
                    v-model="artStore.sort.weight[key]"
                >
                    {{ (chs.affix as any)[key] }}
                </value-button>
                <multi-select
                    class="row"
                    v-model="artStore.sort.set"
                    :options="setsOptions"
                    title="套装偏好"
                    :use-icon="true"
                />
                <multi-select
                    class="row"
                    v-model="artStore.sort.sands"
                    :options="sandsOptions"
                    title="时之沙主词条偏好"
                />
                <multi-select
                    class="row"
                    v-model="artStore.sort.goblet"
                    :options="gobletOptions"
                    title="空之杯主词条偏好"
                />
                <multi-select
                    class="row"
                    v-model="artStore.sort.circlet"
                    :options="circletOptions"
                    title="理之冠主词条偏好"
                />
            </div>
            <div v-else-if="artStore.sort.by == 'defeat'">
                <p class="row small">
                    圣遗物b是圣遗物a的上位替代，如果它们部位和主词条相同，且a的所有副词条（除小攻/小生/小防外）b都有而且数值更大。
                </p>
            </div>
        </div>
    </div>
    <preset-loader v-model="showPresetLoader" />
    <build-loader v-model="showBuildLoader" />
    <build-editor v-model="showBuildEditor" />
</template>

<style lang="scss" scoped>
.info-wrapper {
    font-size: 12px;

    p {
        margin: 4px;
    }
}

.content {
    margin-top: 24px;
    padding: 0 10px;

    .row {
        margin-top: 15px;
    }

    .small {
        font-size: 12px;
        color: gray;
        margin-top: 10px;
        text-align: center;
    }

    .text-btn {
        color: $primary-color;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .weight-button {
        margin: 10px 10px 0 0;
    }
}
</style>
