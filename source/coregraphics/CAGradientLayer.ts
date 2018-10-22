import { CALayer } from "./CALayer";
import { UIPoint } from "../uikit/UIPoint";
import { UIColor } from "../uikit/UIColor";

export class CAGradientLayer extends CALayer {

    defsElement: SVGDefsElement = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    linearGradientElement: SVGLinearGradientElement = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")

    createSVGElement() {
        super.createSVGElement()
        if (this._svgElement !== undefined) {
            if (!this._svgElement.contains(this.defsElement)) {
                this.linearGradientElement.id = "filter." + this._uuid
                this.defsElement.appendChild(this.linearGradientElement)
                this._svgElement.appendChild(this.defsElement)
            }
        }
        this._bgElement.setAttribute("fill", `url(#filter.${this._uuid})`)
    }

    public set backgroundColor(value: UIColor | undefined) {
        this._bgElement.setAttribute("fill", `url(#filter.${this._uuid})`)
    }

    private _colors: UIColor[] = []

    public get colors(): UIColor[] {
        return this._colors;
    }

    public set colors(value: UIColor[]) {
        this._colors = value;
        this.resetStops()
    }

    private _locations: number[] = []

    public get locations(): number[] {
        return this._locations;
    }

    public set locations(value: number[]) {
        this._locations = value;
        this.resetStops()
    }

    private resetStops() {
        this.linearGradientElement.innerHTML = ''
        let colors = this.colors
        let locations = this.locations.length === this.colors.length ? this.locations : undefined
        if (locations === undefined) {
            colors.forEach((it, idx) => {
                const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop")
                stop.setAttribute("offset", ((idx / colors.length) * 100).toFixed(0) + "%")
                stop.setAttribute("stop-color", this.colors[idx].toStyle())
                this.linearGradientElement.appendChild(stop)
            })
        }
        else if (colors.length === locations.length) {
            locations.forEach((it, idx) => {
                const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop")
                stop.setAttribute("offset", (it * 100).toFixed(0) + "%")
                stop.setAttribute("stop-color", this.colors[idx].toStyle())
                this.linearGradientElement.appendChild(stop)
            })
        }
    }

    private _startPoint: UIPoint = { x: 0, y: 0 }

    public get startPoint(): UIPoint {
        return this._startPoint;
    }

    public set startPoint(value: UIPoint) {
        this._startPoint = value;
        this.linearGradientElement.setAttribute("x1", value.x.toFixed(2))
        this.linearGradientElement.setAttribute("y1", value.y.toFixed(2))
    }

    private _endPoint: UIPoint = { x: 1, y: 0 }

    public get endPoint(): UIPoint {
        return this._endPoint;
    }

    public set endPoint(value: UIPoint) {
        this._endPoint = value;
        this.linearGradientElement.setAttribute("x2", value.x.toFixed(2))
        this.linearGradientElement.setAttribute("y2", value.y.toFixed(2))
    }

}