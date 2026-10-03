import type { JsonProcessingManifest} from "../fileFactory.ts";
import { array, getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["text_lists"] = getManifestEntry("text_lists", {
    shop_loc: {
        [key]: /.*/,
        [value]: { [array]: /.*/ },
    },
    con_insult: {
        adj: { [array]: /.*/ },
        noun: { [array]: /.*/ },
    },
    gp: {
        corp_1: { [array]: /[A-Z]*/ },
        corp_2: { [array]: /[A-Z]*/ },
        leg: { [array]: /[A-Z]*/ },
    },
})

export interface TextLists {
    shop_loc: Record<string, string[]>;
    con_insult: {
        adj: string[];
        noun: string[];
    };
    gp: {
        corp_1: Uppercase<string>[];
        corp_2: Uppercase<string>[];
        leg: Uppercase<string>[];
    };
}
