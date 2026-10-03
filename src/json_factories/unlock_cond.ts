import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["unlock_cond"] = getManifestEntry("unlock_cond", {
    [key]: /.*/,
    [value]: { cond: /.*/, unlock: /.*/ },
})

export type UnlockCond = Record<string, { cond: string; unlock: string }>;
