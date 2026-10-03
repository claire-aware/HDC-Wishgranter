import type { JsonProcessingManifest} from "../fileFactory.ts";
import { array, getManifestEntry, isKeyOf, key, record, value } from "../fileFactory.ts";
import { isAbilityCard, isPlayerCard } from "./cards.ts";

export const manifest: JsonProcessingManifest["loot_list_card"] = {
    ...getManifestEntry("loot_list_card", {
        [record]: {
            [key]: isKeyOf("factions"),
            [value]: {
                shp: { [array]: isPlayerCard },
                tch: { [array]: isAbilityCard },
                str: { [array]: isPlayerCard },
                use: { [array]: isAbilityCard },
                shp_combo: {
                    [key]: isKeyOf("factions"),
                    [value]: isPlayerCard,
                },
                tch_combo: {
                    [key]: isKeyOf("factions"),
                    [value]: isAbilityCard,
                },
            },
        },

        start: {
            defense: { [array]: isAbilityCard },
            damage: { [array]: isAbilityCard },
            buff: { [array]: isAbilityCard },
            control: { [array]: isAbilityCard },
            const: { [array]: isPlayerCard },
        },
    }),
    prerequisites: ["cards"],
}

export type LootListCard = Record<string, FactionLoot | RandomStart> & {
    start: RandomStart;
};
export interface FactionLoot {
    shp: `pl_${string}_${string}`[];
    shp_combo: Record<string, `pl_${string}_${string}`>;
    tch: `ab_${string}`[];
    tch_combo: Record<string, `ab_${string}`>;
    str: `pl_${string}_${string}`[];
    use: `ab_${string}`[];
}
export interface RandomStart {
    defense: `ab_${string}`[];
    damage: `ab_${string}`[];
    buff: `ab_${string}`[];
    control: `ab_${string}`[];
    const: `pl_${string}_${string}`[];
}
