import { createApp } from "vue";
import App from "@/App.vue";

import { store, key } from "@/store";

import { createPinia } from "pinia";

import { i18n } from "./i18n";

import "element-plus/dist/index.css";

import ECharts from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

createApp(App)
    .use(store, key)
    .use(createPinia())
    .use(i18n)
    .component("v-chart", ECharts)
    .mount("#app");
