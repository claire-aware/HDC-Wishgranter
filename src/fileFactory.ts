import type { ModEntry } from "./mod_menu/modEntry.ts";
import type { LoadSequenceElement } from "./mod_menu/loadingBar.ts";
import type { Code0Adjuster } from "./mods/mod.ts";
import type { RuntimeScene } from "./gdjs.js";
import {
    type CardAnimations,
    manifest as card_animations_manifest,
} from "./json_factories/card_animations.ts";
import {
    type Barks,
    manifest as comms_manifest,
} from "./json_factories/comms.ts";
import {
    type Cards,
    manifest as cards_manifest,
} from "./json_factories/cards.ts";
import {
    type Encounters,
    manifest as encounters_manifest,
} from "./json_factories/encounters.ts";
import {
    type LootListUp,
    manifest as loot_list_up_manifest,
} from "./json_factories/loot_list_up.ts";
import {
    type TextLists,
    manifest as text_lists_manifest,
} from "./json_factories/text_lists.ts";
import {
    type Upgrades,
    manifest as upgrades_manifest,
} from "./json_factories/upgrades.ts";
import {
    type LootListCard,
    manifest as loot_list_card_manifest,
} from "./json_factories/loot_list_card.ts";
import {
    type BaselineUpgrades,
    manifest as sp_up_manifest,
} from "./json_factories/sp_up.ts";
import {
    type UnlockCond,
    manifest as unlock_cond_manifest,
} from "./json_factories/unlock_cond.ts";
import { type Data, manifest as data_manifest } from "./json_factories/data.ts";
import {
    type ModMetadata,
    manifest as metadata_manifest,
} from "./json_factories/metadata.ts";
import {
    type Tutorials,
    manifest as tutorials_manifest,
} from "./json_factories/tutorials.ts";
import {
    type CloudLabels,
    manifest as cloud_labels_manifest,
} from "./json_factories/cloud_labels.ts";
import {
    type Credits,
    manifest as credits_manifest,
} from "./json_factories/credits.ts";
import {
    type Tooltips,
    manifest as tooltips_manifest,
} from "./json_factories/tooltips.ts";
import {
    type Factions,
    manifest as factions_manifest,
} from "./json_factories/factions.ts";

export const optional = Symbol("optional");
export const array = Symbol("array");
export const value = Symbol("value");
export const default_value = Symbol("default_value");
export const records = Symbol("record");
export const record = Symbol("record");
export const key = Symbol("key");
export const validator = Symbol("validator");

export interface JsonManifest {
    comms: Barks;
    cards: Cards;
    encounters: Encounters;
    loot_list_up: LootListUp;
    text_lists: TextLists;
    tutorials: Tutorials;
    upgrades: Upgrades;
    cloud_labels: CloudLabels;
    credits: Credits;
    loot_list_card: LootListCard;
    sp_up: BaselineUpgrades;
    tooltips: Tooltips;
    unlock_cond: UnlockCond;
    data: Data;
    card_animations: CardAnimations;
    metadata: ModMetadata;
    factions: Factions;
}

export type JsonProcessingTemplate =
    | {
          [key]: RegExp | ((id: string) => boolean);
          [value]: JsonProcessingTemplateWithoutDefaults;
      }
    | {
          [key]: RegExp | ((id: string) => boolean);
          [value]: JsonProcessingTemplateWithoutDefaults;
      }[]
    | ({
          [records]: {
              [key]: RegExp | ((id: string) => boolean);
              [value]: JsonProcessingTemplateWithoutDefaults;
          }[];
      } & { [key: string]: JsonProcessingTemplate })
    | ({
          [record]: {
              [key]: RegExp | ((id: string) => boolean);
              [value]: JsonProcessingTemplateWithoutDefaults;
          };
      } & { [key: string]: JsonProcessingTemplate })
    | { [key: string]: JsonProcessingTemplate }
    | { [array]: JsonProcessingTemplateWithoutDefaults }
    | { [optional]: JsonProcessingTemplateWithoutDefaults }
    | {
          [validator]: RegExp | ((id: string) => boolean);
          [default_value]: string | number;
      };
type JsonProcessingTemplateWithoutDefaults =
    | {
          [key]: RegExp | ((id: string) => boolean);
          [value]: JsonProcessingTemplateWithoutDefaults;
      }
    | {
          [key]: RegExp | ((id: string) => boolean);
          [value]: JsonProcessingTemplateWithoutDefaults;
      }[]
    | ((
          | {
                [records]: {
                    [key]: RegExp | ((id: string) => boolean);
                    [value]: JsonProcessingTemplateWithoutDefaults;
                }[];
            }
          | {
                [record]: {
                    [key]: RegExp | ((id: string) => boolean);
                    [value]: JsonProcessingTemplateWithoutDefaults;
                };
            }
          | object
      ) & { [key: string]: JsonProcessingTemplateWithoutDefaults })
    | { [array]: JsonProcessingTemplateWithoutDefaults }
    | { [optional]: JsonProcessingTemplateWithoutDefaults }
    | RegExp
    | ((id: string) => boolean);

