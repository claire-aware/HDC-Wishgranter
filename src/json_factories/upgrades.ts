import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, isKeyOf, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["upgrades"] = getManifestEntry("upgrades", [
    {
        [key]: /fl_(?:(?:boss)|(?:glo)|.+)_.+/,
        [value]: {
            header: /.*/,
            txt: /.*/,
            txt_equip: /.*/,
        },
    },
    {
        [key]: /up_.+/,
        [value]: { header: /.*/, txt: /.*/ },
    },
    {
        [key]: /up_start_.*/,
        [value]: { icon: /.*/, icon_prio: /\d+/ },
    },
])

export type Upgrades = Record<
    `fl_boss_${string}` | `fl_glo_${string}` | `fl_${string}_${string}`,
    FleetUpgrade
> &
    Record<`up_${string}`, Dongle> &
    Record<`up_start_${string}`, StartingUpgrade>;

export interface FleetUpgrade {
    header: string;
    txt: string;
    txt_equip: string;
}
export interface Dongle {
    header: string;
    txt: string;
}
export interface StartingUpgrade {
    icon: string;
    icon_prio: number;
}

export const isFleetUpgrade = isKeyOf("upgrades", {
    header: /.*/,
    txt: /.*/,
    txt_equip: /.*/,
});
export const isDongle = isKeyOf("upgrades", { header: /.*/, txt: /.*/ });
export const isStartingUpgrade = isKeyOf("upgrades", {
    icon: /.*/,
    icon_prio: /\d+/,
});
