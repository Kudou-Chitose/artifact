<script lang="ts" setup>
import SectionTitle from "@/components/sections/SectionTitle.vue";
import TextButton from "@/components/widgets/TextButton.vue";
import ExportPreview from "@/components/dialogs/ExportPreview.vue";
import YasConfigurator from "../dialogs/YasConfigurator.vue";
import { nextTick, ref } from "vue";
import mona from "@/ys/ext/mona";
import good from "@/ys/ext/good";
import genmo from "@/ys/ext/genmo";
import { useArtifactStore, useYasStore } from "@/store";
import { Artifact } from "@/ys/artifact";
// import pparser from "@/ys/p2p/pparser";
import { testArts } from "@/store/test";
import { i18n } from "@/i18n";

const artStore = useArtifactStore();
const yasStore = useYasStore();

const msg = ref("");
const ok = ref(false);
const importArts = () => {
    if (yasStore.connected) {
        yasStore.sendScanReq();
        return;
    }
    let finput = document.getElementById("file-input") as HTMLInputElement;
    finput.value = "";
    finput.onchange = () => {
        if (!finput.files || finput.files.length == 0) return;
        let file = finput.files[0];
        let reader = new FileReader();
        if (file.name.endsWith(".pcap")) {
            msg.value = i18n.global.t("ui.pcap_not_supp");
            ok.value = false;
            // return;
            // reader.onload = async () => {
            //     try {
            //         let result = reader.result as ArrayBuffer;
            //         let GOOD = await pparser.parseArtifacts(
            //             new Uint8Array(result, 0, result.byteLength)
            //         );
            //         let artifacts = good.loads(JSON.stringify(GOOD));
            //         msg.value = `成功导入${artifacts.length}个5星圣遗物`;
            //         ok.value = true;
            //         store.dispatch("setArtifacts", {
            //             artifacts,
            //             canExport: true,
            //         });
            //     } catch (e) {
            //         msg.value = String(e);
            //         ok.value = false;
            //     }
            // };
            // reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (evt) => {
                if (typeof reader.result !== "string") {
                    msg.value = i18n.global.t("ui.file_not_text");
                    ok.value = false;
                    return;
                }
                let artifacts: Artifact[] = [],
                    canExport = false;
                try {
                    artifacts = good.loads(reader.result);
                    canExport =
                        artifacts.length > 0 &&
                        artifacts[0].data.source == "yas-lock/good";
                } catch (e) {
                    try {
                        artifacts = mona.loads(reader.result);
                    } catch (e) {
                        try {
                            artifacts = genmo.loads(reader.result);
                        } catch (e: any) {
                            console.error(e);
                            msg.value = String(e);
                            ok.value = false;
                            return;
                        }
                    }
                }
                msg.value = i18n.global.t("ui.art_imported", {
                    count: artifacts.length,
                });
                ok.value = true;
                artStore.setArtifacts(artifacts, canExport);
            };
            reader.readAsText(file, "UTF-8");
        }
        reader.onerror = (evt) => {
            msg.value = i18n.global.t("ui.cant_read_file");
            ok.value = false;
        };
        finput.onchange = null;
    };
    finput.click();
};
const openTutorial = () => {
    window.open("./tutorial", "_blank");
};
// 预览对话框
const showPreview = ref(false);
// 预览Yas配置器
const showYasConfig = ref(false);
// 测试
nextTick(() => {
    artStore.setArtifacts(testArts, false);
});
</script>

<template>
    <div class="section">
        <section-title :title="$t('ui.import')">
            <span
                @click="showYasConfig = true"
                v-if="yasStore.connected"
                v-text="$t('yas.config')"
            />
            <span @click="openTutorial" v-text="$t('ui.tutorial')" />
        </section-title>
        <div class="section-content">
            <template v-if="yasStore.connected">
                <text-button @click="importArts" v-text="$t('yas.scan.name')" />
                <text-button
                    style="margin-left: 20px"
                    @click="showPreview = true"
                    v-text="$t('yas.lock.name')"
                />
            </template>
            <template v-else>
                <text-button @click="importArts" v-text="$t('ui.import')" />
                <text-button
                    style="margin-left: 20px"
                    @click="showPreview = true"
                    :disabled="!artStore.canExport"
                    v-text="$t('ui.export')"
                />
            </template>
            <p
                :class="{
                    'import-msg': true,
                    ok,
                }"
                v-text="msg"
            />
        </div>
    </div>
    <div class="hidden">
        <input type="file" id="file-input" accept=".json, .pcap" />
    </div>
    <export-preview v-model="showPreview" />
    <yas-configurator v-model="showYasConfig" />
</template>

<style lang="scss">
.import-msg {
    color: red;
    margin-top: 10px;

    &.ok {
        color: $green;
    }
}

.hidden {
    position: fixed;
    top: -999px;
}
</style>
