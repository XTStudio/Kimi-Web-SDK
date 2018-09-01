import { UIRect, UIRectZero } from "./UIRect";
import { UIColor } from "./UIColor";
import { CALayer } from "../coregraphics/CALayer";
import { UIPoint, UIPointZero } from "./UIPoint";
import { UIAffineTransform, UIAffineTransformIdentity } from "./UIAffineTransform";

export class UIView {

    protected domElement = document.createElement("div")

    constructor() {
        this.domElement.style.position = "absolute"
        this.layer._view = this
    }

    readonly layer = new CALayer

    private _frame: UIRect = UIRectZero

    public bounds: UIRect = UIRectZero

    private _transform: UIAffineTransform = UIAffineTransformIdentity

    public tag: number = 0

    protected superview: UIView | undefined = undefined

    protected subviews: UIView[] = []

    protected window: any | undefined = undefined

    removeFromSuperview() {
        if (this.superview !== undefined) {
            this.superview.subviews = this.superview.subviews.filter(it => it !== this)
            this.superview.domElement.removeChild(this.domElement)
            this.superview = undefined
        }
    }

    insertSubviewAtIndex(view: UIView, index: number): void {

    }

    exchangeSubview(index1: number, index2: number): void {

    }

    addSubview(view: UIView): void {
        if (view.superview !== undefined) {
            view.removeFromSuperview()
        }
        view.superview = this
        this.subviews.push(view)
        this.domElement.appendChild(view.domElement)
    }

    insertSubviewBelowSubview(view: UIView, belowSubview: UIView): void {

    }

    insertSubviewAboveSubview(view: UIView, aboveSubview: UIView): void {

    }

    bringSubviewToFront(view: UIView): void {

    }

    sendSubviewToBack(view: UIView): void {

    }

    isDescendantOfView(view: UIView): boolean {
        return false
    }

    viewWithTag(tag: number): UIView | undefined {
        return undefined
    }

    private _backgroundColor: UIColor | undefined = undefined

    private _alpha: number = 1.0

    // Getter & Setter

    public get alpha(): number {
        return this._alpha;
    }

    public set alpha(value: number) {
        this._alpha = value;
        this.domElement.style.opacity = value.toString()
    }

    public get backgroundColor(): UIColor | undefined {
        return this._backgroundColor;
    }

    public set backgroundColor(value: UIColor | undefined) {
        this._backgroundColor = value;
        this.domElement.style.backgroundColor = value ? value.toStyle() : null
    }

    public get frame(): UIRect {
        return this._frame;
    }

    public set frame(value: UIRect) {
        this._frame = value;
        this.bounds = { ...value, x: 0, y: 0 }
        this.domElement.style.left = value.x.toString() + "px"
        this.domElement.style.top = value.y.toString() + "px"
        this.domElement.style.width = value.width.toString() + "px"
        this.domElement.style.height = value.height.toString() + "px"
    }

    public get center(): UIPoint {
        return { x: this.frame.x + this.frame.width / 2.0, y: this.frame.y + this.frame.height / 2.0 };
    }

    public set center(value: UIPoint) {
        this.frame = { x: value.x - this.frame.width / 2.0, y: value.y - this.frame.height / 2.0, width: this.frame.width, height: this.frame.height }
    }

    public get transform(): UIAffineTransform {
        return this._transform;
    }

    public set transform(value: UIAffineTransform) {
        this._transform = value;
    }

}