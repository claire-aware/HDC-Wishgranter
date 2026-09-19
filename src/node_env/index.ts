/**
 * This is the file handling the startup and lifetime of the game
 * running in Electron Runtime.
 */
// Modules to control application life and create native browser window
import { app, BrowserWindow, shell, Menu } from "electron";
import path from "path";
import fs from "fs";
import { ModMenuPreloadHandler } from "./ModMenuPreloadHandler.ts";
import { RemoteReplacePreloadHandler } from "./RemoteReplacePreloadHandler.ts";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let mainWindow: BrowserWindow | null = null;

function createWindow() {
    new RemoteReplacePreloadHandler();
    new ModMenuPreloadHandler();

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        useContentSize: true,
        title: "Hyperspace Deck Command: Wishgranter",
        backgroundColor: "#000000",
        webPreferences: {
            preload: path.join(import.meta.dirname, "..", "preload.js"),
        },
    });

    // Open external link in the OS default browser
    mainWindow.webContents.setWindowOpenHandler((details) => {
        void shell.openExternal(details.url);
        return {
            action: "deny",
        };
    });

    // and load the index.html of the app.
    void mainWindow.loadFile("./entry.html");

    Menu.setApplicationMenu(null);

    // Open the DevTools.
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // De-reference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        fs.rmSync(path.join(app.getPath("temp"), "Wishgranter"), {
            force: true,
            recursive: true,
        });
        app.quit();
    });
    return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

export type AwaitedFuncs<T> = {
    [Key in keyof T]: T[Key] extends (...args: never) => unknown ?
        (
            ...args: Parameters<T[Key]>
        ) => Awaited<ReturnType<T[Key]>> | ReturnType<T[Key]>
    :   () => Promise<T[Key]> | T[Key];
};
