import { ipcMain, dialog, app } from "electron";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "node:path";
import os from "os";
import { findSteamApp } from "steam-locate";
import type { AwaitedFuncs } from "./index.ts";
import type { ModMenu } from "../preload.ts";

export const config_path = path.join(os.homedir(), "HDC", "config.json");
export interface Config {
    hyperspace_path?: string;
    mods_path?: string;
    mod_paths?: (string | { mod_directory_path: string; enabled: boolean })[];
}

export class ModMenuPreloadHandler implements AwaitedFuncs<ModMenu> {
    constructor() {
        for (const key of Object.getOwnPropertyNames(
            this.constructor.prototype,
        ).filter(
            (key) => key != "constructor",
        ) as (keyof ModMenuPreloadHandler)[]) {
            ipcMain.handle(
                key,
                (_event, ...args: Parameters<ModMenu[keyof ModMenu]>) =>
                    (
                        this[key] as (
                            ...args: Parameters<
                                ModMenuPreloadHandler[keyof ModMenuPreloadHandler]
                            >
                        ) => ReturnType<
                            ModMenuPreloadHandler[keyof ModMenuPreloadHandler]
                        >
                    )(...args),
            );
        }
    }
    async getDefaultHyperspacePath(): Promise<string> {
        if (fs.existsSync(config_path)) {
            const config = JSON.parse(
                await fsPromise.readFile(config_path, "utf8"),
            ) as Config;
            if (config.hyperspace_path) {
                return config.hyperspace_path;
            }
        }
        return (await findSteamApp("2711190")).installDir ?? "";
    }
    async askUserForDirectory(): Promise<string> {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });
        if (!canceled) {
            return filePaths[0];
        }
        return "";
    }
    async getHyperspaceScriptTags(
        hyperspace_path: string,
    ): Promise<`${string}.js`[]> {
        const file = await fsPromise.readFile(
            path.join(
                hyperspace_path,
                "resources",
                "app.asar",
                "app",
                "index.html",
            ),
            "utf8",
        );
        return Array.from(file.matchAll(/(?<=src=")[\w\-/.]+?\.js(?=")/g)).map(
            (match) => match[0] as `${string}.js`,
        );
    }
    readHyperspaceFile(
        hyperspace_path: string,
        file_name: string,
    ): Promise<string> {
        return fsPromise.readFile(
            path.join(
                hyperspace_path,
                "resources",
                "app.asar",
                "app",
                file_name,
            ),
            "utf8",
        );
    }
    async createTemporaryFile(
        file_name: string,
        data: string,
    ): Promise<string> {
        const sep_file_name = file_name.split(path.sep);
        await fsPromise.mkdir(path.join(app.getPath("temp"), "Wishgranter"), {
            recursive: true,
        });
        const temp_path = path.join(
            app.getPath("temp"),
            "Wishgranter",
            sep_file_name[sep_file_name.length - 1],
        );
        await fsPromise.writeFile(temp_path, data, { flag: "w" });
        return temp_path;
    }
    getAllFilesToLoadFromMod(mod_directory_path: string) {
        return fsPromise
            .readdir(mod_directory_path, { recursive: true })
            .then((files) =>
                files.filter((file) =>
                    ["js", "json"].includes(
                        file.split(".")[file.split(".").length - 1],
                    ),
                ),
            );
    }
}
