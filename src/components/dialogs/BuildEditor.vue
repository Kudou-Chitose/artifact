<script lang="ts" setup>
import { ref, computed, watch, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArtifactData, CharacterData } from "@/ys/data";
import { useArtifactStore } from "@/store";
import { i18n } from "@/i18n";

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", v: boolean): void;
}>();

const artStore = useArtifactStore();

const show = computed<boolean>({
    get() {
        return props.modelValue;
    },
    set(v) {
        emit("update:modelValue", v);
    },
});

// left
const elements = ["pyro", "hydro", "cryo", "electro", "anemo", "geo", "dendro"]
    .map((e) => ({
        element: e,
        icon: `./assets/game_icons/${e}.webp`,
        text: i18n.global.t("element." + e),
    }))
    .concat([
        {
            element: "custom",
            icon: "",
            text: i18n.global.t("ui.custom"),
        },
    ]);
interface IAvatar {
    key: string;
    text: string;
    icon: string;
    rarity: number;
    bg: string;
}
const avatars = computed(() => {
    let ret: { [e: string]: IAvatar[] } = {};
    for (let b of artStore.builds) {
        let element, icon, rarity;
        if (b.key.startsWith("0")) {
            element = "custom";
            icon = "./assets/char_faces/default.webp";
            rarity = 1;
        } else {
            element = CharacterData[b.key].element;
            icon = b.key.startsWith("Traveler")
                ? "./assets/char_faces/Traveler.webp"
                : `./assets/char_faces/${b.key}.webp`;
            rarity = CharacterData[b.key].rarity;
        }
        if (!(element in ret)) ret[element] = [] as IAvatar[];
        ret[element].push({
            key: b.key,
            text: b.name,
            icon,
            rarity,
            bg: `./assets/bg${rarity}.webp`,
        });
    }
    for (let e in ret) {
        ret[e].sort((a: any, b: any) => b.rarity - a.rarity);
    }
    return ret;
});

// build
const selectedBuildKey = ref("");
const isCustom = computed(() => selectedBuildKey.value.startsWith("0"));
const isNew = ref(false);
const avatarClass = (key: string) => ({
    avatar: true,
    selected: key == selectedBuildKey.value,
});
const setOptions = ArtifactData.setKeys.map((key) => ({
    key,
    label: i18n.global.t("artifact.set." + key),
}));
const sandsOptions = ArtifactData.mainKeys.sands.map((key) => ({
    key,
    label: i18n.global.t("artifact.affix." + key),
}));
const gobletOptions = ArtifactData.mainKeys.goblet.map((key) => ({
    key,
    label: i18n.global.t("artifact.affix." + key),
}));
const circletOptions = ArtifactData.mainKeys.circlet.map((key) => ({
    key,
    label: i18n.global.t("artifact.affix." + key),
}));
const build = reactive({
    name: "",
    set: [] as string[],
    sands: [] as string[],
    goblet: [] as string[],
    circlet: [] as string[],
    weightJson: "",
});
/**
 * depends on key:
 * - null: select Diluc
 * - existing key: select corresponding build
 * - non-existing key: select blank build to edit
 */
const selectBuild = (key?: string) => {
    if (!key) key = "Diluc";
    selectedBuildKey.value = key;
    let b = artStore.builds.filter((b) => b.key == key)[0];
    if (b) {
        isNew.value = false;
        build.name = b.name;
        build.set = [...b.set];
        build.sands = [...b.main.sands];
        build.goblet = [...b.main.goblet];
        build.circlet = [...b.main.circlet];
        build.weightJson = JSON.stringify(b.weight);
    } else {
        isNew.value = true;
        build.name = "";
        build.set = [];
        build.sands = [];
        build.goblet = [];
        build.circlet = [];
        build.weightJson =
            '{"hpp":0,"atkp":0,"defp":0,"em":0,"er":0,"cr":0,"cd":0}';
    }
};
selectBuild();
const minorKeys = ["hpp", "atkp", "defp", "em", "er", "cr", "cd"];
const rules = reactive({
    name: [
        {
            required: true,
            message: i18n.global.t("ui.required"),
            trigger: "blur",
        },
    ],
    weightJson: [
        {
            required: true,
            validator: (rule: never, value: string, callback: any) => {
                try {
                    let w = JSON.parse(value);
                    if (typeof w != "object")
                        return callback(
                            new Error(i18n.global.t("ui.format_err"))
                        );
                    if (minorKeys.length != Object.keys(w).length)
                        return callback(
                            new Error(i18n.global.t("ui.key_missing_or_redunt"))
                        );
                    for (let key in w) {
                        if (!minorKeys.includes(key))
                            return callback(
                                new Error(
                                    i18n.global.t("ui.key_not_exist", { key })
                                )
                            );
                        if (typeof w[key] != "number")
                            return callback(
                                new Error(
                                    i18n.global.t("ui.valofkey_not_num", {
                                        key,
                                    })
                                )
                            );
                        if (w[key] < 0 || w[key] > 1)
                            return callback(
                                new Error(
                                    i18n.global.t(
                                        "ui.valofkey_not_between_0_1",
                                        { key }
                                    )
                                )
                            );
                    }
                    callback();
                } catch {
                    callback(new Error(i18n.global.t("ui.syntax_err")));
                }
            },
            trigger: "blur",
        },
    ],
});
const formEl = ref<any>(null);

