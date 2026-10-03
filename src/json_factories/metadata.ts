import type { JsonProcessingManifest} from "../fileFactory.ts";
import { default_value, getManifestEntry, optional, validator } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["metadata"] = getManifestEntry("metadata", {
    name: { [validator]: /.*/, [default_value]: "Unkown Mod" },
    description: { [optional]: /.*/ },
    icon_path: { [optional]: /.*/ },
    version: { [optional]: /\d+\.\d+\.\d+/ },
})
export interface ModMetadata {
    name: string;
    description?: string;
    icon_path?: string;
    version?: string;
}
