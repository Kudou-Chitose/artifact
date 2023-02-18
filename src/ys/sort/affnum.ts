import { Artifact } from "../artifact";
import { ArtifactData } from "../data";
import { argmax, argmin } from "../utils";
import type { ITable, IWeight } from "../types";

export type IAffnumResult = {
    cur: number;
    min: number;
    max: number;
    avg: number;
    weight: IWeight;
};

export type IAffnumResults = Map<Artifact, IAffnumResult>;

export function calcAffnum(
    art: Artifact,
    weight: IWeight,
    setBonus = 0
): IAffnumResult {
    let A: Set<string> = new Set(),
        Ac = new Set(ArtifactData.minorKeys),
        w: IWeight = { ...weight },
        sum_w = 0,
        ret = {
            cur: setBonus,
            min: 0,
            max: 0,
            avg: 0,
            weight: w,
        };

    ArtifactData.minorKeys.forEach((key) => {
        w[key] ||= 0;
    });

    Ac.delete(art.mainKey);
    for (let a of art.minors) {
        ret.cur += (w[a.key] * a.value) / ArtifactData.minorStat[a.key];
        A.add(a.key);
        Ac.delete(a.key);
        sum_w += w[a.key];
    }

    if (art.minors.length == 3) {
        // avg
        let dn = 0,
            nm = 0; // denominator and numerator
        Ac.forEach((a_key) => {
            nm += w[a_key] * ArtifactData.minorDistr[a_key];
            dn += ArtifactData.minorDistr[a_key];
        });
        ret.avg = ret.cur + 0.85 * sum_w + (1.7 * nm) / dn;
        // max
        let a4_key = argmax(w, Ac) as string;
        A.add(a4_key);
        let astar_key = argmax(w, A) as string;
        A.delete(a4_key);
        ret.max = ret.cur + w[a4_key] + 4 * w[astar_key];
        // min
        a4_key = argmin(w, Ac) as string;
        A.add(a4_key);
        astar_key = argmin(w, A) as string;
        A.delete(a4_key);
        ret.min = ret.cur + (w[a4_key] + 4 * w[astar_key]) * 0.7;
    } else if (art.minors.length == 4) {
        let n = Math.ceil((20 - art.level) / 4); // n.o. upgrades
        // avg
        ret.avg = ret.cur + ((n * sum_w) / 4) * 0.85;
        // max
        let astar_key = argmax(w, A) as string;
        ret.max = ret.cur + n * w[astar_key];
        // min
        astar_key = argmin(w, A) as string;
        ret.min = ret.cur + n * w[astar_key] * 0.7;
    }

    return ret;
}

/**
 * 按满级期望词条数从大到小排序。词条数单次最大提升量为单位。
 * @param arts 待排序的圣遗物列表，会被修改
 * @param setBonusTable 套装词条加成表，(套装名, 类别) -> 词条数加成，类别=位置.主词条
 * @param affixWeightTable 词条权重表, (套装名:类别, 词条) -> 权重，"套装名:类别"内允许通配符，类别=位置.主词条
 * @returns results
 */
export function sort(
    arts: Artifact[],
    setBonusTable: ITable,
    affixWeightTable: ITable
): IAffnumResults {
    const results = new Map<Artifact, IAffnumResult>();

    for (const art of arts) {
        const set = art.set,
            type = `${art.slot}.${art.mainKey}`;

        // query set bonus
        const setBonus = (setBonusTable[set] && setBonusTable[set][type]) || 0;

        // query affix weight
        let w: { [key: string]: number };
        if (`${set}:${type}` in affixWeightTable) {
            w = affixWeightTable[`${art.set}:${art.slot}`];
        } else if (`${set}:*` in affixWeightTable) {
            w = affixWeightTable[`${art.set}:*`];
        } else if (`*:${type}` in affixWeightTable) {
            w = affixWeightTable[`*:${art.slot}`];
        } else if ("*:*" in affixWeightTable) {
            w = affixWeightTable["*:*"];
        } else {
            throw new Error("No affix weight table found");
        }
        const affnum = calcAffnum(art, w, setBonus);
        results.set(art, affnum);
    }

    arts.sort((a, b) => {
        const aAffnum = results.get(a);
        const bAffnum = results.get(b);
        if (aAffnum === undefined || bAffnum === undefined) {
            throw new Error("Unexpected undefined");
        }
        return bAffnum.avg - aAffnum.avg;
    });

    return results;
}
