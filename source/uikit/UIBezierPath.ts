import { UIPoint } from "./UIPoint";
declare var require: any
const d3 = require('d3-path')

export class UIBezierPath {

    public d3Paths = [d3.path()]

    activePath(): any {
        return this.d3Paths[this.d3Paths.length - 1]
    }

    moveTo(toPoint: UIPoint): void {
        this.activePath().moveTo(toPoint.x, toPoint.y)
    }

    addLineTo(toPoint: UIPoint): void {
        this.activePath().lineTo(toPoint.x, toPoint.y)
    }

    addArcTo(toCenter: UIPoint, radius: number, startAngle: number, endAngle: number, closewise: boolean): void {
        this.activePath().moveTo(toCenter.x + radius, toCenter.y)
        this.activePath().arc(toCenter.x, toCenter.y, radius, startAngle, endAngle, closewise)
    }

    addCurveTo(toPoint: UIPoint, controlPoint1: UIPoint, controlPoint2: UIPoint): void {
        this.activePath().bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, toPoint.x, toPoint.y);
    }

    addQuadCurveTo(toPoint: UIPoint, controlPoint: UIPoint): void {
        this.activePath().quadraticCurveTo(controlPoint.x, controlPoint.y, toPoint.x, toPoint.y);
    }

    closePath(): void {
        this.activePath().closePath();
    }

    removeAllPoints(): void {
        this.d3Paths = [d3.path()]
    }

    appendPath(path: UIBezierPath): void {
        path.d3Paths.forEach(it => {
            this.d3Paths.push(it)
        })
    }

}