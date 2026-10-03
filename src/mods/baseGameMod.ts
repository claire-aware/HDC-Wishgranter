import { type Code0Adjuster, Mod } from "./mod.ts";
import type { LoadSequenceElement } from "../mod_menu/loadingBar.ts";

export class BaseGameMod extends Mod {
    protected get mod_directory_path(): string {
        return window.remote_replace.path.join(
            document
                .getElementById("hyperspace-file-location-input")
                ?.getAttribute("value") ?? "",
            "resources",
            "app.asar",
            "app",
        );
    }
    protected set mod_directory_path(_who_cares: string) {
        return;
    }
    constructor(
        enabled: boolean,
        mod_directory_path = "",
        file_getter?: (file_path: string) => Promise<string>,
    ) {
        super(enabled, mod_directory_path, file_getter);
    }
    async load(
        ...files_to_load: string[]
    ): Promise<Iterable<LoadSequenceElement>> {
        if (files_to_load.length <= 0) {
            return super.load(
                ...(
                    await window.wishgranter.getAllFilesToLoadFromMod(
                        this.mod_directory_path,
                    )
                ).filter(
                    (file_to_load) =>
                        !this.file_map.has(file_to_load) &&
                        (file_to_load.endsWith(".json") ||
                            ["data.js", "code0.js"].includes(file_to_load)),
                ),
            );
        }
        return super.load(...files_to_load);
    }
    getCode(): string | undefined {
        return this.file_map.get("code0.js");
    }
    getCode0Adjustments(): Promise<Code0Adjuster> {
        return new Promise((resolve) => {
            resolve((out) => out);
        });
    }
}
