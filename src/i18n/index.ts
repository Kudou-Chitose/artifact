import { createI18n } from "vue-i18n";
import zhCN from "./zhCN";

export const i18nList = [zhCN];

export const i18n = createI18n({
    locale: "zhCN",
    messages: Object.fromEntries(
        i18nList.map((i) => [i.key, i.messages])
    ) as any,
});
