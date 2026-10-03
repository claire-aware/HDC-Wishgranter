import type {
    Cards,
    Encounters,
    Comms,
    Tutorials,
    Upgrades,
    CloudLabels,
    Credits,
    LootListCard,
    SpUp,
    Tooltips,
    UnlockCond,
    LootListUp,
    TextLists,
} from "./hyperspace.jsons.js";
import type { Data } from "./json_factories/data.ts";
import type { CardAnimations } from "./json_factories/card_animations.ts";
import type { ModMetadata } from "./mods/mod.ts";

export interface JsonManifest {
    comms: Comms;
    cards: Cards & Partial<CardAnimations>;
    encounters: Encounters;
    loot_list_up: LootListUp;
    text_lists: TextLists;
    tutorials: Tutorials;
    upgrades: Upgrades;
    cloud_lablels: CloudLabels;
    credits: Credits;
    loot_list_card: LootListCard;
    sp_up: SpUp;
    tooltips: Tooltips;
    unlock_cond: UnlockCond;
    data: Data;
    card_animations: CardAnimations;
    metadata: ModMetadata;
}
