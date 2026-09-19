import { ipcMain, app } from "electron";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "node:path";
import { type AwaitedFuncs, mainWindow } from "./index.ts";
import type { RemoteReplace } from "../preload.ts";

type Flatten<
    T extends Record<string, unknown>,
    Key = keyof T,
    A = Key extends string ?
        T[Key] extends Record<string, unknown> ? Flatten<T[Key]>
        : T[Key] extends () => Record<string, unknown> ?
            Flatten<ReturnType<T[Key]>>
        :   Record<Key, T[Key]>
    :   never,
> =
    (A extends unknown ? (k: A) => void : never) extends (k: infer I) => void ?
        I
    :   never;

export class RemoteReplacePreloadHandler implements AwaitedFuncs<
    Flatten<RemoteReplace>
> {
    constructor() {
        for (const key of Object.getOwnPropertyNames(
            this.constructor.prototype,
        ).filter(
            (key) => key != "constructor",
        ) as (keyof RemoteReplacePreloadHandler)[]) {
            ipcMain.handle(
                key,
                (
                    _event,
                    ...args: Parameters<
                        Extract<
                            Flatten<RemoteReplace>[keyof Flatten<RemoteReplace>],
                            //eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (...args: any[]) => any
                        >
                    >
                ) =>
                    (
                        this[key] as (
                            ...args: Parameters<
                                Extract<
                                    Flatten<RemoteReplace>[keyof Flatten<RemoteReplace>],
                                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (...args: any[]) => any
                                >
                            >
                        ) => ReturnType<
                            Extract<
                                Flatten<RemoteReplace>[keyof Flatten<RemoteReplace>],
                                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (...args: any[]) => any
                            >
                        >
                    )(...args),
            );
        }
    }
    getPaths() {
        return;
    }
    join(...file_names: string[]) {
        return path.join(...file_names);
    }
    focus() {
        mainWindow?.focus();
    }
    close() {
        mainWindow?.close();
    }
    setFullScreen(set_fullscreen: boolean) {
        mainWindow?.setFullScreen(set_fullscreen);
    }
    setContentSize(width: number, height: number) {
        mainWindow?.setContentSize(width, height);
    }
    setResizable(set_resizable: boolean) {
        mainWindow?.setResizable(set_resizable);
    }
    setFullScreenable(set_fullscreenable: boolean) {
        mainWindow?.setFullScreenable(set_fullscreenable);
    }
    getPath(path_flag: "documents" | "home" | "temp") {
        const out = app.getPath(path_flag);
        if (path_flag == "temp") {
            if (
                !fs.existsSync(path.join(app.getPath(path_flag), "Wishgranter"))
            )
                fs.mkdirSync(path.join(app.getPath(path_flag), "Wishgranter"));
            return path.join(out, "Wishgranter");
        }
        return out;
    }
    isPackaged() {
        return app.isPackaged;
    }
    sep() {
        return path.sep;
    }
    existsSync(file: string) {
        return !file;
    }
    unlinkSync() {
        return;
    }
    writeFileSync(file: string, data: string) {
        fs.writeFileSync(file, data, { flag: "w", encoding: "utf8" });
    }
    readFileSync(file: string) {
        if (!fs.existsSync(file)) return "undefined";
        if (fs.lstatSync(file).isDirectory()) return "null";
        return fs.readFileSync(file, "utf8");
    }
    readFile(file: string) {
        if (!fs.existsSync(file) || fs.lstatSync(file).isDirectory()) return "";
        return fsPromise.readFile(file, "utf8");
    }
    mkdirSync(file: string) {
        return fs.existsSync(file);
    }
}