// actions
const saveBuild = (formEl: any) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid && selectedBuildKey.value) {
            let builds = artStore.builds,
                idx = -1;
            builds.forEach((b, i) => {
                if (b.key == selectedBuildKey.value) idx = i;
            });
            if (idx >= 0) {
                builds[idx].name = build.name;
                builds[idx].main.sands = [...build.sands];
                builds[idx].main.goblet = [...build.goblet];
                builds[idx].main.circlet = [...build.circlet];
                builds[idx].set = [...build.set];
                builds[idx].weight = JSON.parse(build.weightJson);
            } else {
                isNew.value = false;
                builds.push({
                    key: selectedBuildKey.value,
                    name: build.name,
                    set: [...build.set],
                    main: {
                        sands: [...build.sands],
                        goblet: [...build.goblet],
                        circlet: [...build.circlet],
                    },
                    weight: JSON.parse(build.weightJson),
                });
            }
            ElMessage({ message: i18n.global.t("ui.saved"), type: "success" });
        }
    });
};
const addBuild = () => {
    selectBuild(Math.random().toString());
};
const _resetBuild = (key: string) => {
    let b = artStore.builds.filter((b) => b.key == key)[0];
    if (!b) return;
    let c = CharacterData[key];
    if (!c) return;
    b.name = i18n.global.t("character." + key);
    b.set = [...c.build.set];
    b.main.sands = [...c.build.main.sands];
    b.main.goblet = [...c.build.main.goblet];
    b.main.circlet = [...c.build.main.circlet];
    b.weight = { ...c.build.weight };
};
const resetBuild = () => {
    if (selectedBuildKey.value) {
        _resetBuild(selectedBuildKey.value);
        selectBuild(selectedBuildKey.value);
        artStore.builds = artStore.builds;
        ElMessage({ message: i18n.global.t("ui.reseted"), type: "success" });
    }
};

function popConfirm(msg: string) {
    return ElMessageBox.confirm(msg, i18n.global.t("ui.warning"), {
        confirmButtonText: i18n.global.t("ui.confirm"),
        cancelButtonText: i18n.global.t("ui.cancel"),
        type: "warning",
    });
}

const resetAllBuilds = () => {
    popConfirm(i18n.global.t("ui.confirm_reset_builds")).then(() => {
        Object.keys(CharacterData).forEach((key) => _resetBuild(key));
        ElMessage({ message: i18n.global.t("ui.reseted"), type: "success" });
    });
};
const delCustomBuild = () => {
    popConfirm(
        i18n.global.t("ui.confirm_del_custom_build", {
            build_name: build.name,
        })
    ).then(() => {
        artStore.builds = artStore.builds.filter(
            (b) => b.key != selectedBuildKey.value
        );
        ElMessage({ message: i18n.global.t("ui.deleted"), type: "success" });
        selectBuild();
    });
};
const delCustomBuilds = () => {
    popConfirm(i18n.global.t("ui.confirm_del_all_custom_builds")).then(() => {
        artStore.builds = artStore.builds.filter((b) => !b.key.startsWith("0"));
        ElMessage({ message: i18n.global.t("ui.deleted"), type: "success" });
        if (selectedBuildKey.value.startsWith("0")) {
            selectBuild();
        }
    });
};
</script>

