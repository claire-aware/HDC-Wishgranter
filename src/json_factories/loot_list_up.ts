import type { JsonProcessingManifest} from "../fileFactory.ts";
import { array, getManifestEntry, isKeyOf, key, records, value } from "../fileFactory.ts";
import { isDongle, isFleetUpgrade, isStartingUpgrade } from "./upgrades.ts";

export const manifest: JsonProcessingManifest["loot_list_up"] = {
    ...getManifestEntry("loot_list_up", {
        fleet: {
            [records]: [
                {
                    [key]: isKeyOf("factions"),
                    [value]: { [array]: isFleetUpgrade },
                },
            ],

            boss: { [array]: isFleetUpgrade },
            glo: { [array]: isFleetUpgrade },
        },

        up: {
            [records]: [
                {
                    [key]: isKeyOf("factions"),
                    [value]: { [array]: isDongle },
                },
            ],

            glo: { [array]: isDongle },
        },

        start: {
            [key]: isKeyOf("factions"),
            [value]: {
                gen: { [array]: isStartingUpgrade },
                stat: { [array]: isStartingUpgrade },
            },
        },
    }),
    prerequisites: ["upgrades"],
}

export interface LootListUp {
    fleet: { boss: string[]; glo: string[];[key: string]: string[] };
    up: { glo: string[];[key: string]: string[] };
    start: Record<string, { gen: string[]; stat: string[] }>;
}
