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

export const UIRectUnion = function (r1: UIRect, r2: UIRect): UIRect {
    const x = Math.min(r1.x, r2.x)
    const y = Math.min(r1.y, r2.y)
    const width = Math.max(r1.x + r1.width, r2.x + r2.width)
    const height = Math.max(r1.y + r1.height, r2.y + r2.height)
    return { x, y, width, height }
}

export const UIRectIsEmpty = function(rect: UIRect): boolean {
    return rect.width == 0.0 || rect.height == 0.0
}