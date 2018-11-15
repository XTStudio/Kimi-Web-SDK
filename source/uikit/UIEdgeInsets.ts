import { UIRect } from "./UIRect";

export interface UIEdgeInsets {
    readonly top: number
    readonly left: number
    readonly bottom: number
    readonly right: number
}

export const UIEdgeInsetsZero: UIEdgeInsets = { top: 0, left: 0, bottom: 0, right: 0 }

export const UIEdgeInsetsMake = function (top: number, left: number, bottom: number, right: number): UIEdgeInsets {
    return { top, left, bottom, right }
}

export const UIEdgeInsetsInsetRect = function (rect: UIRect, insets: UIEdgeInsets): UIRect {
    return {
        x: rect.x + insets.left,
        y: rect.y + insets.top,
        width: rect.width - insets.left - insets.right,
        height: rect.height - insets.top - insets.bottom
    }
}

export const UIEdgeInsetsEqualToEdgeInsets = function (rect1: UIEdgeInsets, rect2: UIEdgeInsets): boolean {
    return Math.abs(rect1.top - rect2.top) < 0.001 &&
        Math.abs(rect1.left - rect2.left) < 0.001 &&
        Math.abs(rect1.bottom - rect2.bottom) < 0.001 &&
        Math.abs(rect1.right - rect2.right) < 0.001
}