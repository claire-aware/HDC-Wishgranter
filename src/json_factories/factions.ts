import type { JsonProcessingManifest } from "../fileFactory.ts";
import { getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["factions"] = getManifestEntry(
    "factions",
    { [key]: /.*/, [value]: {} },
);

export type Factions = Record<string, { color: string }>;
