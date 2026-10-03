import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, isKeyOf, key, optional, record, value } from "../fileFactory.ts";
import { isAllyAbilityComms, isCommsPrefix, isHostileAbilityComms, isPlayerAbilityComms } from "./comms.ts";
import { isDongle } from "./upgrades.ts";

export const manifest: JsonProcessingManifest["cards"] = {
    ...getManifestEntry("cards", {
        [key]: /.*/,
        [value]: {
            [record]: {
                [key]: /effect_\d+/,
                [value]: {
                    effect_type: /\d+/,
                    effect_status: {
                        [optional]: /\d+/,
                    },
                    effect_variant: {
                        [optional]: /\d+/,
                    },
                    effect_power: { [optional]: /\d+/ },
                    effect_anim: { [optional]: /.*/ },
                    effect_force_anim: {
                        [optional]: /\d+/,
                    },
                    effect_cmd_id: { [optional]: /.*/ },
                    effect_cmd_comms: {
                        [optional]: /.*/,
                    },
                    effect_cmd_tier: {
                        [optional]: /\d+/,
                    },
                    effect_cmd_ability: {
                        [optional]: /\d+/,
                    },
                    effect_card_id: {
                        [optional]: /.*/,
                    },
                    effect_card_convert: {
                        [optional]: /.*/,
                    },
                    effect_card_list: {
                        [optional]: /.*/,
                    },
                    effect_card_text: {
                        [optional]: /.*/,
                    },
                    effect_up_list: {
                        [optional]: /.*/,
                    },
                    effect_status_target: {
                        [optional]: /\d+/,
                    },
                },
            },
            name: /.*/,
            name_gp: { [optional]: /.*/ },
            type: /1|2/,
            data: /.*/,
            hp: { [optional]: /\d+/ },
            size: { [optional]: /1|2|3/ },
            dmg: /\d+/,
            faction: isKeyOf("factions"),
            por_obj: (id: string) =>
                isKeyOf("factions")(
                    (/(?<=^obj_(?:(?:unit)|(?:ab))_).+/.exec(id) ?? [
                        "",
                    ])[0],
                ),
            por_back: /cp_.+/,
            por_angle: { [optional]: /\d+/ },
            por_scale: { [optional]: /\d+/ },
            por_repos_rate: {
                [optional]: /\d+/,
            },
            por_repos_range: {
                [optional]: /\d+/,
            },
            attacks: { [optional]: /\d+/ },
            effect_count: { [optional]: /\d+/ },
            dc_cond: {
                [optional]: isKeyOf("unlock_cond"),
            },
            delayed_effect_time: {
                [optional]: /\d+/,
            },
            target_update_delay: {
                [optional]: /\d+/,
            },
            store_loc: {
                [optional]: isKeyOf("text_lists", "shop_loc"),
            },
            ab_target: { [optional]: /\d+/ },
            ab_type: { [optional]: /\d+/ },
            ab_attach_mount_type: {
                [optional]: /\d+/,
            },
            ab_attach_anim: {
                [optional]: isAttachAnim,
            },
            ab_comms_hos: {
                [optional]: isHostileAbilityComms,
            },
            ab_comms_ally: {
                [optional]: isAllyAbilityComms,
            },
            ab_comms_pl: {
                [optional]: isPlayerAbilityComms,
            },
            speaker: {
                [optional]: /(?:fab)|(?:hang)|(?:cmd)/,
            },
            srm_drop: { [optional]: /\d+/ },
            jump_fx: { [optional]: /[1-4]/ },
            gun_mounts: { [optional]: /\d+/ },
            death_fx_power: {
                [optional]: /\d+/,
            },
            death_total: { [optional]: /\d+/ },
            death_time_max: {
                [optional]: /\d+/,
            },
            deck_group: { [optional]: /\d+/ },
            comms: { [optional]: isCommsPrefix },
            boss_up: { [optional]: isDongle },
            up_gp: { [optional]: isDongle },
        },
    }),
    prerequisites: ["comms", "text_lists", "unlock_cond", "upgrades"],
}