type JsonObjectFromTemplate<
    Template extends
        | JsonProcessingTemplate
        | JsonProcessingTemplateWithoutDefaults,
> =
    Template extends (
        {
            [validator]: (id: string) => boolean;
            [default_value]: string | number;
        }
    ) ?
        Template[typeof default_value]
    : Template extends (id: string) => boolean ? string | number
    : Template extends { [array]: JsonProcessingTemplateWithoutDefaults } ?
        JsonObjectFromTemplate<Template[typeof array]>[]
    : Template extends { [optional]: JsonProcessingTemplateWithoutDefaults } ?
        JsonObjectFromTemplate<Template[typeof optional]> | undefined
    : Template extends (
        {
            [key]: (id: string) => boolean;
            [value]: JsonProcessingTemplateWithoutDefaults;
        }
    ) ?
        Record<string, Template[typeof value]>
    : Template extends (
        {
            [key]: (id: string) => boolean;
            [value]: JsonProcessingTemplateWithoutDefaults;
        }[]
    ) ?
        Record<string, Template[number][typeof value]>
    : Template extends (
        {
            [record]: {
                [key]: (id: string) => boolean;
                [value]: JsonProcessingTemplateWithoutDefaults;
            };
        }
    ) ?
        Record<string, Template[typeof record][typeof value]> & {
            [Key in Exclude<
                typeof record,
                keyof Template
            >]: JsonObjectFromTemplate<Template[Key]>;
        }
    : Template extends (
        {
            [records]: {
                [key]: (id: string) => boolean;
                [value]: JsonProcessingTemplateWithoutDefaults;
            }[];
        }
    ) ?
        Record<string, Template[typeof records][number][typeof value]> & {
            [Key in Exclude<
                typeof records,
                keyof Template
            >]: JsonObjectFromTemplate<Template[Key]>;
        }
    : Template extends Record<string, JsonProcessingTemplateWithoutDefaults> ?
        { [Key in keyof Template]: JsonObjectFromTemplate<Template[Key]> }
    :   never;

export function isKeyOf(
    json_name: keyof JsonManifest,
    subpath_or_format?:
        | string
        | JsonProcessingTemplate
        | JsonProcessingTemplateWithoutDefaults,
): (id: string) => boolean;
export function isKeyOf(
    json_name: keyof JsonManifest,
    subpath: string,
    format: JsonProcessingTemplate | JsonProcessingTemplateWithoutDefaults,
): (id: string) => boolean;
export function isKeyOf(
    json_name: keyof JsonManifest,
    subpath_or_of_type?:
        | string
        | JsonProcessingTemplate
        | JsonProcessingTemplateWithoutDefaults,
    of_type?: JsonProcessingTemplate | JsonProcessingTemplateWithoutDefaults,
): (id: string) => boolean {
    if (!cachedJsons[json_name]) return () => false;
    const json = cachedJsons[json_name];
    if (!subpath_or_of_type) return (id) => Object.hasOwn(json, id);
    if (!(typeof subpath_or_of_type == "string"))
        return (id) =>
            Object.hasOwn(json, id) &&
            validateObjectFromTemplate(
                json[id as keyof typeof json],
                subpath_or_of_type,
            );
    const object_with_key = subpath_or_of_type
        .split("/")
        .reduce((result, key) => result[key as keyof typeof result], json);
    return (id) =>
        Object.hasOwn(object_with_key, id) &&
        (!of_type ||
            validateObjectFromTemplate(
                object_with_key[id as keyof typeof object_with_key],
                of_type,
            ));
}

export type JsonProcessingManifest = {
    [key in keyof JsonManifest]: {
        prerequisites?: (keyof JsonManifest)[];
        reasonable_default: JsonManifest[key];
        sources: {
            [SubKey in keyof JsonManifest]?: {
                validator: (test_string: string) => boolean;
                extractor: (test_string: string) => JsonManifest[key];
            };
        } & {
            "code0.js"?: {
                extractor: (
                    event_list: (runtime_scene: RuntimeScene) => void,
                ) => JsonManifest[key];
            };
        };
        merger: (
            a: JsonManifest[key],
            b: Partial<JsonManifest[key]>,
        ) => JsonManifest[key];
        application?: JsonProcessingApplication<JsonManifest[key]>;
    };
};

type JsonProcessingApplication<
    Target extends JsonManifest[keyof JsonManifest],
    AdditionalSources extends (keyof JsonManifest)[] = (keyof JsonManifest)[],
