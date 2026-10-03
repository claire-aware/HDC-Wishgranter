import { getManifestEntry, key, value } from "../fileFactory.ts";

export const manifest = getManifestEntry("tutorials", {
    [key]: /tut_.+/,
    [value]: { txt: /.*/ },
})

export type Tutorials = Record<`tut_${string}`, { txt: string }>;