/**
 * Definition of all Cards that appear in game
 */
export type Cards = Record<string, Card>;
/**
 * Card text or other custom behavior.
 *
 * @remarks
 * For more information: https://wishgranter.dev/mod-docs/card-effects/
 */
export interface CardEffect {
    effect_type: number;
    effect_status?: number;
    effect_variant?: number;
    effect_power?: number;
    effect_anim?: string;
    effect_force_anim?: number;
    effect_cmd_id?: string;
    effect_cmd_comms?: string;
    effect_cmd_tier?: number;
    effect_cmd_ability?: number;
    effect_card_id?: string;
    effect_card_convert?: string;
    effect_card_list?: string;
    effect_card_text?: string;
    effect_up_list?: string;
    effect_status_target?: number;
}
export interface Card extends Record<`effect_${number}`, CardEffect> {
    /**
     * Name as it appears in game
     */
    name: string;
    /**
     * Flavor text as it appears in the data cloud or on right click. "0" for none.
     */
    data: string;
    dmg: number;
    faction: string;
    por_obj: `obj_${"unit" | "ab"}_${string}`;
    /**
     * Background to render sprite on when card is in hand or deck
     */
    por_back: `cp_${string}`;
    por_angle?: number;
    por_scale?: number;
    por_repos_rate?: number;
    por_repos_range?: number;
    attacks?: number;
    /**
     * If more effects are defined then specified, those effects will not be used. Good for comments.
     */
    effect_count?: number;
    /**
     * Unlock Condition
     */
    dc_cond?: string;
    delayed_effect_time?: number;
    target_update_delay?: number;
}
export interface PlayerCard extends Card {
    /**
     * Id of text list to pull from when this card appears in shops / escalation mechanism
     */
    store_loc: string;
    /** Priority of card when in deck view. Lower numbers appear first */
    deck_group?: number;
}
export interface Unit extends Card {
    /**
     * How the game knows this card can be placed on the board
     */
    type: 1;
    /**
     * Base hull
     */
    hp: number;
    /**
     * How much of an orbit this unit takes up
     */
    size: 1 | 2 | 3;
    timer: number;
    por_obj: `obj_unit_${string}`;
    srm_drop?: number;
    jump_fx?: 1 | 2 | 3 | 4;
    gun_mounts?: number;
    death_fx_power?: 1 | 2 | 3 | 4 | 5;
    death_total?: 1;
    death_time_max?: number;
    /**
     * prefix to add to events to get the ids of entries in Comms
     */
    comms?: string;
}
export interface EnemyUnit extends Unit {
    por_obj: `obj_unit_hos`;
    /**
     * If unit is a boss, this dongle will be applied to
     */
    boss_up?: string;
    /**
     * Name as it appears in endless mode
     */
    name_gp?: string;
    /**
     * Id of dongle to apply in endless mode
     */
    up_gp?: string;
}
export interface PlayerUnit extends PlayerCard, Unit { por_obj: `obj_unit_${string}`; }
export interface Ability extends PlayerCard {
    type: 2;
    por_obj: `obj_ab_${string}`;
    ab_target: number;
    ab_type?: number;
    ab_attach_mount_type?: number;
    ab_attach_anim?: string;
    ab_comms_hos?: `ab_${string}_hos`;
    ab_comms_ally?: `ab_${string}_ally`;
    ab_comms_pl?: `ab_${string}_pl`;
    speaker?: string;
}

export const isPlayerCard = isKeyOf("cards", {
    store_loc: isKeyOf("text_lists", "store_loc"),
});
export const isAbilityCard = isKeyOf("cards", { type: /2/ });
function isAttachAnim(id: string): boolean {
    return /ab_.+/.test(id);
}
