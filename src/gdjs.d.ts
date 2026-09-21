import type { Resource } from "./wishgranter.jsons.js";
import type { Data } from "./wishgranter.jsons.js";
import type { LoadSequenceElement } from "./mod_menu/loadingBar.ts";

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
    LoadingScreenRenderer?: {
        new (): unknown;
        getLoadingElements: () => LoadSequenceElement<[]>[];
    };
    CommandCode: {
        localVariables: Array;
        idToCallbackMap: Map;
        func: (runtime_scene: RuntimeScene) => void;
    } & Record<`GD${string}Objects${number}_${number}final`, unknown[]> &
        Record<`forEachCount${number}_${number}`, number> &
        Record<`forEachIndex${number}`, number> &
        Record<`forEachObjects${number}`, unknown[]> &
        Record<`forEachTemporary${number}`, unknown> &
        Record<`forEachTotalCount${number}`, number> &
        Record<`GD${string}Objects${number}`, unknown[]> &
        Record<`eventsList${number}`, (runtime_scene: RuntimeScene) => void> &
        Record<
            `mapOfGDgdjs_9546CommandCode_9546GD${string}Objects${number}Objects`,
            Hashtable
        > &
        Record<
            `asyncCallback${number}`,
            (runtime_scene: RuntimeScene, asyncObjectsList) => void
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
        func: (runtime: RuntimeScene, other: null) => string;
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
        get: (name: string) => Variable;
    };
}

export interface Variable {
    fromJSObject: (object: object) => void;
    getValue(): boolean | number | string;
}
