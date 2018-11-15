import { Matrix } from "./helpers/Matrix";

export interface UIAffineTransform {
    readonly a: number,
    readonly b: number,
    readonly c: number,
    readonly d: number,
    readonly tx: number,
    readonly ty: number,
}

export const UIAffineTransformIdentity: UIAffineTransform = { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0 }

export const UIAffineTransformMake = function (a: number, b: number, c: number, d: number, tx: number, ty: number): UIAffineTransform {
    return { a, b, c, d, tx, ty }
}

export const UIAffineTransformMakeTranslation = function (tx: number, ty: number): UIAffineTransform {
    return UIAffineTransformMake(1.0, 0.0, 0.0, 1.0, tx, ty)
}

export const UIAffineTransformMakeScale = function (sx: number, sy: number): UIAffineTransform {
    return UIAffineTransformMake(sx, 0.0, 0.0, sy, 0.0, 0.0)
}

export const UIAffineTransformMakeRotation = function (angle: number): UIAffineTransform {
    const mCos = Math.cos(angle)
    const mSin = Math.sin(angle)
    return UIAffineTransformMake(mCos, -mSin, mSin, mCos, 0.0, 0.0)
}

export const UIAffineTransformTranslate = function (t: UIAffineTransform, tx: number, ty: number): UIAffineTransform {
    const matrix = new Matrix()
    matrix.setValues(t)
    matrix.postTranslate(tx, ty)
    return matrix.getValues()
}

export const UIAffineTransformScale = function (t: UIAffineTransform, sx: number, sy: number): UIAffineTransform {
    const matrix = new Matrix()
    matrix.setValues(t)
    matrix.postScale(sx, sx)
    return matrix.getValues()
}
export const UIAffineTransformRotate = function (t: UIAffineTransform, angle: number): UIAffineTransform {
    const matrix = new Matrix()
    matrix.setValues(t)
    matrix.postRotate(angle)
    return matrix.getValues()
}

export const UIAffineTransformInvert = function (t: UIAffineTransform): UIAffineTransform {
    return {
        a: t.a,
        b: t.c,
        c: t.b,
        d: t.d,
        tx: t.tx,
        ty: t.ty,
    }
}

export const UIAffineTransformConcat = function (t1: UIAffineTransform, t2: UIAffineTransform): UIAffineTransform {
    const matrix1 = new Matrix
    matrix1.setValues(t1)
    const matrix2 = new Matrix
    matrix2.setValues(t2)
    matrix1.concat(matrix2)
    return matrix1.getValues()
}

export const UIAffineTransformEqualToTransform = function (t1: UIAffineTransform, t2: UIAffineTransform): boolean {
    return Math.abs(t1.a - t2.a) < 0.001 &&
        Math.abs(t1.b - t2.b) < 0.001 &&
        Math.abs(t1.c - t2.c) < 0.001 &&
        Math.abs(t1.d - t2.d) < 0.001 &&
        Math.abs(t1.tx - t2.tx) < 0.001 &&
        Math.abs(t1.ty - t2.ty) < 0.001
}

export const UIAffineTransformIsIdentity = function (transform: UIAffineTransform) {
    return UIAffineTransformEqualToTransform(transform, UIAffineTransformIdentity)
}