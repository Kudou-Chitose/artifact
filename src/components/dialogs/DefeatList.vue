<script lang="ts" setup>
import { useStore } from "@/store";
import { computed, ref, watch } from "vue";
import { Artifact } from "@/ys/artifact";
import { IDefeatResult } from "@/ys/sort";

const props = defineProps<{
    modelValue: boolean;
    art?: Artifact;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const show = computed<boolean>({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const store = useStore();

// 列表
const defeatByList = ref<Artifact[]>([]);
const defeatByListShowCount = ref(0);
const loadDefeatByList = () => {
    if (defeatByListShowCount.value < defeatByList.value.length) {
        defeatByListShowCount.value = Math.min(
            defeatByList.value.length,
            defeatByListShowCount.value + 10
        );
    }
};
const loadDefeatByListDisabled = computed(
    () => defeatByListShowCount.value >= defeatByList.value.length
);

const updDefeatByList = () => {
    /* update defeatByList according sort results */
    if (!props.art) return false;
    if (!store.state.sortResults) return false;
    if (store.state.sortResultType != "defeat") return false;
    const result = store.state.sortResults.get(props.art) as IDefeatResult;
    if (!result) return false;
    defeatByList.value = result.by;
    defeatByListShowCount.value = Math.min(result.by.length, 10);
    return true;
};

watch(
    () => props.modelValue,
    (value) => {
        if (!value) return;
        if (!updDefeatByList()) {
            show.value = false;
        }
    }
);
</script>

<template>
    <el-dialog title="上位替代" v-model="show" top="8vh">
        <p class="small-title">
            当前圣遗物有{{ defeatByList.length }}个上位替代
        </p>
        <div
            class="preview-artifact-list"
            v-infinite-scroll="loadDefeatByList"
            :infinite-scroll-immediate="false"
            :infinite-scroll-disabled="loadDefeatByListDisabled"
            :key="art ? art.data.index : -1"
        >
            <artifact-card
                v-for="i in defeatByListShowCount"
                :artifact="defeatByList[i - 1]"
                :key="defeatByList[i - 1].data.index"
                :readonly="true"
            />
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
.preview-artifact-list {
    display: flex;
    width: 100%;
    overflow: auto;
    margin-top: 10px;

    > * {
        margin: 5px;
        margin-bottom: 10px;
        zoom: 80%;
    }
}
</style>
