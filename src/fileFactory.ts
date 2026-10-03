import type { JsonManifest } from "./jsons.d.ts";
import type { ModEntry } from "./mod_menu/modEntry.ts";
import type { LoadSequenceElement } from "./mod_menu/loadingBar.ts";
import type { Code0Adjuster } from "./mods/mod.ts";
import type { RuntimeScene } from "./gdjs.js";
import { apply_data_from_card_animations } from "./json_factories/card_animations.ts";

type JsonProcessingManifest = {
    [key in keyof JsonManifest as `${key}.json`]: {
        prerequisites?: `${keyof JsonManifest}.json`[];
        sources: JsonProcessingSources<JsonManifest[key]>;
        merger: JsonProcessingMerger<JsonManifest[key]>;
        application?: JsonProcessingApplication<JsonManifest[key]>;
    };
};

type JsonProcessingSources<Target extends JsonManifest[keyof JsonManifest]> = {
    [subkey in keyof JsonManifest as `${subkey}.json`]?: JsonProcessingSource<Target>;
} & {
    "code0.js"?: {
        extractor: (
            event_list: (runtime_scene: RuntimeScene) => void,
        ) => Target;
    };
};

interface JsonProcessingSource<
    Target extends JsonManifest[keyof JsonManifest],
> {
    validator: JsonProcessingValidator;
    extractor: JsonProcessingExtractor<Target>;
}

export type JsonProcessingValidator = (test_string: string) => boolean;

export type JsonProcessingExtractor<
    Target extends JsonManifest[keyof JsonManifest],
> = (test_string: string) => Target;

export type JsonProcessingMerger<
    Target extends JsonManifest[keyof JsonManifest],
> = (a: Target, b: Target) => Target;

export type JsonProcessingApplication<
    Target extends JsonManifest[keyof JsonManifest],
    AdditionalSources extends (keyof JsonManifest)[] = (keyof JsonManifest)[],
> = {
    [subkey in keyof JsonManifest as `${subkey}.json`]?:
    | ((source: Target) => JsonManifest[subkey])
    | {
        additional_sources: AdditionalSources;
        applicator: (
            source: Target,
            ...aditional_sources: JsonManifest[AdditionalSources[number]][]
        ) => JsonManifest[subkey];
    };
} & {
    "code0.js"?:
    | ((source: Target) => Code0Adjuster)
    | {
        additional_sources: `${keyof JsonManifest}.json`[];
        applicator: (
            source: Target,
            ...aditional_sources: JsonManifest[keyof JsonManifest][]
        ) => Code0Adjuster;
    };
};

type JsonProcessingTemplate<
    Target,
    TargetKey extends string = string,
    TargetValue = unknown,
> =
    Target extends undefined ?
    {
        optional: true;
        value: JsonProcessingTemplate<Exclude<Target, undefined>>;
    }
    : Target extends TargetValue[] ?
    { array: true; value: JsonProcessingTemplate<TargetValue> }
    : Target extends string | number ? (id_or_object: string) => boolean
    : Target extends Record<TargetKey, TargetValue> ?
    | JsonProcessingTemplateRecord<TargetValue>
    | JsonProcessingTemplateRecord<TargetValue>[]
    | {
        record: JsonProcessingTemplateRecord<TargetValue>;
        exceptions: JsonProcessingTemplateObject<Target>;
    }
    | {
        records: JsonProcessingTemplateRecord<TargetValue>[];
        exceptions: JsonProcessingTemplateObject<Target>;
    }
    : JsonProcessingTemplateObject<Target>;

interface JsonProcessingTemplateRecord<Target> {
    key: (id: string) => boolean;
    value: JsonProcessingTemplate<Target>;
}
type JsonProcessingTemplateObject<Target> = {
    [Key in keyof Required<Target>]: JsonProcessingTemplate<Target[Key]>;
};