> = {
    [SubKey in keyof JsonManifest]?:
        | ((source: Target) => JsonManifest[SubKey])
        | {
              additional_sources: AdditionalSources;
              applicator: (
                  source: Target,
                  ...additional_sources: JsonManifest[AdditionalSources[number]][]
              ) => JsonManifest[SubKey];
          };
} & {
    code0?:
        | ((source: Target) => Code0Adjuster)
        | {
              additional_sources: `${keyof JsonManifest}.json`[];
              applicator: (
                  source: Target,
                  ...additional_sources: JsonManifest[keyof JsonManifest][]
              ) => Code0Adjuster;
          };
};

function getReasonableDefault<ListTemplate extends JsonProcessingTemplate>(
    list_template: ListTemplate,
): JsonObjectFromTemplate<ListTemplate> {
    // Unpack collections
    if (Object.hasOwn(list_template, optional)) {
        return undefined as JsonObjectFromTemplate<ListTemplate>;
    }
    if (Object.hasOwn(list_template, array)) {
        return [] as unknown as JsonObjectFromTemplate<ListTemplate>;
    }

    if (Object.hasOwn(list_template, default_value)) {
        return (list_template as { [default_value]: string })[
            default_value
        ] as JsonObjectFromTemplate<ListTemplate>;
    }

    return Object.fromEntries(
        Object.getOwnPropertyNames(list_template)
            .filter(
                (property_name) =>
                    !(
                        optional in
                        list_template[property_name as keyof unknown]
                    ),
            )
            .map((property_name) => [
                property_name,
                getReasonableDefault(
                    list_template[property_name as keyof unknown],
                ),
            ]),
    ) as unknown as JsonObjectFromTemplate<ListTemplate>;
}

export function getManifestEntry<
    Key extends keyof JsonManifest,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    ListTemplate extends JsonProcessingTemplate,
>(json_name: Key, list_template: ListTemplate): JsonProcessingManifest[Key] {
    return {
        reasonable_default: getReasonableDefault(
            list_template,
        ) as JsonManifest[Key],
        sources: {
            [json_name]: {
                validator: getManifestValidator(list_template),
                extractor: getManifestExtractor(list_template),
            },
        },
        merger: mergeDeep,
    } as JsonProcessingManifest[Key];
}

function getManifestValidator(
    list_template: JsonProcessingTemplate,
): (test_string: string) => boolean {
    return (json_text) => {
        try {
            const parsed_json = JSON.parse(json_text) as unknown;
            return validateObjectFromTemplate(parsed_json, list_template);
        } catch (err: unknown) {
            console.warn("Invalid Json:", err);
            return false;
        }
    };
}

function validateObjectFromTemplate(
    object_to_validate: unknown,
    list_template:
        | JsonProcessingTemplate
        | JsonProcessingTemplateWithoutDefaults,
): boolean {
    {
        // Remove syntactic sugar
        if (Array.isArray(list_template)) {
            return validateObjectFromTemplate(object_to_validate, {
                [records]: list_template,
            });
        }
        if (record in list_template) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [record]: _omitted, ...exceptions } = list_template;
            return validateObjectFromTemplate(object_to_validate, {
                [records]: [list_template[record]],
                ...exceptions,
            });
        }
        if (key in list_template) {
            return validateObjectFromTemplate(object_to_validate, {
                [records]: [list_template],
            });
        }
    }

    {
        // Unpack collections
        if (optional in list_template) {
            return (
                object_to_validate == undefined ||
                validateObjectFromTemplate(
                    object_to_validate,
                    list_template[optional],
                )
            );
        }
        if (array in list_template) {
            if (!Array.isArray(object_to_validate)) return false;
            return object_to_validate.every((element: unknown) =>
                validateObjectFromTemplate(element, list_template[array]),
            );
        }
        if (records in list_template) {
            return (
                Object.getOwnPropertyNames(object_to_validate).every(
                    (property_name) => {
                        if (property_name in list_template)
                            return validateObjectFromTemplate(
                                (object_to_validate as Record<string, unknown>)[
                                    property_name as keyof unknown
                                ],

                                list_template[property_name as keyof unknown],
                            );
                        else
                            return list_template[records].some(
                                (record) =>
                                    (typeof record[key] == "function" ?
                                        record[key](property_name)
                                    :   record[key].test(property_name)) &&
                                    validateObjectFromTemplate(
                                        (
                                            object_to_validate as Record<
                                                string,
                                                unknown
                                            >
                                        )[property_name],
                                        record[value],
                                    ),
                            );
                    },
                ) &&
                Object.getOwnPropertyNames(list_template)

                    .filter(
                        (property_name) =>
                            !(
                                optional in
                                list_template[property_name as keyof unknown]
                            ),
                    )
                    .every(
                        (property_name) =>
                            (object_to_validate as Record<string, unknown>)[
                                property_name
                            ] != undefined,
                    )
            );
        }
    }

    if (validator in list_template) {
        return (
            list_template as { [validator]: (id_or_object: string) => boolean }
        )[validator](object_to_validate as string);
    }

    return Object.getOwnPropertyNames(list_template).every(
        (property_name) =>
            (property_name in (object_to_validate as Record<string, unknown>) ||
                Object.hasOwn(
                    list_template[property_name as keyof unknown],
                    "optional",
                )) &&
            validateObjectFromTemplate(
                (object_to_validate as Record<string, unknown>)[property_name],
                list_template[property_name as keyof unknown],
            ),
    );
}

