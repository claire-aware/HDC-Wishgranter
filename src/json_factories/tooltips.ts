import type { JsonProcessingManifest} from "../fileFactory.ts";
import { getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["tooltips"] = getManifestEntry("tooltips", {
    [key]: /.*/,
    [value]: { header: /.*/, txt: /.*/, suf: /.*/ },
})
export type Tooltips = Record<
    string,
    { header?: string; txt: string; suf?: number }
>;
