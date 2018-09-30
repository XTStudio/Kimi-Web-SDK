export interface UISize {
    readonly width: number,
    readonly height: number,
}

export const UISizeZero = { x: 0, y: 0, width: 0, height: 0 }

export const UISizeEqualToSize = function (a: UISize, b: UISize) {
    return a.width === b.width && a.height === b.height
}