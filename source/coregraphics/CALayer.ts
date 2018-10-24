import { UIView } from "../uikit/UIView";
import { UIRect, UIRectZero } from "../uikit/UIRect";
import { UIColor } from "../uikit/UIColor";
import { UISize } from "../uikit/UISize";
import { UILabel } from "../uikit/UILabel";

export class CALayer {

    protected _uuid = "calayer." + Math.random() + Math.random()
    protected _svgElement: SVGGElement | undefined = undefined
    protected _clipPathElement: SVGClipPathElement = document.createElementNS("http://www.w3.org/2000/svg", "clipPath")
    protected _bgElement: SVGRectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    protected _contentElement: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", "g")
    protected _borderElement: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", "g")

    constructor() {
        this._bgElement.setAttribute("fill", "transparent")
    }

    private _view: UIView | undefined = undefined

    public get view(): UIView | undefined {
        if (this.superlayer) {
            return this.superlayer._view
        }
        return this._view
    }

    public set view(value: UIView | undefined) {
        this._view = value
    }

    private _frame: UIRect = UIRectZero

    public get frame(): UIRect {
        return this._frame;
    }

    public set frame(value: UIRect) {
        this._frame = value;
        if (this._view === undefined || this._svgElement !== undefined) {
            this.createSVGElement()
            if (this._svgElement) {
                this._svgElement.style.position = "absolute"
                this._svgElement.setAttribute("transform", `matrix(1.0, 0.0, 0.0, 1.0, ${value.x.toString()}, ${value.y.toString()})`)
                this._svgElement.setAttribute("width", value.width.toString())
                this._svgElement.setAttribute("height", value.height.toString())
            }
            this._bgElement.setAttribute("width", value.width.toString())
            this._bgElement.setAttribute("height", value.height.toString())
            {
                this._clipPathElement.appendChild(this._bgElement.cloneNode(true))
            }
            {
                this._borderElement.innerHTML = ""
                const borderFillElement = this._bgElement.cloneNode(true)
                if (borderFillElement instanceof SVGElement) {
                    borderFillElement.style.fillOpacity = "0"
                }
                this._borderElement.appendChild(borderFillElement)
            }
            this._contentElement.setAttribute("width", value.width.toString())
            this._contentElement.setAttribute("height", value.height.toString())
        }
    }

    private _hidden: boolean = false

    public get hidden(): boolean {
        if (this._view) {
            return this._view.hidden
        }
        else {
            return this._hidden;
        }
    }

    public set hidden(value: boolean) {
        this._hidden = value;
        if (this._view) {
            this._view.hidden = value
        }
        else {
            this._bgElement.style.display = value ? "none" : null
            this._contentElement.style.display = value ? "none" : null
        }
    }

    private _cornerRadius: number = 0.0

    public get cornerRadius(): number {
        return this._cornerRadius;
    }

    public set cornerRadius(value: number) {
        this._cornerRadius = value;
        if (this._view) {
            this._view.domElement.style.borderRadius = value.toString() + "px"
        }
        else {
            this._bgElement.setAttribute("rx", value.toString())
            this._bgElement.setAttribute("ry", value.toString())
        }
    }

    private _borderWidth: number = 0.0

    public get borderWidth(): number {
        return this._borderWidth;
    }

    public set borderWidth(value: number) {
        this._borderWidth = value;
        this.resetBorder()
    }

    private _borderColor: UIColor | undefined = undefined

    public get borderColor(): UIColor | undefined {
        return this._borderColor;
    }

    public set borderColor(value: UIColor | undefined) {
        this._borderColor = value;
        this.resetBorder()
    }

    private resetBorder() {
        if (this._view) {
            if (this.borderWidth > 0 && this.borderColor) {
                this._view.domElement.style.borderWidth = this.borderWidth.toString() + "px"
                this._view.domElement.style.borderColor = this.borderColor.toStyle()
                this._view.domElement.style.borderStyle = this.borderWidth > 0 ? "solid" : "unset"
                this._view.domElement.style.boxSizing = this.borderWidth > 0 ? "border-box" : "unset"
            }
            else {
                this._view.domElement.style.borderStyle = "unset"
            }
        }
        else {
            this.createSVGElement()
            if (this.borderWidth > 0 && this.borderColor && this._svgElement) {
                this._borderElement.style.strokeWidth = this.borderWidth.toString() + "px"
                this._borderElement.style.stroke = this.borderColor.toStyle()
                this._borderElement.innerHTML = ""
                const borderFillElement = this._bgElement.cloneNode(true)
                if (borderFillElement instanceof SVGElement) {
                    borderFillElement.style.fillOpacity = "0"
                }
                this._borderElement.appendChild(borderFillElement)
                this._borderElement.style.display = null
                this._svgElement.appendChild(this._borderElement)
            }
            else {
                this._borderElement.style.display = "none"
            }
        }
    }

    private moveBorderElementToFront() {
        if (this._svgElement === undefined) { return }
        if (this._svgElement.lastElementChild !== this._borderElement) {
            if (this._svgElement.contains(this._borderElement)) {
                this._svgElement.removeChild(this._borderElement)
            }
            this._svgElement.appendChild(this._borderElement)
        }
    }

    superlayer: CALayer | undefined = undefined

