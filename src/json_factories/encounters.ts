import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, isKeyOf, key, optional, record, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["encounters"] = {
    ...getManifestEntry("encounters", {
        [key]: /.*/,
        [value]: {
            [record]: {
                [key]: /wave\d+/,
                [value]: {
                    [record]: {
                        [key]: /variant\d+/,
                        [value]: {
                            [key]: /o[0-3]_unit\d+/,
                            [value]: isKeyOf("cards"),
                        },
                    },
                    wave_rand: /\d+/,
                    wave_music: {
                        [optional]: /\d+/,
                    },
                    wave_screen_text: {
                        [optional]: /.*/,
                    },
                },
            },

            comment_wave_enemies: /.*/,
        },
    }),
    prerequisites: ["cards"],
}

export type Encounters = Record<`enc_${string}_${string}`, Encounter>;
export interface Encounter extends Record<`wave${number}`, Wave> {
    /**
     * Comma separated list of all card ids that appear in this encounter
     */
    comment_wave_enemies: string;
}
export interface Wave extends Record<
    `variant${number}`,
    Record<`o${3 | 2 | 1 | 0}_unit${number}`, `${string}_${string}`>
> {
    wave_rand: number;
    wave_music?: number;
    wave_screen_text?: string;
}