export const json_manifest: JsonProcessingManifest = {
    "comms.json": getManifestEntry("comms", {
        key: /.*/.test,
        value: { key: /text_\d+/.test, value: /.*/.test },
    }),
    "cards.json": {
        ...getManifestEntry("cards", {
            key: /.*/.test,
            value: {
                record: {
                    key: /effect_\d+/.test,
                    value: {
                        effect_type: /\d+/.test,
                        effect_status: { optional: true, value: /\d+/.test },
                        effect_variant: { optional: true, value: /\d+/.test },
                        effect_power: { optional: true, value: /\d+/.test },
                        effect_anim: { optional: true, value: /.*/.test },
                        effect_force_anim: {
                            optional: true,
                            value: /\d+/.test,
                        },
                        effect_cmd_id: { optional: true, value: /.*/.test },
                        effect_cmd_comms: { optional: true, value: /.*/.test },
                        effect_cmd_tier: { optional: true, value: /\d+/.test },
                        effect_cmd_ability: {
                            optional: true,
                            value: /\d+/.test,
                        },
                        effect_card_id: { optional: true, value: /.*/.test },
                        effect_card_convert: {
                            optional: true,
                            value: /.*/.test,
                        },
                        effect_card_list: { optional: true, value: /.*/.test },
                        effect_card_text: { optional: true, value: /.*/.test },
                        effect_up_list: { optional: true, value: /.*/.test },
                        effect_status_target: {
                            optional: true,
                            value: /\d+/.test,
                        },
                    },
                    exceptions: {
                        name: /.*/.test,
                        name_gp: { optional: true, value: /.*/.test },
                        type: /1|2/.test,
                        data: /.*/.test,
                        hp: { optional: true, value: /\d+/.test },
                        size: { optional: true, value: /1|2|3/.test },
                        dmg: /\d+/.test,
                        faction: isFaction,
                        por_obj: (id: string) =>
                            isFaction(
                                (/(?<=^obj_(?:(?:unit)|(?:ab))_).+/.exec(
                                    id,
                                ) ?? [""])[0],
                            ),
                        por_back: /cp_.+/.test,
                        por_angle: { optional: true, value: /\d+/.test },
                        por_scale: { optional: true, value: /\d+/.test },
                        por_repos_rate: { optional: true, value: /\d+/.test },
                        por_repos_range: { optional: true, value: /\d+/.test },
                        attacks: { optional: true, value: /\d+/.test },
                        effect_count: { optional: true, value: /\d+/.test },
                        dc_cond: { optional: true, value: isDcCond },
                        delayed_effect_time: {
                            optional: true,
                            value: /\d+/.test,
                        },
                        target_update_delay: {
                            optional: true,
                            value: /\d+/.test,
                        },
                        store_loc: { optional: true, value: isStoreLocation },
                        ab_target: { optional: true, value: /\d+/.test },
                        ab_type: { optional: true, value: /\d+/.test },
                        ab_attach_mount_type: {
                            optional: true,
                            value: /\d+/.test,
                        },
                        ab_attach_anim: { optional: true, value: isAttachAnim },
                        ab_comms_hos: {
                            optional: true,
                            value: isHostileAbilityComms,
                        },
                        ab_comms_ally: {
                            optional: true,
                            value: isAllyAbilityComms,
                        },
                        ab_comms_pl: {
                            optional: true,
                            value: isPlayerAbilityComms,
                        },
                        speaker: {
                            optional: true,
                            value: /(?:fab)|(?:hang)|(?:cmd)/.test,
                        },
                        srm_drop: { optional: true, value: /\d+/.test },
                        jump_fx: { optional: true, value: /[1-4]/.test },
                        gun_mounts: { optional: true, value: /\d+/.test },
                        death_fx_power: { optional: true, value: /\d+/.test },
                        death_total: { optional: true, value: /\d+/.test },
                        death_time_max: { optional: true, value: /\d+/.test },
                        deck_group: { optional: true, value: /\d+/.test },
                        comms: { optional: true, value: isCommsPrefix },
                        boss_up: { optional: true, value: isDongle },
                        up_gp: { optional: true, value: isDongle },
                    },
                },
            },
        }),
        prerequisites: [
            "comms.json",
            "text_lists.json",
            "unlock_cond.json",
            "upgrades.json",
        ],
    },
    "encounters.json": {
        ...getManifestEntry("encounters", {
            key: /.*/.test,
            value: {
                record: {
                    key: /wave\d+/.test,
                    value: {
                        record: {
                            key: /variant\d+/.test,
                            value: {
                                key: /o[0-3]_unit\d+/.test,
                                value: isCard,
                            },
                        },
                        exceptions: {
                            wave_rand: /\d+/.test,
                            wave_music: { optional: true, value: /\d+/.test },
                            wave_screen_text: {
                                optional: true,
                                value: /.*/.test,
                            },
                        },
                    },
                },
                exceptions: { comment_wave_enemies: /.*/.test },
            },
        }),
        prerequisites: ["cards.json"],
    },
    "loot_list_up.json": {
        ...getManifestEntry("loot_list_up", {
            fleet: {
                records: [
                    {
                        key: isFaction,
                        value: { array: true, value: isFleetUpgrade },
                    },
                ],
                exceptions: {
                    boss: { array: true, value: isFleetUpgrade },
                    glo: { array: true, value: isFleetUpgrade },
                },
            },
            up: {
                records: [
                    {
                        key: isFaction,
                        value: { array: true, value: isDongle },
                    },
                ],
                exceptions: {
                    glo: { array: true, value: isDongle },
                },
            },
            start: {
                key: isFaction,
                value: {
                    gen: { array: true, value: isStartingUpgrade },
                    stat: { array: true, value: isStartingUpgrade },
                },
            },
        }),
        prerequisites: ["upgrades.json"],
    },
    "text_lists.json": getManifestEntry("text_lists", {
        shop_loc: { key: /.*/.test, value: /.*/.test },
        con_insult: {
            adj: { array: true, value: /.*/.test },
            noun: { array: true, value: /.*/.test },
        },
        gp: {
            corp_1: { array: true, value: /[A-Z]*/.test },
            corp_2: { array: true, value: /[A-Z]*/.test },
            leg: { array: true, value: /[A-Z]*/.test },
        },
    }),
    "tutorials.json": getManifestEntry("tutorials", {
        key: /tut_.+/.test,
        value: { txt: /.*/.test },
    }),
    "upgrades.json": getManifestEntry("upgrades", [
        {
            key: /fl_(?:(?:boss)|(?:glo)|.+)_.+/.test,
            value: { header: /.*/.test, txt: /.*/.test, txt_equip: /.*/.test },
        },
        {
            key: /up_.+/.test,
            value: { header: /.*/.test, txt: /.*/.test },
        },
        {
            key: /up_start_.*/.test,
            value: { icon: /.*/.test, icon_prio: /\d+/.test },
        },
    ]),
    "cloud_lablels.json": getManifestEntry("cloud_lablels", {
        key: /.*/.test,
        value: { txt: /.*/.test, size: /\d+/.test },
    }),
    "credits.json": getManifestEntry("credits", {
        key: /\d+/.test,
        value: { txt: /.*/.test, size: /\d+/.test },
    }),
    "loot_list_card.json": {
        ...getManifestEntry("loot_list_card", {
            record: {
                key: isFaction,
                value: {
                    shp: { array: true, value: isPlayerCard },
                    tch: { array: true, value: isAbilityCard },
                    str: { array: true, value: isPlayerCard },
                    use: { array: true, value: isAbilityCard },
                    shp_combo: { key: isFaction, value: isPlayerCard },
                    tch_combo: { key: isFaction, value: isAbilityCard },
                },
            },
            exceptions: {
                start: {
                    defense: { array: true, value: isAbilityCard },
                    damage: { array: true, value: isAbilityCard },
                    buff: { array: true, value: isAbilityCard },
                    control: { array: true, value: isAbilityCard },
                    const: { array: true, value: isPlayerCard },
                },
            },
        }),
        prerequisites: ["cards.json"],
    },
    "sp_up.json": {
        ...getManifestEntry("sp_up", {
            key: isPlayerCard,
            value: { key: /.*/.test, value: /\d+/.test },
        }),
        prerequisites: ["cards.json"],
    },
    "tooltips.json": getManifestEntry("tooltips", {
        key: /.*/.test,
        value: { header: /.*/.test, txt: /.*/.test, suf: /.*/.test },
    }),
    "unlock_cond.json": getManifestEntry("unlock_cond", {
        key: /.*/.test,
        value: { cond: /.*/.test, unlock: /.*/.test },
    }),
    "data.json": { sources: {}, merger: mergeDeep },
    "metadata.json": getManifestEntry("metadata", {
        name: /.*/.test,
        description: { optional: true, value: /.*/.test },
        icon_path: { optional: true, value: /.*/.test },
        version: { optional: true, value: /\d+\.\d+\.\d+/.test },
    }),
    "card_animations.json": {
        ...getManifestEntry("card_animations", {
            sprites: { array: true, value: /.*/.test },
            collison_polygon: {
                array: true,
                value: { x: /\d+/.test, y: /\d+/.test },
            },
            frame_order: {
                optional: true,
                value: { array: true, value: /\d+/.test },
            },
            points: {
                record: {
                    key: /.*/.test,
                    value: { x: /\d+/.test, y: /\d+/.test },
                },
                exceptions: {
                    origin: { x: /\d+/.test, y: /\d+/.test },
                    center: { x: /\d+/.test, y: /\d+/.test },
                },
            },
        }),
        application: apply_data_from_card_animations,
        prerequisites: ["cards.json"],
    },
};

