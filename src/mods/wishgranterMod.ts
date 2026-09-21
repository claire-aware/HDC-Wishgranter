import { type Code0Adjuster, Mod, type ModMetadata } from "./mod.ts";
import type { RuntimeScene } from "../gdjs.js";
import {
    applyToObject,
    commentEventList,
    simplifyEventList,
} from "../codeReplacementHelpers.ts";
import { getDataFromMods } from "../fileFactory.ts";

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
            resolve(code0Adjustments);
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

let console_history = "\n";
let logger = (...msg: string[]) => {
    console_history += msg.reduce((prev, cur) => prev + " " + cur) + "\n";
};
const old_log = console.log;
console.log = (...msg: string[]) => {
    old_log(...msg);
    logger(...msg);
};
const old_warn = console.warn;
console.warn = (...msg: string[]) => {
    old_warn(...msg);
    logger(...["Warning:", ...msg]);
};
const old_error = console.error;
console.error = (...msg: string[]) => {
    old_error(...msg);
    logger(...["!Error!:", ...msg]);
};

function code0Adjustments(
    adjustable: (scene: RuntimeScene) => void,
): (scene: RuntimeScene) => void {
    adjustable = simplifyEventList(adjustable);
    if (!window.remote_replace.app.isPackaged())
        adjustable = commentEventList(adjustable, getDataFromMods());
    return replaceVersionText(adjustable);
}

function replaceVersionText(
    adjustable: (scene: RuntimeScene) => void,
): (scene: RuntimeScene) => void {
    const default_version_text_match = adjustable
        .toString()
        .match(
            /(?<=gdjs\s*\.evtsExt__GetPropertiesData__ReturnGameVersion\.func\(\s*runtimeScene,\s*null,?\s*\)\s*\+\s*")[\w()\s-]*(?=")/g,
        );
    if (!default_version_text_match) return adjustable;

    return (runtimeScene: RuntimeScene) => {
        gdjs.copyArray(
            gdjs.CommandCode.GDtxt_9595uiObjects2,
            gdjs.CommandCode.GDtxt_9595uiObjects3,
        );

        applyToObject("txt_ui", 3, (txt_ui) => {
            (txt_ui as { setString: (new_string: string) => void }).setString(
                gdjs.evtsExt__GetPropertiesData__ReturnGameVersion.func(
                    runtimeScene,
                    null,
                ) +
                    default_version_text_match[0] +
                    console_history,
            );
            (
                txt_ui as { setTextAlignment: (right: "right") => void }
            ).setTextAlignment("right");
        });

        logger = (...msg) => {
            logger(...msg);
            applyToObject("txt_ui", 3, (txt_ui) => {
                (
                    txt_ui as { setString: (new_string: string) => void }
                ).setString(
                    gdjs.evtsExt__GetPropertiesData__ReturnGameVersion.func(
                        runtimeScene,
                        null,
                    ) +
                        default_version_text_match[0] +
                        console_history,
                );
            });
        };
    };
}
