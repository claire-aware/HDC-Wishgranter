import { getDummyData } from "./fileFactory.ts";

const file_input_button = document.getElementById(
    "hyperspace-deck-command",
) as HTMLButtonElement;

window.mod_menu
    .getDefaultHyperspacePath()
    .then(hyperspaceDeckCommandSubmitted)
    .catch((err: unknown) => {
        for (const element of document.getElementsByClassName("error")) {
            element.removeAttribute("hidden");
        }
        console.error(err);
    });
file_input_button.addEventListener("click", () => {
    window.mod_menu
        .askUserForDirectory()
        .then(hyperspaceDeckCommandSubmitted)
        .catch((err: unknown) => {
            console.error(err);
        });
});

function hyperspaceDeckCommandSubmitted(hyperspace_path: string) {
    window.mod_menu
        .getHyperspaceScriptTags(hyperspace_path)
        .then((scripts) =>
            scripts.filter((script) => !exclusions.includes(script)),
        )
        .then((scripts) =>
            scripts.map(
                async (script) =>
                    await getPossiblyReplacedScript(hyperspace_path, script),
            ),
        )
        .then(async (script_promises) => {
            for (const script_promise of script_promises) {
                await script_promise.then(
                    ([script, is_module]) =>
                        new Promise<void>((resolve) => {
                            const script_orphan =
                                document.createElement("script");
                            script_orphan.src = script;
                            if (is_module) script_orphan.type = "module";
                            script_orphan.crossOrigin = "anonymous";
                            script_orphan.className = "wishgranter_script";
                            document.head.appendChild(script_orphan);
                            script_orphan.addEventListener("load", () => {
                                resolve();
                            });
                        }),
                );
            }
        })
        .then(startGame)
        .catch((err: unknown) => {
            console.error(err);
        });
}

async function getPossiblyReplacedScript(
    hyperspace_path: string,
    script_source: `${string}.js`,
): Promise<[true_script_sopurce: `${string}.js`, is_module: boolean]> {
    const sep: string = window.remote_replace.path.sep();
    const replacement_map: ReplacementMap =
        window.remote_replace.app.isPackaged() ?
            replacements
        :   { ...replacements, ...dev_replacements };
    if (!(script_source in replacement_map)) {
        return [
            `${hyperspace_path}${sep}resources${sep}app.asar${sep}app${sep}${script_source}`,
            false,
        ];
    } else if (typeof replacement_map[script_source] == "string") {
        return [replacement_map[script_source], true];
    } else if (typeof replacement_map[script_source] != "function") {
        return [await replacement_map[script_source], true];
    } else {
        return [await replacement_map[script_source](hyperspace_path), false];
    }
}

const exclusions = ["data.js", "code0.js"];
type ReplacementMap = Record<
    `${string}.js`,
    | `${string}.js`
    | Promise<`${string}.js`>
    | ((hyperspace_path: string) => Promise<`${string}.js`> | `${string}.js`)
>;
const replacements: ReplacementMap = {
    "Extensions/FileSystem/filesystemtools.js":
        "dist/src/reimplementations/filesystemReimplementation.js",
    "pixi-renderers/runtimegame-pixi-renderer.js": replaceElectronRemote,
};
const dev_replacements: ReplacementMap = {};

function replaceElectronRemote(
    hyperspace_path: string,
): Promise<`${string}.js`> {
    return window.mod_menu
        .readHyperspaceFile(
            hyperspace_path,
            "pixi-renderers/runtimegame-pixi-renderer.js",
        )
        .then((renderer_code) =>
            renderer_code.replace(
                /(?<=this.getElectronRemote ?= ?\(\) ?=> ?\{)[^]*?(?=\};)/,
                `return window.remote_replace`,
            ),
        )
        .then(
            (renderer_code) =>
                window.mod_menu.createTemporaryFile(
                    "renderer.js",
                    renderer_code,
                ) as Promise<`${string}.js`>,
        );
}

function startGame() {
    //Initialization
    const gdgame = new gdjs.RuntimeGame(getDummyData(), {});

    //Create a renderer
    gdgame.getRenderer().createStandardCanvas(document.body);

    //Bind keyboards/mouse/touch events
    gdgame
        .getRenderer()
        .bindStandardEvents(gdgame.getInputManager(), window, document);

    //Load all assets and start the game
    gdgame.loadAllAssets(() => {
        gdgame.startGameLoop();
    });
}