    removeFromSuperlayer() {
        if (this.superlayer) {
            const idx = this.superlayer.sublayers.indexOf(this)
            if (idx >= 0) {
                this.superlayer.sublayers.splice(idx, 1)
                if (this.superlayer._svgElement && this._svgElement && this.superlayer._svgElement.contains(this._svgElement)) {
                    this.superlayer._svgElement.removeChild(this._svgElement)
                }
            }
            this.superlayer = undefined
        }
    }

    sublayers: CALayer[] = []

    addSublayer(layer: CALayer) {
        if (layer.superlayer !== undefined) {
            layer.removeFromSuperlayer()
        }
        this.sublayers.push(layer)
        layer.superlayer = this
        this.createSVGElement()
        layer.createSVGElement()
        if (this._svgElement && layer._svgElement) {
            this._svgElement.appendChild(layer._svgElement)
            this.moveBorderElementToFront()
        }
    }

    protected createSVGElement() {
        if (this.sublayers.length == 0 && this._view !== undefined) { return }
        if (this._svgElement !== undefined) { return }
        if (this._view) {
            this._svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            this._svgElement.appendChild(this._bgElement)
            this._svgElement.appendChild(this._contentElement)
            if (this._svgElement) {
                this._svgElement.setAttribute("width", this.frame.width.toString())
                this._svgElement.setAttribute("height", this.frame.height.toString())
            }
            if (this._view.domElement.childElementCount == 0) {
                this._view.domElement.appendChild(this._svgElement)
            }
            else {
                this._view.domElement.insertBefore(this._svgElement, this._view.domElement.children[0])
            }
        }
        else {
            this._svgElement = document.createElementNS("http://www.w3.org/2000/svg", "g")
            this._svgElement.appendChild(this._bgElement)
            this._svgElement.appendChild(this._contentElement)
        }
    }

    private _backgroundColor: UIColor | undefined = undefined

    public get backgroundColor(): UIColor | undefined {
        if (this._view) {
            return this._view.backgroundColor
        }
        else {
            return this._backgroundColor;
        }
    }

    public set backgroundColor(value: UIColor | undefined) {
        this._backgroundColor = value;
        if (this._view) {
            this._view.backgroundColor = value
        }
        else {
            this._bgElement.setAttribute("fill", value ? value.toStyle() : "transparent")
        }
    }

    private _opacity: number = 1.0

    public get opacity(): number {
        if (this._view) {
            return this._view.alpha
        }
        else {
            return this._opacity;
        }
    }

    public set opacity(value: number) {
        this._opacity = value;
        if (this._view) {
            this._view.alpha = value
        }
        else {
            this._bgElement.style.opacity = value.toString()
            this._contentElement.style.opacity = value.toString()
        }
    }

    private _masksToBounds: boolean = false

    public get masksToBounds(): boolean {
        return this._masksToBounds;
    }

    public set masksToBounds(value: boolean) {
        this._masksToBounds = value;
        if (this._view) {
            this._view.clipsToBounds = value
        }
        else {
            this.createSVGElement()
            if (value && this._svgElement) {
                this._clipPathElement.id = "clip." + this._uuid
                this._clipPathElement.innerHTML = ""
                this._clipPathElement.appendChild(this._bgElement.cloneNode(true))
                this._svgElement.appendChild(this._clipPathElement)
                this._svgElement.setAttribute("clip-path", `url(#clip.${this._uuid})`)
            }
            else if (this._svgElement) {
                this._svgElement.setAttribute("clip-path", "")
            }
        }
    }

    private _shadowColor: UIColor | undefined = undefined;

    public get shadowColor(): UIColor | undefined {
        return this._shadowColor
    }

    public set shadowColor(value: UIColor | undefined) {
        this._shadowColor = value;
        this.resetShadow()
    }

    private _shadowOpacity: number = 0.0

    public get shadowOpacity(): number {
        return this._shadowOpacity;
    }

    public set shadowOpacity(value: number) {
        this._shadowOpacity = value;
        this.resetShadow()
    }

    private _shadowOffset: UISize = { width: 0, height: -3 }

    public get shadowOffset(): UISize {
        return this._shadowOffset;
    }

    public set shadowOffset(value: UISize) {
        this._shadowOffset = value;
        this.resetShadow()
    }

    private _shadowRadius = 3.0

    public get shadowRadius(): number {
        return this._shadowRadius;
    }

    public set shadowRadius(value: number) {
        this._shadowRadius = value;
        this.resetShadow()
    }

    private resetShadow() {
        if (this._view) {
            if (this.shadowOpacity > 0 && this.shadowColor && this.shadowColor.a > 0) {
                if (this._view instanceof UILabel) {
                    this._view.domElement.style.textShadow = this.shadowOffset.width.toString() + "px " + this.shadowOffset.height.toString() + "px " + this.shadowRadius.toString() + "px " + this.shadowColor.colorWithAlphaComponent(this.shadowOpacity).toStyle()
                }
                else {
                    this._view.domElement.style.boxShadow = this.shadowOffset.width.toString() + "px " + this.shadowOffset.height.toString() + "px " + this.shadowRadius.toString() + "px " + this.shadowColor.colorWithAlphaComponent(this.shadowOpacity).toStyle()
                }
            }
            else {
                this._view.domElement.style.textShadow = null
                this._view.domElement.style.boxShadow = null
            }
        }
    }

}