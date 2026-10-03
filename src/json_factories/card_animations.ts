import type { JsonProcessingApplication } from "../fileFactory.ts";
import type { AnimationFrame, Data } from "./data.ts";

/**
 * Helper json to define card animations which eventually gets conveted and merged into Data
 */
export type CardAnimations = Record<
    string,
    {
        /**
         * Local paths to sprites (png, svg, jpeg)
         */
        sprites: string[];
        /**
         * Pixel coordanates for guns, bomber/fighter spawning, and alignment.
         * If more than one point record is given, any frames without definition will be linearly interpolated.
         * If an array, defined points will be spread evenly across frames
         */
        points: CardAnimationPoints;
        /**
         * Points of a polygon where the mouse will consider this sprite selected
         **/
        collison_polygon: { x: number; y: number }[];
        /**
         * If defined, instead of shuffling the sprites in sprites to create the sparkel, the sprites will appear in the order spesified. Repeats encouraged.
         */
        frame_order?: number[];
    }
>;
type CardAnimationPoints = Record<string, { x: number; y: number }> & {
    origin: { x: number; y: number };
    center: { x: number; y: number };
};

export function cardAnimationsValidator(_card_animation_text: string): boolean {
    return true;
}

export function cardAnimationsExtractor(
    _card_animation_text: string,
): CardAnimations {
    return {};
}

export function cardsValidator(_cards_text: string): boolean {
    return true;
}

export function cardsExtractor(_cards_text: string): CardAnimations {
    return {};
}

export const apply_data_from_card_animations: JsonProcessingApplication<CardAnimations> =
    {
        "data.json": {
            additional_sources: ["cards"],
            applicator: getDataFromCardAnimations,
        },
    };

export function getDataFromCardAnimations(
    animations: CardAnimations,
    cards: Record<
        keyof CardAnimations,
        { por_obj: `obj_${"unit" | "ab"}_${string}` }
    >,
): Data {
    if (
        Object.getOwnPropertyNames(animations).length <= 0 ||
        Object.getOwnPropertyNames(cards).length <= 0
    )
        return {};
    return {
        resources: {
            resources: [
                ...Object.getOwnPropertyNames(animations)
                    .flatMap((card_id) => animations[card_id].sprites)
                    .map((sprite_file_path) => {
                        return {
                            file: sprite_file_path,
                            name: sprite_file_path,
                            kind: "image",
                            smoothed: false,
                            userAdded: true,
                        };
                    }),
            ],
        },
        layouts: [
            {
                name: "Command",
                objects: [
                    ...Object.getOwnPropertyNames(animations)
                        .reduce(
                            (obj_set, card_id) =>
                                obj_set.add(cards[card_id].por_obj),
                            new Set<string>(),
                        )
                        .keys()
                        .map(getAnimationsOfPorObj(animations, cards)),
                ],
                variables: [],
                usedResources: [
                    ...Object.getOwnPropertyNames(animations)
                        .flatMap((card_id) => animations[card_id].sprites)
                        .map((sprite_file_path) => {
                            return {
                                name: sprite_file_path,
                            };
                        }),
                ],
            },
        ],
        usedResources: [
            ...Object.getOwnPropertyNames(animations)
                .flatMap((card_id) => animations[card_id].sprites)
                .map((sprite_file_path) => {
                    return {
                        name: sprite_file_path,
                    };
                }),
        ],
    };
}

function getAnimationsOfPorObj(
    animations: CardAnimations,
    cards: Record<
        keyof CardAnimations,
        { por_obj: `obj_${"unit" | "ab"}_${string}` }
    >,
): (
    value: string,
    index: number,
) => {
    name: string;
    variables: never[];
    animations: {
        name: string;
        useMultipleDirections: false;
        directions: {
            looping: true;
            timeBetweenFrames: number;
            sprites: AnimationFrame[];
        }[];
    }[];
} {
    return function (por_obj_name) {
        return {
            name: por_obj_name,
            variables: [],
            animations: [
                ...Object.getOwnPropertyNames(animations)
                    .filter((card_id) => cards[card_id].por_obj == por_obj_name)
                    .map(getCardsAnimation(animations)),
            ],
        };
    };
}

function getCardsAnimation(animations: CardAnimations): (
    value: string,
    index: number,
    array: string[],
) => {
    name: string;
    useMultipleDirections: false;
    directions: {
        looping: true;
        timeBetweenFrames: number;
        sprites: AnimationFrame[];
    }[];
} {
    return function (card_id) {
        return {
            name: card_id,
            useMultipleDirections: false,
            directions: [
                {
                    looping: true,
                    timeBetweenFrames: 0.068,
                    sprites: [
                        ...(
                            animations[card_id].sprites
                                .map(wrapSpriteFilePath)
                                .map((animation_frame) => {
                                    return {
                                        ...animation_frame,
                                        customCollisionMask:
                                            animations[card_id]
                                                .collison_polygon,
                                    };
                                })
                                .reduce(
                                    orderAnimationFrames(animations, card_id),
                                    animations[card_id].frame_order ?? [],
                                ) as {
                                image: string;
                                hasCustomCollisionMask: true;
                                customCollisionMask: {
                                    x: number;
                                    y: number;
                                }[][];
                            }[]
                        ).map(
                            populateAnimationFramePoints(animations, card_id),
                        ),
                    ],
                },
            ],
        };
    };
}

function wrapSpriteFilePath(sprite_file_path: string) {
    return {
        image: sprite_file_path,
        hasCustomCollisionMask: true as const,
    };
}

function orderAnimationFrames(animations: CardAnimations, card_id: string) {
    return function (
        out: (
            | number
            | {
                  image: string;
              }
        )[],
        sprite: {
            image: string;
        },
        index: number,
        array: (
            | number
            | {
                  image: string;
              }
        )[],
    ): (
        | number
        | {
              image: string;
          }
    )[] {
        if (animations[card_id].frame_order)
            return out.map((frame_index) =>
                frame_index == index ? sprite : frame_index,
            );
        return [...out, ...array.slice(index), ...array.slice(0, index)];
    };
}

function populateAnimationFramePoints(
    animations: CardAnimations,
    card_id: string,
): (
    value: {
        image: string;
        hasCustomCollisionMask: true;
        customCollisionMask: { x: number; y: number }[][];
    },
    index: number,
    array: {
        image: string;
        hasCustomCollisionMask: true;
        customCollisionMask: { x: number; y: number }[][];
    }[],
) => AnimationFrame {
    return (frame_data) => {
        return {
            ...frame_data,
            centerPoint: {
                ...animations[card_id].points.center,
                automatic: true,
                name: "centre",
            },
            originPoint: {
                ...animations[card_id].points.origin,
                name: "origine",
            },
            points: Object.getOwnPropertyNames(animations[card_id].points).map(
                (name) => {
                    return { ...animations[card_id].points[name], name: name };
                },
            ),
        };
    };
}
