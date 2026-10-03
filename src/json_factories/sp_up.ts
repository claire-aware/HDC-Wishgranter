import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, key, value } from "../fileFactory.ts";
import { isPlayerCard } from "./cards.ts";

export const manifest: JsonProcessingManifest["sp_up"] = {
    ...getManifestEntry("sp_up", {
        [key]: isPlayerCard,
        [value]: { [key]: /.*/, [value]: /\d+/ },
    }),
    prerequisites: ["cards"],
}
export type BaselineUpgrades = Record<
    `pl_${string}_${string}` | `ab_${string}`,
    | Record<BaselineUpgradeKeys, number>
    | (Record<BaselineUpgradeKeys, number> & {
        apply_status: number;
        power: number;
    })
    | (Record<BaselineUpgradeKeys, number> & {
        gain_status: number;
        gain_power: number;
    })
    | (Record<BaselineUpgradeKeys, number> & {
        target_debuff: number;
        debuff_power: number;
    })
>;
export type BaselineUpgradeKeys =
    | "ep"
    | "dmg"
    | "hp"
    | "scatter"
    | "pierce"
    | "start_status"
    | "timer"
    | "self_attack"
    | "decay_amp"
    | "rapid"
    | "amp_am"
    | "deploy_cost"
    | "range"
    | "spawn_sp_up"
    | "phoenix"
    | "up_slot"
    | "crit_mul"
    | "drive_power"
    | "ready"
    | "eliminate"
    | "heavy_armor"
    | "final_stand"
    | "replay"
    | "mass_produced"
    | "hack_bonus"
    | "multi"
    | "primed"
    | "interdict"
    | "mega_boost"
    | "mirror"
    | "fast_draw"
    | "ab_target"
    | "consume"
    | "dmg_vs_emp"
    | "priority"
    | "megaship_boost"
    | "unload"
    | "scatter_overwrite"
    | "multi_tmp"
    | "intercept"
    | "repair"
    | "add_replay";
