export interface UISize {
    readonly width: number,
    readonly height: number,
}

export const UISizeZero = { width: 0, height: 0 }

export const UISizeMake = function (width: number, height: number): UISize {
    return { width, height }
}

export const UISizeEqualToSize = function (a: UISize, b: UISize) {
    return Math.abs(a.width - b.width) < 0.001 && Math.abs(a.height - b.height) < 0.001
}