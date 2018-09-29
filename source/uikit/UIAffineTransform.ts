export interface UIAffineTransform {
    readonly a: number,
    readonly b: number,
    readonly c: number,
    readonly d: number,
    readonly tx: number,
    readonly ty: number,
}

export const UIAffineTransformIdentity: UIAffineTransform = { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0 }

export const UIAffineTransformIsIdentity = function (transform: UIAffineTransform) {
    return transform.a == 1.0 && transform.b == 0.0 && transform.c == 0.0 && transform.d == 1.0 && transform.tx == 0.0 && transform.ty == 0.0
}

export const UIAffineTransformEqual = function (a: UIAffineTransform, b: UIAffineTransform) {
    return a.a == b.a &&
        a.b == b.b &&
        a.c == b.c &&
        a.d == b.d &&
        a.tx == b.tx &&
        a.ty == b.ty;
}