function getManifestExtractor<ListTemplate extends JsonProcessingTemplate>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _list_template: ListTemplate,
): (json: string) => JsonObjectFromTemplate<ListTemplate> {
    return (test_string) => {
        return JSON.parse(test_string) as JsonObjectFromTemplate<ListTemplate>;
    };
}

function mergeDeep<MergeTarget = object>(
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

export const json_manifest: JsonProcessingManifest = {
    comms: comms_manifest,
    cards: cards_manifest,
    encounters: encounters_manifest,
    loot_list_up: loot_list_up_manifest,
    text_lists: text_lists_manifest,
    tutorials: tutorials_manifest,
    upgrades: upgrades_manifest,
    cloud_labels: cloud_labels_manifest,
    credits: credits_manifest,
    loot_list_card: loot_list_card_manifest,
    sp_up: sp_up_manifest,
    tooltips: tooltips_manifest,
    unlock_cond: unlock_cond_manifest,
    data: data_manifest,
    metadata: metadata_manifest,
    card_animations: card_animations_manifest,
    factions: factions_manifest,
};

const cachedJsons: Partial<JsonManifest> = {};
export function getCachedJson<JsonName extends keyof JsonManifest>(
    json_name: JsonName,
): JsonManifest[JsonName] {
    if (!cachedJsons[json_name])
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
                            function: integrateJson.bind(
                                {},
                                json_name as keyof JsonManifest,
                                mod_entry,
                            ),
                        };
                    },
                ),
        };
    });
}
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function integrateJson<Key extends keyof JsonManifest>(
    json_name: Key,
    mod_entry: ModEntry,
) {
    cachedJsons[json_name] = json_manifest[json_name].merger(
        cachedJsons[json_name] ?? json_manifest[json_name].reasonable_default,
        mod_entry.getCachedJsons()[json_name] ??
            json_manifest[json_name].reasonable_default,
    );
}

function getLoadingSequenceToApplyCachedJsons() {
    return Object.getOwnPropertyNames(cachedJsons).map((json_name) => {
        return {
            status_text: `Applying ${json_name}`,
            function: () => {
                return Object.getOwnPropertyNames(
                    json_manifest[json_name as keyof JsonManifest].application,
                ).map((file_to_apply_to) => {
                    return {
                        status_text: `Applying ${json_name} to ${file_to_apply_to}`,
                        function: applyJson.bind(
                            {},
                            json_name as keyof JsonManifest,
                            file_to_apply_to as keyof JsonManifest,
                        ),
                    };
                });
            },
        };
    });
}

function applyJson<
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    Key extends keyof JsonManifest,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    OutputKey extends keyof JsonManifest,
>(json_name: Key, file_to_apply_to: OutputKey) {
    const application =
        json_manifest[json_name].application?.[file_to_apply_to];
    if (!application) return;
    if (typeof application == "function") {
        cachedJsons[file_to_apply_to] = (
            application as (
                source: JsonManifest[Key],
            ) => JsonManifest[OutputKey]
        )(
            cachedJsons[json_name] ??
                json_manifest[json_name].reasonable_default,
        );
    } else {
        cachedJsons[file_to_apply_to] = (
            application.applicator as (
                source: JsonManifest[Key],
                ...additional_sources: JsonManifest[keyof JsonManifest][]
            ) => JsonManifest[OutputKey]
        )(
            cachedJsons[json_name] ??
                json_manifest[json_name].reasonable_default,
            ...application.additional_sources.map((additional_source) => {
                return (
                    cachedJsons[additional_source] ??
                    json_manifest[additional_source].reasonable_default
                );
            }),
        );
    }
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
                                document.getElementById("mod_list")?.children ??
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
function mapEnabledModEntries<Out>(mapper: (mod: ModEntry) => Out): Out[] {
    return (
        Array.from(
            document.getElementById("mod_list")?.children ?? [],
        ) as ModEntry[]
    )
        .filter((mod_entry) => mod_entry.enabled)
        .map(mapper);
}
