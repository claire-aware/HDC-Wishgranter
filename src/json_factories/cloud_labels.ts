import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["cloud_labels"] = getManifestEntry("cloud_labels", {
    [key]: /.*/,
    [value]: { txt: /.*/, size: /\d+/ },
})

export type CloudLabels = Record<string, { txt: string; size: number }>;
