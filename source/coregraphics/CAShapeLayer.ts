import { CALayer } from "./CALayer";
import { UIColor } from "../uikit/UIColor";
import { UIBezierPath } from "../uikit/UIBezierPath";

export enum CAShapeFillRule {
    nonZero,
    evenOdd,
}

export enum CAShapeLineCap {
    butt,
    round,
    square,
}

export enum CAShapeLineJoin {
    miter,
    round,
    bevel,
}

export class CAShapeLayer extends CALayer {

    pathElement: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")

    createSVGElement() {
        super.createSVGElement()
        if (this._svgElement && !this._svgElement.contains(this.pathElement)) {
            this._svgElement.appendChild(this.pathElement)
        }
    }

    private _path: UIBezierPath | undefined = undefined

    public get path(): UIBezierPath | undefined {
        return this._path;
    }

    public set path(value: UIBezierPath | undefined) {
        this._path = value;
        if (value) {
            this.pathElement.setAttribute("d", value.d3Paths.map((it: any) => { return it.toString() }).join(" "))
        }
        else {
            this.pathElement.removeAttribute("d")
        }
    }

    private _fillColor: UIColor | undefined = undefined

    public get fillColor(): UIColor | undefined {
        return this._fillColor;
    }

    public set fillColor(value: UIColor | undefined) {
        this._fillColor = value;
        if (value) {
            this.pathElement.style.fill = value.toStyle()
        }
        else {
            this.pathElement.style.fill = "black"
        }
    }

    private _fillRule: CAShapeFillRule = CAShapeFillRule.evenOdd

    public get fillRule(): CAShapeFillRule {
        return this._fillRule;
    }

    public set fillRule(value: CAShapeFillRule) {
        this._fillRule = value;
        if (value == CAShapeFillRule.evenOdd) {
            this.pathElement.style.fillRule = "evenodd"
        }
        else if (value == CAShapeFillRule.nonZero) {
            this.pathElement.style.fillRule = "nonzero"
        }
    }

    private _lineCap: CAShapeLineCap = CAShapeLineCap.butt

    public get lineCap(): CAShapeLineCap {
        return this._lineCap;
    }

    public set lineCap(value: CAShapeLineCap) {
        this._lineCap = value;
        switch (value) {
            case CAShapeLineCap.butt:
                this.pathElement.style.strokeLinecap = "butt"
                break
            case CAShapeLineCap.round:
                this.pathElement.style.strokeLinecap = "round"
                break
            case CAShapeLineCap.square:
                this.pathElement.style.strokeLinecap = "square"
                break
        }
    }

    private _lineDashPattern: number[] = []

    public get lineDashPattern(): number[] {
        return this._lineDashPattern;
    }

    public set lineDashPattern(value: number[]) {
        this._lineDashPattern = value;
        this.pathElement.style.strokeDasharray = value.join(" ")
    }

    private _lineDashPhase: number = 0.0

    public get lineDashPhase(): number {
        return this._lineDashPhase;
    }

    public set lineDashPhase(value: number) {
        this._lineDashPhase = value;
        this.pathElement.style.strokeDashoffset = value.toFixed(6)
    }

    private _lineJoin: CAShapeLineJoin = CAShapeLineJoin.miter

    public get lineJoin(): CAShapeLineJoin {
        return this._lineJoin;
    }

    public set lineJoin(value: CAShapeLineJoin) {
        this._lineJoin = value;
        switch (value) {
            case CAShapeLineJoin.miter:
                this.pathElement.style.strokeLinejoin = "miter"
                break
            case CAShapeLineJoin.bevel:
                this.pathElement.style.strokeLinejoin = "bevel"
                break
            case CAShapeLineJoin.round:
                this.pathElement.style.strokeLinejoin = "round"
                break
        }
    }

    private _lineWidth: number = 0.0

    public get lineWidth(): number {
        return this._lineWidth;
    }

    public set lineWidth(value: number) {
        this._lineWidth = value;
        this.pathElement.style.strokeWidth = value.toFixed(6)
    }

    private _miterLimit: number = 10.0

    public get miterLimit(): number {
        return this._miterLimit;
    }

    public set miterLimit(value: number) {
        this._miterLimit = value;
        this.pathElement.style.strokeMiterlimit = value.toFixed(6)
    }

    private _strokeColor: UIColor | undefined = undefined

    public get strokeColor(): UIColor | undefined {
        return this._strokeColor;
    }

    public set strokeColor(value: UIColor | undefined) {
        this._strokeColor = value;
        this.pathElement.style.stroke = value ? value.toStyle() : null
    }

    strokeStart: number = 0.0 // todo: not support

    strokeEnd: number = 1.0 // todo: not support

}