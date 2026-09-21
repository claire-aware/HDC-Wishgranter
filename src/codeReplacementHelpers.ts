import type { RuntimeScene } from "./gdjs.js";
import type { Data } from "./wishgranter.jsons.js";

export function simplifyEventList(
    event_list: (scene: RuntimeScene) => void,
): (scene: RuntimeScene) => void {
    return regexAdjustments(event_list, (function_text) => {
        return (
            function_text
                /*.replaceAll(
                                            /let ?isConditionTrue_(\d+) ?= ?false;\s*isConditionTrue_\1 ?= ?false;\s*{\s*isConditionTrue_\1 ?= ?([^]+?);\s*}\s*if ?\(isConditionTrue_\1\)/g,
                                (_substring, ...groups: string[]) => {
                                        return `if (${groups[1]})`;
                                },
                        )*/
                .replaceAll(
                    /runtimeScene\s*\.getScene\(\)\s*\.getVariables\(\)\s*\.getFromIndex\((\d+)\)/g,
                    (_substring, ...groups: string[]) => {
                        return `getSceneVariable(${groups[0]},runtimeScene)`;
                    },
                )
                .replaceAll(
                    /for ?\(\s*var i ?= ?0, ?len ?= ?gdjs\.CommandCode\.GD([\w_]+)Objects(\d+)\.length;\s*i ?< ?len;\s*\+\+i\s*\) ?{([^{]+?)}/g,
                    (_substring, ...groups: string[]) =>
                        `applyToObject(${groups[0].replaceAll(/_9595/, "_")},${groups[1]},(_object,i) => {${groups[2]}})`,
                )
        );
    });
}

export function commentEventList(
    event_list: (scene: RuntimeScene) => void,
    data: Data,
): (scene: RuntimeScene) => void {
    return regexAdjustments(event_list, (function_text) => {
        return function_text.replaceAll(
            /(?<=getSceneVariable\()\d+(?=\))/g,
            (index) => {
                return data.layouts[0].variables[Number.parseInt(index)].name;
            },
        );
    });
}

export function regexAdjustments(
    event_list: (scene: RuntimeScene) => void,
    adjustment: (function_text: string) => string,
): (scene: RuntimeScene) => void {
    return eval(`(${adjustment(event_list.toString())})`) as (
        scene: RuntimeScene,
    ) => void;
}

export function getSceneVariable(
    variable_id: string | number,
    runtime_scene: RuntimeScene,
) {
    if (typeof variable_id == "number")
        return runtime_scene
            .getScene()
            .getVariables()
            .getFromIndex(variable_id);

    return runtime_scene.getScene().getVariables().get(variable_id);
}

export function applyToObject(
    object_name: string,
    object_instance: number,
    applicator: (object: unknown, index: number) => void,
) {
    const object_array_id =
        `GD${object_name.replaceAll(/_/g, "_9595")}Objects${object_instance.toString()}` as `GD${string}Objects${number}`;
    for (
        let index = 0, length = gdjs.CommandCode[object_array_id].length;
        index < length;
        index++
    ) {
        applicator(gdjs.CommandCode[object_array_id][index], index);
    }
}