function getManifestEntry<key extends keyof JsonManifest>(
    json_name: key,
    list_template: JsonProcessingTemplate<JsonManifest[key]>,
): JsonProcessingManifest[`${key}.json`] {
    return {
        sources: {
            [json_name]: {
                validator: getManifestValidator(list_template),
                extractor:
                    getManifestExtractor<JsonManifest[key]>(list_template),
            },
        },
        merger: mergeDeep,
    };
}

function getManifestValidator<Target extends JsonManifest[keyof JsonManifest]>(
    list_template: JsonProcessingTemplate<Target>,
): JsonProcessingValidator {
    return (json_text) => {
        try {
            const parsed_json = JSON.parse(json_text);
            return validateObjectFromTemplate(parsed_json, list_template);
        } catch (err: unknown) {
            console.warn("Invalid Json:", err);
            return false;
        }
    };
}

function validateObjectFromTemplate<Target>(
    object_to_validate: any,
    list_template: JsonProcessingTemplate<Target>,
): boolean {
    if (typeof list_template == "function") {
        return list_template(String(object_to_validate));
    }
    if (Array.isArray(list_template)) {
        return validateObjectFromTemplate<unknown>(object_to_validate, { records: list_template, exceptions: {} })
    }
    if (list_template.record != undefined) { return validateObjectFromTemplate(object_to_validate, { records: [list_template.record], exceptions: list_template.exceptions }) }
    if (list_template.key != undefined) {
        return validateObjectFromTemplate<unknown>(object_to_validate, { records: [list_template], exceptions: {} })
    }
    if (list_template.optional != undefined) {
        return object_to_validate == undefined || validateObjectFromTemplate(object_to_validate, list_template.value)
    }
    if (list_template.array != undefined) {
        if (!Array.isArray(object_to_validate)) return false
        return object_to_validate.every((element: unknown) =>
            validateObjectFromTemplate(element, list_template.value),
        );
    }
    if (list_template.records != undefined) {

        return Object.getOwnPropertyNames(object_to_validate).every((property_name) => {
            if (list_template.exceptions[property_name] != undefined) return validateObjectFromTemplate(object_to_validate[property_name], list_template.exceptions[property_name])
            else return list_template.records.any((record: JsonProcessingTemplateRecord<unknown>) => record.key(property_name) && validateObjectFromTemplate(object_to_validate[property_name], record.value))
        }) && Object.getOwnPropertyNames(list_template.exceptions).filter((property_name) => !list_template.exceptions[property_name].optional).every((property_name) => object_to_validate[property_name] != undefined)
    }
    return Object.getOwnPropertyNames(list_template).every((property_name) => {
        if (!Object.hasOwn(object_to_validate, property_name) && !Object.hasOwn(list_template[property_name], "optional")) return false
        return validateObjectFromTemplate(object_to_validate[property_name], list_template[property_name])
    })
}

