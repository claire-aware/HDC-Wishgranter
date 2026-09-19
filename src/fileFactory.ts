import type { Data } from "./gdjs.d.ts";

export function getDummyData(): Data {
    return {
        properties: {
            authorUsernames: ["Sleeper Games", "Flechette"],
            watermark: {
                showWatermark: false,
                placement: "top-left",
            },
        },
        resources: {
            get resources() {
                return [];
            },
        },
        get variables() {
            return [];
        },
        get usedResources() {
            return [];
        },
        get layouts() {
            return [];
        },
        eventsFunctionsExtensions: "Command",
    };
}
