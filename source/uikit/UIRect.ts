export interface UIRect {
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
}

export const UIRectZero = { x: 0, y: 0, width: 0, height: 0 }

export const UIRectEqualToRect = function (a: UIRect, b: UIRect): boolean {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}

export const UIRectIntersectsRect = function (a: UIRect, b: UIRect): boolean {
    if (a.x + a.width - 0.1 <= b.x ||
        b.x + b.width - 0.1 <= a.x ||
        a.y + a.height - 0.1 <= b.y ||
        b.y + b.height - 0.1 <= a.y) {
        return false
    }
    return true
}