function getManifestExtractor<Target extends JsonManifest[keyof JsonManifest]>(
    list_template: JsonProcessingTemplate<Target>,
): JsonProcessingExtractor<Target> {
    return () => {
        return {};
    };
}

function mapEnabledModEntries<Out>(mapper: (mod: ModEntry) => Out): Out[] {
    return (
        Array.from(
            document.getElementById("modlist")?.children ?? [],
        ) as ModEntry[]
    )
        .filter((mod_entry) => mod_entry.enabled)
        .map(mapper);
}

function isFaction(id: string): boolean {
    return true;
}
function isCard(id: string): boolean {
    return true;
}
function isPlayerCard(id: string): boolean {
    return true;
}
function isAbilityCard(id: string): boolean {
    return true;
}
function isFleetUpgrade(id: string): boolean {
    return true;
}
function isDongle(id: string): boolean {
    return true;
}

function isStartingUpgrade(id: string): boolean {
    return true;
}

function isDcCond(id: string): boolean {
    return true;
}
function isCommsPrefix(id: string): boolean {
    return true;
}
function isHostileAbilityComms(id: string): boolean {
    return true;
}
function isAllyAbilityComms(id: string): boolean {
    return true;
}
function isPlayerAbilityComms(id: string): boolean {
    return true;
}
function isAttachAnim(id: string): boolean {
    return true;
}

