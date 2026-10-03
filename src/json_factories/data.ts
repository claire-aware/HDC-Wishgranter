import type { JsonProcessingManifest } from "../fileFactory.ts";
import {
    array,
    default_value,
    getManifestEntry,
    key,
    validator,
    value,
} from "../fileFactory.ts";

export const manifest: JsonProcessingManifest["data"] = getManifestEntry(
    "data",
    {
        properties: {
            name: { [validator]: /.*/, [default_value]: "Wishgranter" },
            version: {
                [validator]: /\d+\.\d+\.\d+/,
                [default_value]: "0.0.0",
            },
            description: {
                [validator]: /.*/,
                [default_value]: "Modloader",
            },
            platformSpecificAssets: {
                [key]: /.*/,
                [value]: /.*/,
            },
        },
        resources: {
            resources: {
                [array]: { name: /.*/ },
            },
        },
        usedResources: {
            [array]: { name: /.*/ },
        },
        layouts: {
            [array]: {
                name: /Command/,
                objects: {
                    [array]: {},
                },
                variables: {
                    [array]: {},
                },
                usedResources: {
                    [array]: { name: /.*/ },
                },
            },
        },
    },
);

/**
 * Native representation of GDevelop objects and scenes
 *
 * @remarks
 * Defined by data.js
 */
export interface Data {
    properties: DataProperties;
    resources: DataResources;
    usedResources: UsedResource[];
    layouts: Layout[];
}
interface DataProperties {
    name: string;
    version: string;
    description: string;
    platformSpecificAssets: Record<string, string>;
}
interface DataResources {
    /**
     * Array of all files accesable by the renderer or sound manager. Likely a expanded version of `usedResources`
     */
    resources: Resource[];
}
interface UsedResource {
    name: string;
}
interface Layout {
    name: "Command";
    objects: LayoutObject[];
    variables: UnloadedVariable[];
    usedResources: { name: string }[];
}
interface LayoutObject {
    variables: UnloadedVariable[];
    name: string;
    animations: Animation[];
}
export type UnloadedVariable =
    | { folded?: true; name: string; type: "number"; value: number }
    | { folded?: true; name: string; type: "string"; value: string }
    | {
          folded?: true;
          name: string;
          type: "array";
          children: (
              | { type: "number"; value: number }
              | { type: "string"; value: string }
          )[];
      }
    | {
          folded?: true;
          name: string;
          type: "structure";
          children: UnloadedVariable[];
      };
export interface Animation {
    /**
     * When used for card animations, the card id is used
     */
    name: string;
    useMultipleDirections: false;
    directions: {
        looping: true;
        /**
         * In seconds
         */
        timeBetweenFrames: number;
        sprites: AnimationFrame[];
    }[];
}
export interface AnimationFrame {
    /**
     * Id of a sprite defined in Resources
     */
    image: string;
    points: {
        name: string;
        x: number;
        y: number;
    }[];
    originPoint: {
        name: "origine";
        x: number;
        y: number;
    };
    centerPoint: {
        automatic: boolean;
        name: "centre";
        x: number;
        y: number;
    };
    hasCustomCollisionMask: true;
    customCollisionMask: { x: number; y: number }[][];
}

export interface Resource {
    disablePreload?: boolean;
    file: string;
    kind: string;
    metadata?: string;
    name: string;
    smoothed: boolean;
    userAdded: boolean;
}