<template>
    <el-dialog
        v-model="show"
        :title="$t('ui.build_editor')"
        top="2vh"
        width="90%"
    >
        <div id="root">
            <div id="left">
                <div id="left-top">
                    <span
                        class="button"
                        @click="addBuild"
                        v-text="$t('ui.add_build')"
                    />
                    <span
                        class="button"
                        @click="resetAllBuilds"
                        v-text="$t('ui.reset_builds')"
                    />
                    <span
                        class="button"
                        @click="delCustomBuilds"
                        v-text="$t('ui.del_all_custom_builds')"
                    />
                </div>
                <div id="left-body">
                    <el-scrollbar>
                        <div class="char-group" v-for="e in elements">
                            <div class="group-hdr">
                                <img
                                    class="element-icon"
                                    :src="e.icon"
                                    v-if="e.icon"
                                />
                                <span class="element-text">{{ e.text }}</span>
                            </div>
                            <template v-for="a in avatars[e.element]">
                                <span
                                    :class="avatarClass(a.key)"
                                    @click="selectBuild(a.key)"
                                >
                                    <span class="icon-wrapper">
                                        <img class="bg" :src="a.bg" />
                                        <img
                                            class="icon"
                                            :src="a.icon"
                                            :alt="a.text"
                                        />
                                    </span>
                                    <span>{{ a.text }}</span>
                                </span>
                            </template>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div id="right">
                <el-scrollbar>
                    <el-form
                        ref="formEl"
                        :model="build"
                        :rules="rules"
                        label-width="80px"
                    >
                        <el-form-item :label="$t('ui.build_name')" prop="name">
                            <el-input v-model="build.name" />
                        </el-form-item>
                        <el-form-item :label="$t('ui.art_set')">
                            <el-select
                                v-model="build.set"
                                multiple
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="o in setOptions"
                                    :value="o.key"
                                    :label="o.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('artifact.slot.sands')">
                            <el-select
                                v-model="build.sands"
                                multiple
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="o in sandsOptions"
                                    :value="o.key"
                                    :label="o.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('artifact.slot.goblet')">
                            <el-select
                                v-model="build.goblet"
                                multiple
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="o in gobletOptions"
                                    :value="o.key"
                                    :label="o.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('artifact.slot.circlet')">
                            <el-select
                                v-model="build.circlet"
                                multiple
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="o in circletOptions"
                                    :value="o.key"
                                    :label="o.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            :label="$t('ui.affix_weight')"
                            prop="weightJson"
                        >
                            <el-input
                                v-model="build.weightJson"
                                autosize
                                type="textarea"
                                class="code"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-alert
                                type="info"
                                show-icon
                                :closable="false"
                                style="line-height: 1.4"
                                :description="$t('ui.weight_json_help')"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                v-if="isCustom"
                                type="danger"
                                @click="delCustomBuild"
                                :disabled="isNew"
                                v-text="$t('ui.del')"
                            />
                            <el-button
                                v-else
                                @click="resetBuild"
                                v-text="$t('ui.reset')"
                            />
                            <el-button
                                type="primary"
                                @click="saveBuild(formEl)"
                                v-text="$t('ui.save')"
                            />
                        </el-form-item>
                    </el-form>
                    <el-alert
                        :title="$t('ui.about_default_builds')"
                        type="info"
                        v-show="!isCustom"
                    >
                        <p v-html="$t('ui.default_builds_desc')" />
                    </el-alert>
                </el-scrollbar>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
#root {
    display: flex;
    align-items: stretch;
    height: 80vh;
    // overflow: hidden;
    // box-shadow: 0 0 1px 0 black;

    #left {
        // box-shadow: 0 0 1px 0 black;
        border-right: 1px solid lightgray;
        flex: 0.5;
        display: flex;
        flex-flow: column;

        #left-top {
            height: 30px;

            .button {
                text-decoration: underline;
                margin-right: 10px;
                margin-bottom: 2px;
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }
        }

        #left-body {
            flex: 1;
            overflow: hidden;

            .char-group {
                padding-left: 2px;

                .group-hdr {
                    // box-shadow: 0 0 1px 0 black;
                    display: flex;
                    align-items: center;
                    background: rgb(255, 249, 238);
                    background: linear-gradient(
                        90deg,
                        rgba(255, 249, 238, 1) 0%,
                        rgba(255, 255, 255, 1) 100%
                    );

                    .element-icon {
                        width: 30px;
                    }

                    .element-text {
                        margin-left: 10px;
                    }
                }

                .avatar {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 5px;
                    cursor: pointer;

                    &.selected {
                        background-color: #ffffeb;
                        box-shadow: 0 0 0 1px #ac9710;
                        border-radius: 5px;
                    }

                    .icon-wrapper {
                        width: 60px;
                        height: 60px;
                        border-radius: 5px;
                        overflow: hidden;
                        position: relative;

                        img {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 100%;
                        }

                        img.icon {
                            margin-left: auto;
                            margin-right: auto;
                            transition: scale 100ms ease;
                        }
                    }

                    &:hover > .icon-wrapper > img.icon {
                        scale: 1.1;
                    }
                }
            }
        }
    }

    #right {
        // box-shadow: 0 0 1px 0 black;
        flex: 0.5;
        padding: 10px;
        overflow-y: hidden;

        .code {
            font-family: "Courier New", Courier, monospace;
        }
    }
}
</style>