function isStoreLocation(id: string): boolean {
    return true;
}

let cachedJsons:
    | {
        [key in keyof JsonManifest as `${key}.json`]?: JsonManifest[key];
    }
    | undefined = undefined;
export function getCachedJson<JsonName extends keyof JsonManifest>(
    json_name: `${JsonName}.json`,
): JsonManifest[JsonName] {
    if (!cachedJsons?.[json_name])
        throw new ReferenceError(
            "Cached jsons were accessed before jsons were cached",
        );
    return cachedJsons[json_name] as JsonManifest[JsonName];
}
export function getLoadingSequenceToCacheJsons(): LoadSequenceElement[] {
    return getLoadingSequenceToCombineCachedJsons().concat(
        getLoadingSequenceToApplyCachedJsons(),
    );
}
function getLoadingSequenceToCombineCachedJsons() {
    return mapEnabledModEntries((mod_entry) => {
        return {
            status_text: `Integrating ${mod_entry.getName()} 's Jsons`,
            function: () =>
                Object.getOwnPropertyNames(mod_entry.getCachedJsons()).map(
                    (json_name) => {
                        return {
                            status_text: `Integrating ${mod_entry.getName()}'s ${json_name}.json`,
                            function: () => {
                                cachedJsons ??= {};
                                cachedJsons[
                                    json_name as `${keyof JsonManifest}.json`
                                ] = json_manifest[
                                    json_name as `${keyof JsonManifest}.json`
                                ].merger(
                                    cachedJsons[
                                    json_name as `${keyof JsonManifest}.json`
                                    ] ?? {},
                                    mod_entry.getCachedJsons()[
                                    json_name as `${keyof JsonManifest}.json`
                                    ],
                                );
                            },
                        };
                    },
                ),
        };
    });
}
function getLoadingSequenceToApplyCachedJsons() {
    return Object.getOwnPropertyNames(cachedJsons).map((json_name) => {
        return {
            status_text: `Applying ${json_name}`,
            function: () => {
                return Object.getOwnPropertyNames(
                    json_manifest[json_name as `${keyof JsonManifest}.json`]
                        .application,
                ).map((file_to_apply_to) => {
                    return {
                        status_text: `Applying ${json_name} to ${file_to_apply_to}`,
                        function: () => {
                            const application =
                                json_manifest[
                                    json_name as `${keyof JsonManifest}.json`
                                ].application?.[
                                file_to_apply_to as `${keyof JsonManifest}.json`
                                ];
                            if (!application) return;
                            cachedJsons ??= {};
                            if (typeof application == "function") {
                                cachedJsons[
                                    file_to_apply_to as `${keyof JsonManifest}.json`
                                ] = application(
                                    cachedJsons[
                                    json_name as `${keyof JsonManifest}.json`
                                    ],
                                );
                            } else {
                                cachedJsons[
                                    file_to_apply_to as `${keyof JsonManifest}.json`
                                ] = application?.applicator(
                                    cachedJsons[
                                    json_name as `${keyof JsonManifest}.json`
                                    ],
                                    ...application.additional_sources.map(
                                        (additional_source) => {
                                            cachedJsons ??= {};
                                            return cachedJsons[
                                                additional_source
                                            ];
                                        },
                                    ),
                                );
                            }
                        },
                    };
                });
            },
        };
    });
}

