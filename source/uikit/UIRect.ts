import { UIPoint } from "./UIPoint";

export interface UIRect {
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
}

export const UIRectZero = { x: 0, y: 0, width: 0, height: 0 }

export const UIRectMake = function (x: number, y: number, width: number, height: number): UIRect {
    return { x, y, width, height }
}

export const UIRectEqualToRect = function (a: UIRect, b: UIRect): boolean {
    return Math.abs(a.x - b.x) < 0.001 &&
        Math.abs(a.y - b.y) < 0.001 &&
        Math.abs(a.width - b.width) < 0.001 &&
        Math.abs(a.height - b.height) < 0.001
}

export const UIRectInset = function (rect: UIRect, dx: number, dy: number): UIRect {
    return {
        x: rect.x + dx,
        y: rect.y + dy,
        width: rect.width - 2 * dx,
        height: rect.height - 2 * dy,
    }
}

export const UIRectOffset = function (rect: UIRect, dx: number, dy: number): UIRect {
    return {
        x: rect.x + dx,
        y: rect.y + dy,
        width: rect.width,
        height: rect.height,
    }
}

export const UIRectContainsPoint = function (rect: UIRect, point: UIPoint): boolean {
    return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.x + rect.height
}

export const UIRectContainsRect = function (rect1: UIRect, rect2: UIRect): boolean {
    return UIRectContainsPoint(rect1, { x: rect2.x, y: rect2.y }) &&
        UIRectContainsPoint(rect1, { x: rect2.x + rect2.width, y: rect2.y }) &&
        UIRectContainsPoint(rect1, { x: rect2.x, y: rect2.y + rect2.height }) &&
        UIRectContainsPoint(rect1, { x: rect2.x + rect2.width, y: rect2.y + rect2.height })
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

export const UIRectIsEmpty = function (rect: UIRect): boolean {
    return rect.width == 0.0 || rect.height == 0.0
}