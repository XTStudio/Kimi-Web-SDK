export interface UIPoint {
    readonly x: number,
    readonly y: number,
}

export const UIPointZero: UIPoint = { x: 0, y: 0 }

export const UIPointMake = function (x: number, y: number): UIPoint {
    return {x, y}
}

export const UIPointEqualToPoint = function (point1: UIPoint, point2: UIPoint): boolean {
    return Math.abs(point1.x - point2.x) < 0.001 && Math.abs(point1.y - point2.y) < 0.001
}