let cachedCode: typeof gdjs.CommandCode | undefined = undefined;
export function getCachedCode(): typeof gdjs.CommandCode {
    if (!cachedCode)
        throw new ReferenceError(
            "Cached code0 was accessed before code0 was cached",
        );
    return cachedCode;
}
export function getLoadingSequenceToCacheCodeFromMods(): LoadSequenceElement[] {
    return (
        [
            {
                status_text: "Getting code from base game",
                function: () => {
                    eval(
                        (
                            Array.from(
                                document.getElementById("modlist")?.children ??
                                [],
                            ) as ModEntry[]
                        )
                            .map((mod_entry) => mod_entry.getCode())
                            .reduce((new_code, code) => code + new_code),
                    );
                    cachedCode = gdjs.CommandCode;
                },
            },
        ] as LoadSequenceElement[]
    ).concat(
        mapEnabledModEntries((mod_entry) => {
            return {
                status_text: `Adjusting for ${mod_entry.getName()}`,
                function: async () => {
                    for (const name in cachedCode) {
                        if (!name.startsWith("eventsList")) continue;
                        cachedCode[name as `eventsList${number}`] = (
                            await mod_entry.getCode0Adjustments()
                        )(cachedCode[name as `eventsList${number}`]);
                    }
                },
            };
        }) as LoadSequenceElement[],
    );
}

export function mergeDeep<MergeTarget = object>(
    target: MergeTarget,
    addition?: Partial<MergeTarget>,
): MergeTarget {
    if (addition == undefined) return target;
    if (Array.isArray(target))
        return target
            .map((target_element: { name?: string }) => {
                if (target_element.name == undefined) return target_element;
                return mergeDeep(
                    target_element,
                    (
                        addition as Partial<MergeTarget> & { name?: string }[]
                    ).find((additional_element) => {
                        if (additional_element.name == undefined) return false;
                        return additional_element.name == target_element.name;
                    }),
                );
            })
            .concat(
                (addition as Partial<MergeTarget> & { name?: string }[]).filter(
                    (additional_element) => {
                        if (additional_element.name == undefined) return true;
                        return (
                            target.find((target_element: { name?: string }) => {
                                if (target_element.name == undefined)
                                    return false;
                                return (
                                    target_element.name ==
                                    additional_element.name
                                );
                            }) == undefined
                        );
                    },
                ),
            ) as MergeTarget;
    if (["number", "string", "boolean"].includes(typeof target))
        return addition as MergeTarget;
    const out: Partial<MergeTarget> = {};
    for (const property in target) {
        if (!(property in (addition as object)))
            out[property] = target[property];
        else out[property] = mergeDeep(target[property], addition[property]);
    }

    for (const property in addition) {
        if (property in (target as object)) continue;
        out[property] = addition[property];
    }

    return out as MergeTarget;
}
