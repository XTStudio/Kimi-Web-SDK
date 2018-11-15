export interface UIRange {
    readonly location: number
    readonly length: number
}

export const UIRangeMake = function (location: number, length: number): UIRange {
    return { location, length }
}