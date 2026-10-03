import type { JsonManifest } from "../jsons.d.ts";
import type { LoadSequenceElement } from "../mod_menu/loadingBar.ts";
import type { RuntimeScene } from "../gdjs.js";
import { json_manifest } from "../fileFactory.ts";

export interface ModMetadata {
    name: string;
    description?: string;
    icon_path?: string;
    version?: string;
}

export class Mod {
    enabled = true;
    has_loaded = false;
    private _valid = true;
    protected set valid(new_valid: boolean) {
        this._valid = new_valid;
    }
    public get valid() {
        return this._valid;
    }
    private _mod_directory_path = "";
    protected get mod_directory_path() {
        return this._mod_directory_path;
    }
    protected set mod_directory_path(new_path: string) {
        this._mod_directory_path = new_path;
    }
    protected file_getter: (file_path: string) => Promise<string>;
    protected file_map = new Map<string, string>();
    constructor(
        enabled: boolean,
        mod_directory_path: string,
        file_getter?: (file_path: string) => Promise<string>,
    ) {
        this.enabled = enabled;
        this.mod_directory_path = mod_directory_path;
        this.file_getter =
            file_getter ??
            ((file_name) =>
                window.remote_replace.fsPromise.readFile(
                    window.remote_replace.path.join(
                        this.mod_directory_path,
                        file_name,
                    ),
                ));
    }
    async load(
        ...files_to_load: string[]
    ): Promise<Iterable<LoadSequenceElement>> {
        if (files_to_load.length <= 0) {
            files_to_load = (
                await window.wishgranter.getAllFilesToLoadFromMod(
                    this.mod_directory_path,
                )
            ).filter((file_to_load) => !this.file_map.has(file_to_load));
        }
        return files_to_load
            .map((file_to_load) => {
                return {
                    status_text: `Loading ${file_to_load}`,
                    function: async () => {
                        this.file_map.set(
                            file_to_load,
                            await this.file_getter(file_to_load),
                        );
                    },
                } as LoadSequenceElement;
            })
            .concat(this.getLoadingSequenceToCacheJsons());
    }
    private getLoadingSequenceToCacheJsons(): LoadSequenceElement[] {
        return Object.getOwnPropertyNames(json_manifest).flatMap(
            (output_json_name) =>
                Object.getOwnPropertyNames(
                    json_manifest[
                        output_json_name as `${keyof JsonManifest}.json`
                    ].sources,
                )
                    .filter(
                        (source_name) =>
                            source_name == "code0.js" ||
                            this.file_map.has(source_name),
                    )
                    .flatMap((source_name) => [
                        {
                            status_text: `Validating ${source_name} for use as ${output_json_name} `,
                            function: () => {
                                this.valid &&=
                                    json_manifest[
                                        output_json_name as `${keyof JsonManifest}.json`
                                    ].sources[
                                        source_name as `${keyof JsonManifest}.json`
                                    ]?.validator(
                                        this.file_map.get(source_name) ?? "",
                                    ) ?? true;
                            },
                        },
                        {
                            status_text: `Extracting ${output_json_name} from ${source_name}`,
                            function: () => {
                                this.cachedJsons ??= {};
                                this.cachedJsons[
                                    output_json_name as `${keyof JsonManifest}.json`
                                ] = json_manifest[
                                    output_json_name as `${keyof JsonManifest}.json`
                                ].merger(
                                    this.cachedJsons[
                                        output_json_name as `${keyof JsonManifest}.json`
                                    ],
                                    json_manifest[
                                        output_json_name as `${keyof JsonManifest}.json`
                                    ].sources[
                                        source_name as `${keyof JsonManifest}.json`
                                    ]?.extractor(
                                        this.file_map.get(source_name) ?? "",
                                    ),
                                );
                            },
                        },
                    ]),
        );
    }
    cachedJsons:
        | {
              [key in keyof JsonManifest as `${key}.json`]?: JsonManifest[key];
          }
        | undefined = undefined;
    getCachedJson<JsonName extends keyof JsonManifest>(
        json_name: `${JsonName}.json`,
    ): JsonManifest[JsonName] {
        if (!this.cachedJsons?.[json_name])
            throw new ReferenceError(
                "Cached jsons were accessed before jsons were cached",
            );
        return this.cachedJsons[json_name] as JsonManifest[JsonName];
    }
    getCode(): string | undefined {
        return undefined;
    }
    protected cached_code_0_adjustment: Code0Adjuster | undefined = undefined;
    async getCode0Adjustments(): Promise<Code0Adjuster> {
        if (this.cached_code_0_adjustment) return this.cached_code_0_adjustment;
        const file = this.file_map.get("code0adjustments.js");
        if (!file) return (out) => out;
        try {
            const adjustment = (
                (await import(
                    window.remote_replace.path.join(
                        this.mod_directory_path,
                        "code0adjustments.js",
                    )
                )) as {
                    code0Adjuster?: Code0Adjuster;
                }
            ).code0Adjuster;
            if (adjustment) return (this.cached_code_0_adjustment = adjustment);
            return (out) => out;
        } catch {
            return (out) => out;
        }
    }
    hasModPath(mod_path: string) {
        return mod_path == this.mod_directory_path;
    }
}

export type Code0Adjuster = (
    adjustable: (runtime_scene: RuntimeScene) => void,
) => (runtime_scene: RuntimeScene) => void;
