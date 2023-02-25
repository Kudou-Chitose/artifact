import { defineStore } from "pinia";
import { ref, reactive } from "vue";

type AlertType = "info" | "success" | "warning" | "error";

export const useUiStore = defineStore("ui", () => {
    // show loading indicator or not
    const loading = ref(false);
    const nReload = ref(0);
    // alert
    const alerter = reactive({
        message: "",
        type: "info" as AlertType,
        counter: 0,
    });

    /** show a message */
    function alert(message: string, type: AlertType = "info") {
        alerter.message = message;
        alerter.type = type;
        alerter.counter++;
    }

    /** run a worker function with a delay */
    function run(worker: () => void, delay = 250) {
        loading.value = true;
        setTimeout(() => {
            try {
                worker();
            } catch (e) {
                alert(String(e), "error");
            }
            loading.value = false;
            nReload.value++;
        }, delay);
    }

    return {
        loading,
        nReload,
        alerter,
        alert,
        run,
    };
});
