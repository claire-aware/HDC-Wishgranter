import type { LoadingBarElement } from "./mod_menu/loadingBar.ts";
import { loadWishgranter, unloadWishgranter } from "./loadWishgranter.ts";
import {
    getCachedCode,
    getCachedJson,
    getLoadingSequenceToCacheCodeFromMods,
    getLoadingSequenceToCacheJsons,
} from "./fileFactory.ts";

const loading_bar = document.getElementsByTagName(
    "loading-bar",
)[0] as LoadingBarElement;
const start_game_button = document.getElementById(
    "start-game-button",
) as HTMLButtonElement;

function baseStartGame() {
    //Initialization
    const gdgame = new gdjs.RuntimeGame(getCachedJson("data.json"), {});

    //Create a renderer
    gdgame.getRenderer().createStandardCanvas(document.body);

    //Put at the back of the dom
    document.body.moveBefore(
        document.body.getElementsByTagName("canvas")[0],
        document.body.firstChild,
    );

    //Bind keyboards/mouse/touch events
    gdgame
        .getRenderer()
        .bindStandardEvents(gdgame.getInputManager(), window, document);

    gdjs.CommandCode = getCachedCode();

    //Load all assets and start the game
    gdgame
        .loadAllAssets(() => {
            gdgame.startGameLoop();
        })
        .catch((err: unknown) => {
            console.error(err);
            start_game_button.disabled = false;
            start_game_button.textContent = `!Error!: ${String(err)}`;
        });

    return gdjs.LoadingScreenRenderer?.getLoadingElements() ?? [];
}
export async function startGame() {
    start_game_button.disabled = true;
    document.body.classList.add("game_loading");
    await loading_bar.runThroughLoadingSequence([
        {
            status_text: "Getting Jsons",
            function: getLoadingSequenceToCacheJsons,
        },
        {
            status_text: "Modifying Code",
            function: getLoadingSequenceToCacheCodeFromMods,
        },
        {
            status_text: "Starting Game",
            function: baseStartGame,
        },
    ]);
    document.body.classList.remove("game_loading");
    document.body.classList.add("game_loaded");
}

export async function loadHyperspaceLocation(hyperspace_path: string) {
    start_game_button.disabled = true;
    unloadWishgranter();
    await loading_bar.runThroughLoadingSequence(
        await loadWishgranter(hyperspace_path),
        hyperspace_path,
    );
    document.body.classList.add("game_loadable");
    start_game_button.disabled = false;
}
