import { getDataFromMods } from "../fileFactory.ts";
import { type Code0Adjuster, Mod, type ModMetadata } from "./mod.ts";
import { commentCode0 } from "../reimplementations/code0Commenter.ts";
import type { RuntimeScene } from "../gdjs.js";

export class WishgranterMod extends Mod {
    constructor(enabled = true, mod_directory_path = ".") {
        super(enabled, mod_directory_path);
        this.getJson = () => {
            return {};
        };
        this.getData = () => {
            return {};
        };
        this.load = () =>
            new Promise((resolve) => {
                resolve([]);
            });
    }

    getCode0Adjustments(): Promise<Code0Adjuster> {
        return new Promise((resolve) => {
            resolve((adjustable: (scene: RuntimeScene) => void) => {
                if (window.remote_replace.app.isPackaged())
                    adjustable = eval(
                        "{" +
                            commentCode0(
                                adjustable.toString(),
                                getDataFromMods(),
                            ).replace(/function ?\(/, "function adjustable(") +
                            "}",
                    ) as (scene: RuntimeScene) => void;

                adjustable = eval(
                    "{" +
                        replaceVersionText(adjustable.toString()).replace(
                            /function ?\(/,
                            "function adjustable(",
                        ) +
                        "}",
                ) as (scene: RuntimeScene) => void;
                console.log(adjustable.toString());
                return adjustable;
            });
        });
    }
    getMetadata(): ModMetadata {
        return {
            name: "Wishgranter Utilities",
            version: "0.0.3",
            description: "Modloader for Sleeper Game's Hyperspace Deck Command",
            icon_path: "Wishgranter_Icon.png",
        };
    }
}

function replaceVersionText(code0: string): string {
    code0 = code0.replace(
        /(?<=gdjs\s*\.evtsExt__GetPropertiesData__ReturnGameVersion\.func\(\s*runtimeScene,\s*null,?\s*\)\s*\+\s*")[\w()\s-]*(?="?)/g,
        ` (${(document.getElementById("modlist")?.children.length ?? 2) > 2 ? `${((document.getElementById("modlist")?.children.length ?? 2) - 2).toString()} Mods Loaded` : "Modded"} - Wishgranter)`,
    );
    return code0;
}
