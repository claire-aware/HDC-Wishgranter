/* eslint-disable @typescript-eslint/no-unused-vars */
import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["comms"] = getManifestEntry("comms", [
    {
        [key]: /.*/,
        [value]: { [key]: /text_\d+/, [value]: /.*/ },
    },
    {
        [key]: /.*/,
        [value]: /.*/,
    },
])

export type Barks = Record<string, Record<`text_${number}`, string[]> | string>;

export function isCommsPrefix(_id: string): boolean {
    return true;
}
export function isHostileAbilityComms(_id: string): boolean {
    return true;
}
export function isAllyAbilityComms(_id: string): boolean {
    return true;
}
export function isPlayerAbilityComms(_id: string): boolean {
    return true;
}
