import { UIRect, UIRectZero } from "./UIRect";
import { UIColor } from "./UIColor";
import { CALayer } from "../coregraphics/CALayer";
import { UIPoint, UIPointZero } from "./UIPoint";
import { UIAffineTransform, UIAffineTransformIdentity } from "./UIAffineTransform";
import { UIViewContentMode } from "./UIEnums";
import { UIGestureRecognizer } from "./UIGestureRecognizer";
import { EventEmitter } from "../kimi/EventEmitter";

export class UIView extends EventEmitter {

    protected domElement = document.createElement("div")

    constructor() {
        super()
        this.domElement.style.position = "absolute"
        this.layer._view = this
    }

    attachToElement(element: HTMLElement) {
        if (element == document.body) {
            document.body.style.width = "100%"
            document.body.style.height = "100%"
            document.getElementsByTagName('html')[0].style.height = "100%"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
        }
        const rootWindow = (() => {
            if (this instanceof UIWindow) {
                return this
            }
            const rootWindow = new UIWindow()
            rootWindow.addSubview(this)
            return rootWindow
        })()
        element.appendChild(rootWindow.domElement)
        window.addEventListener("resize", () => {
            this.onResize(element, rootWindow)
        })
        this.onResize(element, rootWindow)
    }

    onResize(element: HTMLElement, window: UIWindow) {
        window.frame = { x: 0, y: 0, width: element.clientWidth, height: element.clientHeight }
    }

    readonly layer = new CALayer

    private _frame: UIRect = UIRectZero

    public bounds: UIRect = UIRectZero

    private _transform: UIAffineTransform = UIAffineTransformIdentity

    public tag: number = 0

    protected superview: UIView | undefined = undefined

    protected subviews: UIView[] = []

    public get window(): UIWindow | undefined {
        if (this instanceof UIWindow) {
            return this
        }
        else if (this.superview) {
            return this.superview.window
        }
        return undefined
    }

    removeFromSuperview() {
        if (this.superview !== undefined) {
            const superview = this.superview
            superview.willRemoveSubview(this)
            this.willMoveToSuperview(undefined)
            superview.subviews = this.superview.subviews.filter(it => it !== this)
            superview.domElement.removeChild(this.domElement)
            this.superview = undefined
            this.didMoveToSuperview()
        }
    }

    insertSubviewAtIndex(view: UIView, index: number): void {
        if (view.superview !== undefined) {
            view.removeFromSuperview()
        }
        view.willMoveToSuperview(this)
        view.superview = this
        this.subviews.splice(index, 0, view)
        this.domElement.insertBefore(view.domElement, this.domElement.children[index])
        this.setNeedsDisplay()
        view.didMoveToSuperview()
        this.didAddSubview(view)
    }

    exchangeSubview(index1: number, index2: number): void {
        if (index1 < index2) {
            const index1View = this.subviews[index1];
            const index2View = this.subviews[index2];
            this.domElement.removeChild(index1View.domElement);
            this.domElement.insertBefore(index1View.domElement, index2View.domElement)
            this.domElement.removeChild(index2View.domElement);
            this.domElement.insertBefore(index2View.domElement, this.domElement.children[index1]);
        }
        else if (index1 > index2) {
            const index1View = this.subviews[index1];
            const index2View = this.subviews[index2];
            this.domElement.removeChild(index2View.domElement);
            this.domElement.insertBefore(index2View.domElement, index1View.domElement)
            this.domElement.removeChild(index1View.domElement);
            this.domElement.insertBefore(index1View.domElement, this.domElement.children[index2]);
        }
        const index2View = this.subviews[index2]
        this.subviews[index2] = this.subviews[index1]
        this.subviews[index1] = index2View
    }

    addSubview(view: UIView): void {
        if (view.superview !== undefined) {
            view.removeFromSuperview()
        }
        view.willMoveToSuperview(this)
        view.superview = this
        this.subviews.push(view)
        this.domElement.appendChild(view.domElement)
        this.setNeedsDisplay()
        view.didMoveToSuperview()
        this.didAddSubview(view)
    }

    insertSubviewBelowSubview(view: UIView, belowSubview: UIView): void {
        let index = this.subviews.indexOf(belowSubview)
        if (index >= 0) {
            this.insertSubviewAtIndex(view, index)
        }
    }

    insertSubviewAboveSubview(view: UIView, aboveSubview: UIView): void {
        let index = this.subviews.indexOf(aboveSubview)
        if (index >= 0) {
            this.insertSubviewAtIndex(view, index + 1)
        }
    }

    bringSubviewToFront(view: UIView): void {
        let index = this.subviews.indexOf(view)
        if (index >= 0) {
            this.subviews.splice(index, 1)
            this.subviews.push(view)
            this.domElement.removeChild(view.domElement)
            this.domElement.appendChild(view.domElement)
        }
    }

