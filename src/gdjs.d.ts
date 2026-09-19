declare global {
    var gdjs: gdjs;
}

export interface gdjs {
    Logger: new (name: string) => {
        error: (...msg: unknown[]) => void;
        warn: (...msg: unknown[]) => void;
    };
    fileSystem?: unknown;
    JsonManager?: unknown;
    ResourceLoader: {
        getResource: (resource_name: string) => Resource | null;
        checkIfCredentialsRequired: (resource_file: string) => boolean;
        getFullUrl: (resource_file: string) => string;
    };
    ResourceCache: new <A>() => {
        get: (resource: Resource) => A | null;
        getFromName: (resource_name: string) => A | null;
        set: (resource: Resource, a: A) => void;
        delete: (resource: Resource) => void;
        clear: () => void;
    };
    CommandCode: Record<
        string,
        | unknown[]
        | ((runtime_game: RuntimeGame) => void)
        | ((runtime_scene: RuntimeScene) => void)
        | null
    >;
    RuntimeGame: RuntimeGameClass;
    copyArray: (from: unknown[], to: unknown[]) => void;
    evtTools: {
        variable: {
            getVariableNumber: (variable: Variable) => number;
        };
        sound: {
            stopMusicOnChannel: (
                runtime_scene: RuntimeScene,
                channel: number,
            ) => void;
            playMusicOnChannel: (
                runtime_scene: RuntimeScene,
                music_name: string,
                channel: number,
                truth: true,
                zero: 0,
                one: 1,
            ) => void;
        };
    };
    evtsExt__GetPropertiesData__ReturnGameVersion: {
        func: (runtime: RuntimeGame, other: null) => string;
    };
    evtsExt__JSONResourceLoader__LoadJSONToScene: {
        func: (
            runtime: RuntimeScene,
            resource_name: string,
            variable: Variable,
            other: null,
        ) => void;
    };
}

type RuntimeGameClass = new (
    projectData: Data,
    something_else: unknown,
) => RuntimeGame;

export interface RuntimeGame {
    getRenderer: () => {
        createStandardCanvas: (on: HTMLElement) => void;
        bindStandardEvents: (a: unknown, b: unknown, c: unknown) => void;
    };
    getInputManager: () => unknown;
    loadAllAssets: (callback: () => void) => void;
    startGameLoop: () => void;
}

export interface RuntimeScene {
    getGame: () => RuntimeGame;
    getScene: () => RuntimeScene;
    getVariables: () => {
        getFromIndex: (index: number) => Variable;
    };
}

export interface Variable {
    fromJSObject: (object: object) => void;
}

export interface Data {
    properties: {
        authorUsernames: string[];
        watermark: {
            showWatermark: boolean;
            placement:
                | "top-left"
                | "top-right"
                | "bottom-left"
                | "bottom-right"
                | "bottom"
                | "top";
        };
    };
    resources: {
        resources: {
            file: string;
            kind: ResourceKind;
            metadata: string;
            name: string;
            smoothed?: boolean;
            userAdded: boolean;
            disablePreload?: boolean;
            preloadAsSound?: boolean;
            preloadAsMusic?: boolean;
            preloadInCache?: boolean;
        }[];
    };
    usedResources: { name: string }[];
    layouts: { name: string; usedResources: { name: string }[] }[];
    variables;
    eventsFunctionsExtensions;
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
