/**
 * Native representation of GDevelop objects and scenes
 *
 * @remarks
 * Defined by data.js
 */
export interface Data {
    properties: {
        name: string;
        version: string;
        description: string;
        platformSpecificAssets: Record<string, string>;
    };
    resources: {
        /**
         * Array of all files accesable by the renderer or sound manager. Likely a expanded version of `usedResources`
         */
        resources: Resource[];
    };
    usedResources: { name: string }[];
    layouts: {
        name: "Command";
        objects: {
            variables: UnloadedVariable[];
            name: string;
            animations: Animation[];
        }[];
        variables: UnloadedVariable[];
        usedResources: { name: string }[];
    }[];
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

export function validator(data_text: string): boolean {
    return true;
}

export function extractor(data_text: string): Data {
    return {};
}