    sendSubviewToBack(view: UIView): void {
        let index = this.subviews.indexOf(view)
        if (index >= 0) {
            this.subviews.splice(index, 1)
            this.subviews.unshift(view)
            this.domElement.removeChild(view.domElement)
            this.domElement.insertBefore(view.domElement, this.domElement.firstChild)
        }
    }

    isDescendantOfView(view: UIView): boolean {
        let current: UIView | undefined = this
        while (current != undefined) {
            if (current == view) {
                return true
            }
            current = current.superview
        }
        return false
    }

    viewWithTag(tag: number): UIView | undefined {
        for (let index = 0; index < this.subviews.length; index++) {
            let element = this.subviews[index];
            if (element.tag === tag) {
                return element
            }
            let target = element.viewWithTag(tag);
            if (target !== undefined) {
                return target
            }
        }
        return undefined
    }

    // Delegates

    didAddSubview(subview: UIView): void { }
    willRemoveSubview(subview: UIView): void { }
    willMoveToSuperview(newSuperview: UIView | undefined): void { }
    didMoveToSuperview(): void {
        this.tintColorDidChange()
    }

    private _layoutTimer: any

    setNeedsLayout(layoutSubviews = false): void {
        if (!layoutSubviews) { return }
        clearTimeout(this._layoutTimer)
        this._layoutTimer = setTimeout(() => {
            this.layoutIfNeeded()
        }, 0)
    }

    layoutIfNeeded(): void {
        this.layoutSubviews()
    }

    layoutSubviews(): void { }

    // Rendering

    setNeedsDisplay(): void { }

    private _clipsToBounds: boolean = false

    private _backgroundColor: UIColor | undefined = undefined

    private _alpha: number = 1.0

    private _hidden: boolean = false

    private _opaque: boolean = false

    private _contentMode: UIViewContentMode = UIViewContentMode.scaleToFill

    private _tintColor: UIColor | undefined = undefined

    tintColorDidChange(): void {
        this.subviews.forEach(it => it.tintColorDidChange())
    }

    // GestureRecognizers

    public userInteractionEnabled: boolean = true

    protected gestureRecognizers: UIGestureRecognizer[] = []

    public addGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void {
        this.gestureRecognizers.push(gestureRecognizer)
    }

    public removeGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void {
        let index = this.gestureRecognizers.indexOf(gestureRecognizer)
        if (index >= 0) {
            this.gestureRecognizers.splice(index, 1)
        }
    }

    // Accessibility

    public isAccessibilityElement: boolean = false

    public accessibilityLabel: string | undefined

    public accessibilityHint: string | undefined

    public accessibilityValue: string | undefined

    public accessibilityIdentifier: string | undefined

    public endEditing(): void {

    }

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
        const boundsChanged = this._frame.width != value.width || this._frame.height != value.height
        this._frame = value;
        this.layer.frame = value
        if (boundsChanged) {
            this.bounds = { ...value, x: 0, y: 0 }
        }
        this.setNeedsLayout(boundsChanged)
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
        this.domElement.style.transform = 'matrix(' + value.a + ', ' + value.b + ', ' + value.c + ', ' + value.d + ', ' + value.tx + ', ' + value.ty + ')'
        this.domElement.style.webkitTransform = this.domElement.style.transform
    }

    public get clipsToBounds(): boolean {
        return this._clipsToBounds;
    }

    public set clipsToBounds(value: boolean) {
        this._clipsToBounds = value;
        this.domElement.style.overflow = value ? "hidden" : null
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    public set hidden(value: boolean) {
        this._hidden = value;
        this.domElement.style.visibility = value ? 'hidden' : 'inherit'
    }

    public get opaque(): boolean {
        return this._opaque;
    }

    public set opaque(value: boolean) {
        this._opaque = value;
    }

    public get contentMode(): UIViewContentMode {
        return this._contentMode;
    }

    public set contentMode(value: UIViewContentMode) {
        this._contentMode = value;
    }

    public set tintColor(value: UIColor) {
        this._tintColor = value;
        this.tintColorDidChange()
    }

    public get tintColor(): UIColor {
        return this._tintColor || (this.superview && this.superview.tintColor) || new UIColor(0.0, 122.0 / 255.0, 1.0, 1.0);
    }

    static recognizedGesture: any

    convertPointFromWindow(point: UIPoint): UIPoint {
        return UIPointZero
    }

}

export class UIWindow extends UIView {

    constructor() {
        super()
        this.setupTouches()
    }

    setupTouches() {
        this.domElement.addEventListener("touchstart", (e) => {
            console.log(e)
            e.preventDefault()
        })
        this.domElement.addEventListener("touchmove", (e) => {
            console.log(e)
            e.preventDefault()
        })
        this.domElement.addEventListener("touchend", (e) => {
            console.log(e)
            e.preventDefault()
        })
        this.domElement.addEventListener("touchcancel", (e) => {
            console.log(e)
            e.preventDefault()
        })
    }

}