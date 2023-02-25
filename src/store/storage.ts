import { IWeight, ISetBonusTable, IAffixWeightTable } from "@/ys/types";
import { unzipSync } from "zlib";

class Item {
    key: string;
    constructor(key: string) {
        this.key = key;
    }
    get value() {
        return localStorage.getItem(this.key);
    }
    set value(v: string | null) {
        if (v === null) {
            localStorage.removeItem(this.key);
        } else {
            localStorage.setItem(this.key, v);
        }
    }
}

class TypedItem<T> {
    key: string;
    defaultValue: T;
    constructor(key: string, defaultValue: T) {
        this.key = key;
        this.defaultValue = defaultValue;
    }
    get value() {
        let item = localStorage.getItem(this.key);

        if (item === null) {
            return this.defaultValue;
        }

        if (typeof this.defaultValue != "string") {
            try {
                return JSON.parse(item) as T;
            } catch {
                return this.defaultValue;
            }
        }

        return item as unknown as T;
    }
    set value(v: T) {
        if (typeof v == "string") {
            localStorage.setItem(this.key, v);
        } else {
            localStorage.setItem(this.key, JSON.stringify(v));
        }
    }
    exists() {
        return localStorage.getItem(this.key) !== null;
    }
    remove() {
        localStorage.removeItem(this.key);
    }
}

const Storage = {
    yas: {
        config: new TypedItem<object>("yas.config", {}),
        version: new Item("yas.version"),
    },
    builds: new TypedItem<object[]>("builds", []),
    setBonusTable: new TypedItem<ISetBonusTable>("setBonusTable", {}),
    affixWeightTable: new TypedItem<IAffixWeightTable>("affixWeightTable", []),
    sort: {
        by: new TypedItem<string>("sort.by", "avg"),
        weight: new TypedItem<IWeight>("sort.weight", {
            hpp: 0,
            atkp: 0.5,
            defp: 0,
            em: 0.5,
            er: 0.5,
            cr: 1,
            cd: 1,
        }),
        buildKeys: new TypedItem<string[]>("sort.buildKeys", []),
        sets: new TypedItem<string[]>("sort.sets", []),
        sands: new TypedItem<string[]>("sort.sands", []),
        goblet: new TypedItem<string[]>("sort.goblet", []),
        circlet: new TypedItem<string[]>("sort.circlet", []),
    },
    artMode: {
        showAffnum: new TypedItem<boolean>("artMode.showAffnum", false),
        useMaxAsUnit: new TypedItem<boolean>("artMode.useMaxAsUnit", false),
        reverseOrder: new TypedItem<boolean>("artMode.reverseOrder", false),
        alikeEnabled: new TypedItem<boolean>("artMode.alikeEnabled", true),
    },
};

function getUsedKeys(storage: any) {
    let keys: string[] = [];

    for (let s in storage) {
        if (storage[s] instanceof Item || storage[s] instanceof TypedItem) {
            keys.push(storage[s].key);
        } else {
            keys = keys.concat(getUsedKeys(storage[s]));
        }
    }

    return keys;
}

function clearUnusedData() {
    // get used keys in storage
    let usedKeys = getUsedKeys(Storage),
        unusedKeys = [];

    // iterate over local storage and get unused keys
    for (let i = 0; i < localStorage.length; ++i) {
        let key = localStorage.key(i)!;
        if (usedKeys.includes(key)) continue;
        unusedKeys.push(key);
    }

    // delete unused keys
    unusedKeys.forEach((key) => {
        localStorage.removeItem(key);
    });
}

// clear unused data in local storage by default
clearUnusedData();

export default Storage;
