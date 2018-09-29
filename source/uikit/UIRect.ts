export interface UIRect {
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
}

export const UIRectZero = { x: 0, y: 0, width: 0, height: 0 }

export const UIRectEqualToRect = function (a: UIRect, b: UIRect) {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}