import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["credits"] = getManifestEntry("credits", {
    [key]: /\d+/,
    [value]: { txt: /.*/, size: /\d+/ },
})
export type Credits = Record<number, { txt: string[]; size: number }>;
