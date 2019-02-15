import { UIRect, UIRectZero, UIRectEqualToRect, UIRectIntersectsRect } from "./UIRect";
import { UIColor } from "./UIColor";
import { CALayer } from "../coregraphics/CALayer";
import { UIPoint, UIPointZero } from "./UIPoint";
import { UIAffineTransform, UIAffineTransformIdentity, UIAffineTransformIsIdentity, UIAffineTransformEqualToTransform } from "./UIAffineTransform";
import { UIViewContentMode } from "./UIEnums";
import { UIGestureRecognizer } from "./UIGestureRecognizer";
import { EventEmitter } from "../kimi/EventEmitter";
import { Matrix } from "./helpers/Matrix";
import { UITouch, UITouchPhase, VelocityTracker } from "./UITouch";
import { UIEdgeInsets, UIEdgeInsetsZero } from "./UIEdgeInsets";
import { UIAnimator, UIAnimation } from "./UIAnimator";
import { UISize } from "./UISize";
import { Router } from "./helpers/Router";
import { UILayoutController } from "./UILayoutController";

export const sharedVelocityTracker = new VelocityTracker

export class UIView extends EventEmitter {

    public domElement = document.createElement("div")
    public requireLayoutApplingAfterContentChanged = false

    constructor() {
        super()
        this.domElement.style.position = "absolute"
        this.domElement.style.userSelect = 'none';
        this.domElement.style.webkitUserSelect = 'none';
        this.domElement.style.setProperty("webkitTouchCallout", "none");
        this.layer.view = this
    }

    attachToElement(element: HTMLElement, rootViewController: any = undefined, insets: UIEdgeInsets = UIEdgeInsetsZero, appending: boolean = false) {
        if (appending !== true) {
            element.innerHTML = ""
        }
        if (element == document.body) {
            document.body.style.width = "100%"
            document.body.style.height = "100%"
            document.body.style.overflow = "hidden"
            document.body.style.margin = "0"
            document.addEventListener("contextmenu", (e) => e.preventDefault())
            if (document.documentElement) {
                document.documentElement.style.userSelect = 'none';
                document.documentElement.style.webkitUserSelect = 'none';
                document.documentElement.style.setProperty("webkitTouchCallout", "none");
            }
            document.getElementsByTagName('html')[0].style.height = "100%"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
        }
        const rootWindow = (() => {
            if (this instanceof UIWindow) {
                return this
            }
            const rootWindow = new UIWindow()
            rootWindow.clipsToBounds = true
            if ((rootViewController as any) !== undefined && (rootViewController as any)._isUIViewController === true) {
                rootWindow.rootViewController = rootViewController
            }
            else {
                rootWindow.addSubview(this)
            }
            return rootWindow
        })()
        element.appendChild(rootWindow.domElement)
        window.addEventListener("resize", () => {
            this.onResize(element, rootWindow, insets)
        })
        this.onResize(element, rootWindow, insets)
    }

    onResize(element: HTMLElement, window: UIWindow, insets: UIEdgeInsets) {
        window.frame = { x: insets.left, y: insets.top, width: element.clientWidth - insets.left - insets.right, height: element.clientHeight - insets.top - insets.bottom }
    }

    private _layer: CALayer | undefined = undefined

    public get layer(): CALayer {
        if (this._layer === undefined) {
            this._layer = new CALayer()
        }
        return this._layer
    }

    public layoutController = new UILayoutController(this)

    makeConstraints(maker: (layoutController: UILayoutController) => void) {
        this.layoutController.clear()
        maker(this.layoutController)
        this.layoutController.apply()
    }

    private _frame: UIRect = UIRectZero

    public viewDelegate: any = undefined

    public bounds: UIRect = UIRectZero

    private _transform: UIAffineTransform = UIAffineTransformIdentity

    touchAreaInsets: UIEdgeInsets = UIEdgeInsetsZero

    public tag: number = 0

    public superview: UIView | undefined = undefined

    protected _subviews: UIView[] = []

    /**
     * Getter subviews
     * @return {UIView[] }
     */
    public get subviews(): UIView[] {
        return this._subviews;
    }

    /**
     * Setter subviews
     * @param {UIView[] } value
     */
    public set subviews(value: UIView[]) {
        this._subviews = value;
    }

    public get window(): UIWindow | undefined {
        if (this instanceof UIWindow) {
            return this
        }
        else if (this.superview) {
            return this.superview.window
        }
        return undefined
    }

    public get viewController(): any {
        if (this.viewDelegate !== undefined) {
            return this.viewDelegate
        }
        else if (this.superview) {
            return this.superview.viewController
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
            this.didRemovedFromWindow()
        }
        else if (this.domElement.parentElement instanceof HTMLElement) {
            this.domElement.parentElement.removeChild(this.domElement)
        }
    }

    didRemovedFromWindow() {
        this.subviews.forEach(it => it.didRemovedFromWindow())
    }

    insertSubviewAtIndex(view: UIView, index: number): void {
        if (view.superview !== undefined) {
            view.removeFromSuperview()
        }
        view.willMoveToSuperview(this)
        view.superview = this
        this._subviews.splice(index, 0, view)
        this.domElement.insertBefore(view.domElement, this.domElement.children[index])
        this.setNeedsDisplay()
        view.didMoveToSuperview()
        this.didAddSubview(view)
    }

    exchangeSubview(index1: number, index2: number): void {
        if (index1 < index2) {
            const index1View = this._subviews[index1];
            const index2View = this._subviews[index2];
            this.domElement.removeChild(index1View.domElement);
            this.domElement.insertBefore(index1View.domElement, index2View.domElement)
            this.domElement.removeChild(index2View.domElement);
            this.domElement.insertBefore(index2View.domElement, this.domElement.children[index1]);
        }
        else if (index1 > index2) {
            const index1View = this._subviews[index1];
            const index2View = this._subviews[index2];
            this.domElement.removeChild(index2View.domElement);
            this.domElement.insertBefore(index2View.domElement, index1View.domElement)
            this.domElement.removeChild(index1View.domElement);
            this.domElement.insertBefore(index1View.domElement, this.domElement.children[index2]);
        }
        const index2View = this._subviews[index2]
        this._subviews[index2] = this._subviews[index1]
        this._subviews[index1] = index2View
    }

    addSubview(view: UIView): void {
        if (view.superview !== undefined) {
            view.removeFromSuperview()
        }
        view.willMoveToSuperview(this)
        if (this.window) {
            view.willMoveToWindow(this.window)
        }
        view.superview = this
        this._subviews.push(view)
        this.domElement.appendChild(view.domElement)
        this.setNeedsDisplay()
        view.didMoveToSuperview()
        this.didAddSubview(view)
        view.didMoveToWindow()
    }

    insertSubviewBelowSubview(view: UIView, belowSubview: UIView): void {
        let index = this._subviews.indexOf(belowSubview)
        if (index >= 0) {
            this.insertSubviewAtIndex(view, index)
        }
    }

    insertSubviewAboveSubview(view: UIView, aboveSubview: UIView): void {
        let index = this._subviews.indexOf(aboveSubview)
        if (index >= 0) {
            this.insertSubviewAtIndex(view, index + 1)
        }
    }

    bringSubviewToFront(view: UIView): void {
        let index = this._subviews.indexOf(view)
        if (index >= 0) {
            this._subviews.splice(index, 1)
            this._subviews.push(view)
            this.domElement.removeChild(view.domElement)
            this.domElement.appendChild(view.domElement)
        }
    }

    sendSubviewToBack(view: UIView): void {
        let index = this._subviews.indexOf(view)
        if (index >= 0) {
            this._subviews.splice(index, 1)
            this._subviews.unshift(view)
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

    didAddSubview(subview: UIView): void {
        if (this.viewDelegate) {
            this.viewDelegate.didAddSubview(subview)
        }
    }

    willRemoveSubview(subview: UIView): void {
        subview.layoutController.clear()
    }

    willMoveToSuperview(newSuperview: UIView | undefined): void {
    }

    didMoveToSuperview(): void {
        this.tintColorDidChange()
    }

    willMoveToWindow(window: UIWindow | undefined): void {
        this.subviews.forEach(it => it.willMoveToWindow(window))
    }

    didMoveToWindow(): void {
        this.subviews.forEach(it => it.didMoveToWindow())
    }

    private _layoutTimer: any

    setNeedsLayout(layoutSubviews = false): void {
        if (!layoutSubviews) {
            if (!UIAnimator.duringAnimationValueSet) {
                this.layoutController.apply()
            }
            return
        }
        this.layoutIfNeeded()
    }

    layoutIfNeeded(): void {
        this.layoutSubviews()
    }

    layoutSubviews(): void {
        if (this.viewDelegate) {
            this.viewDelegate.viewWillLayoutSubviews()
            if (!UIAnimator.duringAnimationValueSet) {
                this.layoutController.apply()
            }
            this.viewDelegate.viewDidLayoutSubviews()
        }
        else {
            if (!UIAnimator.duringAnimationValueSet) {
                this.layoutController.apply()
            }
        }
    }

    // Rendering

    setNeedsDisplay(): void { }

    private _clipsToBounds: boolean = false

    private _backgroundColor: UIColor | undefined = undefined

    private _alpha: number = 1.0

    public _hidden: boolean = false

    private _opaque: boolean = false

    protected _contentMode: UIViewContentMode = UIViewContentMode.scaleToFill

    private _tintColor: UIColor | undefined = undefined

    tintColorDidChange(): void {
        this._subviews.forEach(it => it.tintColorDidChange())
    }

    // GestureRecognizers

    private _userInteractionEnabled: boolean = true

    public get userInteractionEnabled(): boolean {
        return this._userInteractionEnabled;
    }

    public set userInteractionEnabled(value: boolean) {
        if (this._userInteractionEnabled === value) { return }
        this._userInteractionEnabled = value;
        this.domElement.style.pointerEvents = value ? "auto" : "none"
    }

    public gestureRecognizers: UIGestureRecognizer[] = []

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

    private alpha_animation: UIAnimation | undefined

    public set alpha(value: number) {
        if (!UIAnimator.duringAnimationValueSet) {
            if (this.alpha_animation) {
                this.alpha_animation.cancel()
                this.alpha_animation = undefined
            }
        }
        if (UIAnimator.activeAnimator && !UIAnimator.duringAnimationValueSet) {
            if (UIAnimator.activeAnimator.animationCreater) {
                const animation = UIAnimator.activeAnimator.animationCreater()
                this.alpha_animation = animation
                animation.setUpdateListener((newValue) => {
                    UIAnimator.duringAnimationValueSet = true
                    this.alpha = newValue
                    UIAnimator.duringAnimationValueSet = false
                })
                animation.setStartValue(this.alpha)
                animation.setEndValue(value)
                return
            }
        }
        if (this._alpha === value) {
            return
        }
        this._alpha = value;
        this.resetDisplayStyle()
        this.domElement.style.opacity = value.toString()
    }

    public get backgroundColor(): UIColor | undefined {
        return this._backgroundColor;
    }

    private backgroundColor_animations: UIAnimation[] = []

    public set backgroundColor(value: UIColor | undefined) {
        if (!UIAnimator.duringAnimationValueSet) {
            if (this.backgroundColor_animations) {
                this.backgroundColor_animations.forEach(it => it.cancel())
                this.backgroundColor_animations = []
            }
        }
        if (UIAnimator.activeAnimator && !UIAnimator.duringAnimationValueSet) {
            if (UIAnimator.activeAnimator.animationCreater && this._backgroundColor && value) {
                const animations = []
                if (this._backgroundColor.r != value.r) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const backgroundColor = this.backgroundColor
                        if (backgroundColor) {
                            UIAnimator.duringAnimationValueSet = true
                            this.backgroundColor = new UIColor(Math.max(0.0, Math.min(1.0, it)), backgroundColor.g, backgroundColor.b, backgroundColor.a)
                            UIAnimator.duringAnimationValueSet = false
                        }
                    })
                    animation.setStartValue(this._backgroundColor.r)
                    animation.setEndValue(value.r)
                    animations.push(animation)
                }
                if (this._backgroundColor.g != value.g) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const backgroundColor = this.backgroundColor
                        if (backgroundColor) {
                            UIAnimator.duringAnimationValueSet = true
                            this.backgroundColor = new UIColor(backgroundColor.r, Math.max(0.0, Math.min(1.0, it)), backgroundColor.b, backgroundColor.a)
                            UIAnimator.duringAnimationValueSet = false
                        }
                    })
                    animation.setStartValue(this._backgroundColor.g)
                    animation.setEndValue(value.g)
                    animations.push(animation)
                }
                if (this._backgroundColor.b != value.b) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const backgroundColor = this.backgroundColor
                        if (backgroundColor) {
                            UIAnimator.duringAnimationValueSet = true
                            this.backgroundColor = new UIColor(backgroundColor.r, backgroundColor.g, Math.max(0.0, Math.min(1.0, it)), backgroundColor.a)
                            UIAnimator.duringAnimationValueSet = false
                        }
                    })
                    animation.setStartValue(this._backgroundColor.b)
                    animation.setEndValue(value.b)
                    animations.push(animation)
                }
                if (this._backgroundColor.a != value.a) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const backgroundColor = this.backgroundColor
                        if (backgroundColor) {
                            UIAnimator.duringAnimationValueSet = true
                            this.backgroundColor = new UIColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, Math.max(0.0, Math.min(1.0, it)))
                            UIAnimator.duringAnimationValueSet = false
                        }
                    })
                    animation.setStartValue(this._backgroundColor.a)
                    animation.setEndValue(value.a)
                    animations.push(animation)
                }
                this.backgroundColor_animations = animations
                return
            }
        }
        if (this._backgroundColor && value && this._backgroundColor.r === value.r && this._backgroundColor.g === value.g && this._backgroundColor.b === value.b && this._backgroundColor.a === value.a) {
            return
        }
        this._backgroundColor = value;
        if (value && value.a <= 0.0) {
            this.domElement.style.backgroundColor = null
        }
        else {
            this.domElement.style.backgroundColor = value ? value.toStyle() : null
        }
    }

    public get frame(): UIRect {
        return this._frame;
    }

    private frame_animations: UIAnimation[] = []

    public set frame(value: UIRect) {
        if (!UIAnimator.duringAnimationValueSet) {
            this.frame_animations.forEach(it => it.cancel())
            this.frame_animations = []
        }
        if (UIAnimator.activeAnimator && !UIAnimator.duringAnimationValueSet) {
            if (UIAnimator.activeAnimator.animationCreater) {
                const animations = []
                if (this._frame.x !== value.x) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        UIAnimator.duringAnimationValueSet = true
                        this.frame = { ...this.frame, x: it }
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(this._frame.x)
                    animation.setEndValue(value.x)
                    animations.push(animation)
                }
                if (this._frame.y !== value.y) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        UIAnimator.duringAnimationValueSet = true
                        this.frame = { ...this.frame, y: it }
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(this._frame.y)
                    animation.setEndValue(value.y)
                    animations.push(animation)
                }
                if (this._frame.width !== value.width) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        UIAnimator.duringAnimationValueSet = true
                        this.frame = { ...this.frame, width: it }
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(this._frame.width)
                    animation.setEndValue(value.width)
                    animations.push(animation)
                }
                if (this._frame.height !== value.height) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        UIAnimator.duringAnimationValueSet = true
                        this.frame = { ...this.frame, height: it }
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(this._frame.height)
                    animation.setEndValue(value.height)
                    animations.push(animation)
                }
                this.frame_animations = animations
                return
            }
        }
        if (UIRectEqualToRect(this._frame, value)) { return }
        const oldValue = this._frame
        const boundsChanged = this._frame.width != value.width || this._frame.height != value.height
        this._frame = value;
        if (boundsChanged) {
            this.bounds = { x: 0, y: 0, width: value.width, height: value.height }
            this.layer.frame = { x: 0, y: 0, width: value.width, height: value.height }
        }
        this.setNeedsLayout(boundsChanged)
        if (Math.abs(oldValue.x - value.x) > 0.001 || Math.abs(oldValue.y - value.y) > 0.001) {
            this.resetOriginAndTransform()
        }
        if (Math.abs(oldValue.width - value.width) > 0.001) {
            this.domElement.style.width = value.width.toString() + "px"
        }
        if (Math.abs(oldValue.height - value.height) > 0.001) {
            this.domElement.style.height = value.height.toString() + "px"
        }
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

    private transform_animations: UIAnimation[] = []

    public set transform(value: UIAffineTransform) {
        if (!UIAnimator.duringAnimationValueSet) {
            this.transform_animations.forEach(it => it.cancel())
            this.transform_animations = []
        }
        if (UIAnimator.activeAnimator && !UIAnimator.duringAnimationValueSet) {
            if (UIAnimator.activeAnimator.animationCreater) {
                const animations = []
                const fieldUnmatrix = Matrix.unmatrix(this._transform as Matrix)
                const valueUnmatrix = Matrix.unmatrix(value as Matrix)
                if (fieldUnmatrix.scale.x != valueUnmatrix.scale.x) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const matrix = new Matrix()
                        matrix.setValues(this._transform)
                        matrix.setScale(it)
                        UIAnimator.duringAnimationValueSet = true
                        this.transform = matrix.getValues()
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(fieldUnmatrix.scale.x)
                    animation.setEndValue(valueUnmatrix.scale.x)
                    animations.push(animation)
                }
                if (fieldUnmatrix.scale.y != valueUnmatrix.scale.y) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const matrix = new Matrix()
                        matrix.setValues(this._transform)
                        matrix.setScale(undefined, it)
                        UIAnimator.duringAnimationValueSet = true
                        this.transform = matrix.getValues()
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(fieldUnmatrix.scale.y)
                    animation.setEndValue(valueUnmatrix.scale.y)
                    animations.push(animation)
                }
                if (fieldUnmatrix.degree != valueUnmatrix.degree) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const matrix = new Matrix()
                        matrix.setValues(this._transform)
                        matrix.setRotate(it * Math.PI / 180.0)
                        UIAnimator.duringAnimationValueSet = true
                        this.transform = matrix.getValues()
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(fieldUnmatrix.degree)
                    animation.setEndValue(valueUnmatrix.degree)
                    animations.push(animation)
                }
                if (fieldUnmatrix.translate.x != valueUnmatrix.translate.x) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const matrix = new Matrix()
                        matrix.setValues(this._transform)
                        matrix.setTranslate(it)
                        UIAnimator.duringAnimationValueSet = true
                        this.transform = matrix.getValues()
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(fieldUnmatrix.translate.x)
                    animation.setEndValue(valueUnmatrix.translate.x)
                    animations.push(animation)
                }
                if (fieldUnmatrix.translate.y != valueUnmatrix.translate.y) {
                    const animation = UIAnimator.activeAnimator.animationCreater()
                    animation.setUpdateListener((it) => {
                        const matrix = new Matrix()
                        matrix.setValues(this._transform)
                        matrix.setTranslate(undefined, it)
                        UIAnimator.duringAnimationValueSet = true
                        this.transform = matrix.getValues()
                        UIAnimator.duringAnimationValueSet = false
                    })
                    animation.setStartValue(fieldUnmatrix.translate.y)
                    animation.setEndValue(valueUnmatrix.translate.y)
                    animations.push(animation)
                }
                return
            }
        }
        if (UIAffineTransformEqualToTransform(this._transform, value)) {
            return
        }
        this._transform = value;
        this.resetOriginAndTransform()
    }

    private resetOriginAndTransform() {
        if (UIAffineTransformIsIdentity(this._transform)) {
            this.domElement.style.left = null
            this.domElement.style.top = null
            this.domElement.style.transform = `translate(${this.frame.x}px, ${this.frame.y}px)`
        }
        else {
            this.domElement.style.left = this.frame.x + "px"
            this.domElement.style.top = this.frame.y + "px"
            this.domElement.style.transform = 'matrix(' + this.transform.a + ', ' + this.transform.b + ', ' + this.transform.c + ', ' + this.transform.d + ', ' + this.transform.tx + ', ' + this.transform.ty + ')'
        }
        this.domElement.style.webkitTransform = this.domElement.style.transform
    }

    public get clipsToBounds(): boolean {
        return this._clipsToBounds;
    }

    public set clipsToBounds(value: boolean) {
        if (this._clipsToBounds === value) { return }
        this._clipsToBounds = value;
        this.domElement.style.overflow = value ? "hidden" : null
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    public set hidden(value: boolean) {
        if (this._hidden === value) { return }
        this._hidden = value;
        this.resetDisplayStyle()
        this.visibilityChanged()
    }

    protected visibilityChanged() {
        this.subviews.forEach(it => it.visibilityChanged())
    }

    private resetDisplayStyle() {
        this.domElement.style.display = (this.hidden || this.alpha <= 0.0) ? 'none' : null
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

    convertPointToView(point: UIPoint, toView: UIView): UIPoint {
        const fromPoint = this.convertPointToWindow(point)
        if (!fromPoint) {
            return point
        }
        if (toView instanceof UIWindow) {
            return fromPoint
        }
        return toView.convertPointFromWindow(fromPoint) || point
    }

    convertPointFromView(point: UIPoint, fromView: UIView): UIPoint {
        return fromView.convertPointToView(point, this)
    }

    convertRectToView(rect: UIRect, toView: UIView): UIRect {
        let lt = this.convertPointToView({ x: rect.x, y: rect.y }, toView)
        let rt = this.convertPointToView({ x: rect.x + rect.width, y: rect.y }, toView)
        let lb = this.convertPointToView({ x: rect.x, y: rect.y + rect.height }, toView)
        let rb = this.convertPointToView({ x: rect.x + rect.width, y: rect.y + rect.height }, toView)
        return {
            x: Math.min(lt.x, rt.x, lb.x, rb.x),
            y: Math.min(lt.y, rt.y, lb.y, rb.y),
            width: Math.max(lt.x, rt.x, lb.x, rb.x) - Math.min(lt.x, rt.x, lb.x, rb.x),
            height: Math.max(lt.y, rt.y, lb.y, rb.y) - Math.min(lt.y, rt.y, lb.y, rb.y),
        }
    }

    convertRectFromView(rect: UIRect, fromView: UIView): UIRect {
        return fromView.convertRectToView(rect, this)
    }

    convertPointToWindow(point: UIPoint): UIPoint | undefined {
        if (this.window === undefined) {
            return undefined
        }
        var current: UIView | undefined = this
        let currentPoint = { x: point.x, y: point.y }
        while (current !== undefined) {
            if (current instanceof UIWindow) { break }
            if (!UIAffineTransformIsIdentity(current.transform)) {
                const unmatrix = Matrix.unmatrix(current.transform as Matrix)
                const matrix2 = new Matrix()
                matrix2.postTranslate(-(current.frame.width / 2.0), -(current.frame.height / 2.0))
                matrix2.postRotate(unmatrix.degree / (180.0 / Math.PI))
                matrix2.postScale(unmatrix.scale.x, unmatrix.scale.y)
                matrix2.postTranslate(unmatrix.translate.x, unmatrix.translate.y)
                matrix2.postTranslate((current.frame.width / 2.0), (current.frame.height / 2.0))
                const x = currentPoint.x;
                const y = currentPoint.y;
                currentPoint.x = x * matrix2.a + y * matrix2.c + matrix2.tx;
                currentPoint.y = x * matrix2.b + y * matrix2.d + matrix2.ty;
            }
            if (current.superview !== undefined && (current.superview as any).isScrollerView === true) {
                currentPoint.x += -(current.superview as any).domElement.scrollLeft
                currentPoint.y += -(current.superview as any).domElement.scrollTop
            }
            currentPoint.x += current.frame.x
            currentPoint.y += current.frame.y
            current = current.superview
        }
        return currentPoint
    }

    convertPointFromWindow(point: UIPoint): UIPoint | undefined {
        if (this.window == undefined) {
            return undefined
        }
        var current: UIView | undefined = this
        var routes: UIView[] = []
        while (current !== undefined) {
            if (current instanceof UIWindow) { break }
            routes.unshift(current)
            current = current.superview
        }
        let currentPoint = { x: point.x, y: point.y }
        routes.forEach((it) => {
            if (it.superview !== undefined && (it.superview as any).isScrollerView === true) {
                currentPoint.x -= -(it.superview as any).domElement.scrollLeft
                currentPoint.y -= -(it.superview as any).domElement.scrollTop
            }
            currentPoint.x -= it.frame.x
            currentPoint.y -= it.frame.y
            if (!UIAffineTransformIsIdentity(it.transform)) {
                const unmatrix = Matrix.unmatrix(it.transform as Matrix)
                const matrix2 = new Matrix()
                matrix2.postTranslate(-(it.frame.width / 2.0), -(it.frame.height / 2.0))
                matrix2.postRotate(unmatrix.degree / (180.0 / Math.PI))
                matrix2.postScale(unmatrix.scale.x, unmatrix.scale.y)
                matrix2.postTranslate(unmatrix.translate.x, unmatrix.translate.y)
                matrix2.postTranslate((it.frame.width / 2.0), (it.frame.height / 2.0))
                const id = 1 / ((matrix2.a * matrix2.d) + (matrix2.c * -matrix2.b));
                const x = currentPoint.x;
                const y = currentPoint.y;
                currentPoint.x = (matrix2.d * id * x) + (-matrix2.c * id * y) + (((matrix2.ty * matrix2.c) - (matrix2.tx * matrix2.d)) * id);
                currentPoint.y = (matrix2.a * id * y) + (-matrix2.b * id * x) + (((-matrix2.ty * matrix2.a) + (matrix2.tx * matrix2.b)) * id);
            }
        })
        return currentPoint
    }

    // Touches

    hitTest(point: UIPoint): UIView | undefined {
        if (this.userInteractionEnabled && this.alpha > 0.0 && !this.hidden && this.pointInside(point)) {
            for (let index = this._subviews.length - 1; index >= 0; index--) {
                const it = this._subviews[index]
                const convertedPoint = it.convertPointFromView(point, this)
                const testedView = it.hitTest(convertedPoint)
                if (testedView !== undefined) {
                    return testedView
                }
            }
            return this
        }
        return undefined
    }

    touchesBegan(touches: UITouch[]) {
        this.gestureRecognizers.filter((it) => it.enabled).forEach((it) => {
            it.handleTouch(touches)
        })
        if (this.superview) {
            this.superview.touchesBegan(touches)
        }
    }

    touchesMoved(touches: UITouch[]) {
        this.gestureRecognizers.filter((it) => it.enabled).forEach((it) => {
            it.handleTouch(touches)
        })
        if (this.superview) {
            this.superview.touchesMoved(touches)
        }
    }

    touchesEnded(touches: UITouch[]) {
        this.gestureRecognizers.filter((it) => it.enabled).forEach((it) => {
            it.handleTouch(touches)
        })
        if (this.superview) {
            this.superview.touchesEnded(touches)
        }
    }

    touchesCancelled(touches: UITouch[]) {
        this.gestureRecognizers.filter((it) => it.enabled).forEach((it) => {
            it.handleTouch(touches)
        })
        if (this.superview) {
            this.superview.touchesCancelled(touches)
        }
    }

    touchesWheel(delta: UIPoint) {
        if (this.superview) {
            this.superview.touchesWheel(delta)
        }
    }

    intrinsicContentSize(width: number | undefined = undefined): UISize | undefined {
        return undefined
    }

    pointInside(point: UIPoint): boolean {
        return point.x >= 0.0 - this.touchAreaInsets.left &&
            point.y >= 0.0 - this.touchAreaInsets.top &&
            point.x <= this.frame.width + this.touchAreaInsets.right &&
            point.y <= this.frame.height + this.touchAreaInsets.bottom
    }

}

export class UIWindow extends UIView {

    constructor() {
        super()
        this.setupTouches()
    }

    private shouldPreventDefault = true
    private currentTouchesID: number[] = []
    private touches: { [key: number]: UITouch } = {}
    private upCount: Map<UIPoint, number> = new Map()
    private upTimestamp: Map<UIPoint, number> = new Map()

    private handleMouseWheel(e: MouseWheelEvent) {
        let shouldPreventDefault = true
        const point: UIPoint = { x: e.pageX, y: e.pageY }
        const deltaPoint: UIPoint = { x: -(e as any).deltaX, y: -(e as any).deltaY }
        const target = this.hitTest(point)
        if (target) {
            if (target instanceof UINativeTouchView) {
                shouldPreventDefault = false
                return false
            }
            target.touchesWheel(deltaPoint)
        }
        if (shouldPreventDefault) {
            e.preventDefault()
        }
    }

    private handleTouchStart(e: TouchEvent) {
        const changedTouches = this.standardlizeTouches(e)
        for (let index = 0; index < changedTouches.length; index++) {
            const pointer = changedTouches[index];
            const pointerIdentifier = this.standardlizeTouchIdentifier(pointer)
            this.currentTouchesID.push(pointerIdentifier)
            const point: UIPoint = { x: pointer.pageX, y: pointer.pageY }
            const target = this.hitTest(point)
            if (target) {
                if (target instanceof UINativeTouchView) {
                    this.shouldPreventDefault = false
                    return false
                }
                const touch = new UITouch()
                this.touches[pointerIdentifier] = touch
                touch.identifier = pointerIdentifier
                touch.phase = UITouchPhase.began
                touch.tapCount = (() => {
                    for (const [key, value] of this.upCount) {
                        const timestamp = this.upTimestamp.get(key) || 0.0
                        if (Date.now() / 1000.0 - timestamp < 1.0
                            && Math.abs(key.x - point.x) < 44.0 && Math.abs(key.y - point.y) < 44.0) {
                            return value + 1
                        }
                    }
                    return 1
                })()
                touch.timestamp = Date.now() / 1000.0
                touch.window = this
                touch.windowPoint = point
                touch.view = target
                if (touch.identifier == 0) {
                    sharedVelocityTracker.addMovement(touch)
                }
                touch.view.touchesBegan([touch])
            }
        }
        if (this.shouldPreventDefault) {
            e.preventDefault()
        }
    }

    private handleTouchMove(e: TouchEvent) {
        const changedTouches = this.standardlizeTouches(e)
        for (let index = 0; index < changedTouches.length; index++) {
            const pointer = changedTouches[index];
            const pointerIdentifier = this.standardlizeTouchIdentifier(pointer)
            const point: UIPoint = { x: pointer.pageX, y: pointer.pageY }
            const touch = this.touches[pointerIdentifier]
            if (touch === undefined) {
                return false
            }
            touch.phase = UITouchPhase.moved
            touch.timestamp = Date.now() / 1000.0
            touch.windowPoint = point
            if (touch.identifier == 0) {
                sharedVelocityTracker.addMovement(touch)
            }
            if (touch.view) {
                touch.view.touchesMoved([touch])
            }
        }
        if (this.shouldPreventDefault) {
            e.preventDefault()
        }
    }

    private handleTouchEnd(e: TouchEvent) {
        const changedTouches = this.standardlizeTouches(e)
        for (let index = 0; index < changedTouches.length; index++) {
            const pointer = changedTouches[index];
            const pointerIdentifier = this.standardlizeTouchIdentifier(pointer)
            const point: UIPoint = { x: pointer.pageX, y: pointer.pageY }
            const touch = this.touches[pointerIdentifier]
            if (touch !== undefined) {
                touch.phase = UITouchPhase.ended
                touch.timestamp = Date.now() / 1000.0
                touch.windowPoint = point
                if (touch.identifier == 0) {
                    sharedVelocityTracker.addMovement(touch)
                }
                if (touch.view) {
                    touch.view.touchesEnded([touch])
                }
            }
            const idx = this.currentTouchesID.indexOf(pointerIdentifier)
            if (idx >= 0) {
                this.currentTouchesID.splice(idx, 1)
            }
        }
        if (this.currentTouchesID.length == 0) {
            this.upCount.clear()
            this.upTimestamp.clear()
            for (const key in this.touches) {
                if (this.touches.hasOwnProperty(key)) {
                    const it = this.touches[key];
                    if (it.windowPoint) {
                        this.upCount.set(it.windowPoint, it.tapCount)
                        this.upTimestamp.set(it.windowPoint, it.timestamp)
                    }
                }
            }
            this.touches = {}
            sharedVelocityTracker.reset()
            setTimeout(() => {
                UIView.recognizedGesture = undefined
            }, 0)
        }
        if (this.shouldPreventDefault) {
            e.preventDefault()
        }
        if (this.currentTouchesID.length == 0) {
            this.shouldPreventDefault = true
        }
    }

    private handleTouchCancel(e: TouchEvent) {
        const changedTouches = this.standardlizeTouches(e)
        for (let index = 0; index < changedTouches.length; index++) {
            const pointer = changedTouches[index];
            const pointerIdentifier = this.standardlizeTouchIdentifier(pointer)
            const point: UIPoint = { x: pointer.pageX, y: pointer.pageY }
            const touch = this.touches[pointerIdentifier]
            if (touch) {
                touch.phase = UITouchPhase.cancelled
                touch.timestamp = Date.now() / 1000.0
                touch.windowPoint = point
                if (touch.identifier == 0) {
                    sharedVelocityTracker.addMovement(touch)
                }
                if (touch.view) {
                    touch.view.touchesCancelled([touch])
                }
            }
        }
        this.upCount.clear()
        this.upTimestamp.clear()
        this.touches = {}
        if (this.shouldPreventDefault) {
            e.preventDefault()
        }
        this.shouldPreventDefault = true
    }

    private standardlizeTouches(e: TouchEvent): Touch[] {
        if (e.changedTouches) {
            return new Array(e.changedTouches.length)
                .fill(0)
                .map((_, i) => e.changedTouches[i])
                .map(it => {
                    if (it.identifier < -100 || it.identifier > 100) {
                        (it as any).identifier_2 = (() => {
                            for (let index = 0; index < e.touches.length; index++) {
                                if (e.touches[index].identifier === it.identifier) {
                                    return index
                                }
                            }
                            return 0
                        })()
                        return it
                    }
                    else {
                        return it
                    }
                })
        }
        else if (e.constructor.toString().startsWith("function MouseEvent()")) {
            const ee: MouseEvent = e as any
            return [
                {
                    identifier: 0,
                    pageX: ee.pageX,
                    pageY: ee.pageY,
                }
            ] as Touch[]
        }
        else {
            return []
        }
    }

    private standardlizeTouchIdentifier(touch: any): number {
        return typeof touch.identifier_2 === "number" ? touch.identifier_2 : touch.identifier
    }

    private mouseDowned = false

    setupTouches() {
        if ("ontouchend" in document) {
            this.domElement.addEventListener("touchstart", (e) => {
                this.handleTouchStart(e)
            })
            this.domElement.addEventListener("touchmove", (e) => {
                this.handleTouchMove(e)
            })
            this.domElement.addEventListener("touchend", (e) => {
                this.handleTouchEnd(e)
            })
            this.domElement.addEventListener("touchcancel", (e) => {
                this.handleTouchCancel(e)
            })
        }
        else {
            this.domElement.addEventListener("mousedown", (e) => {
                this.mouseDowned = true
                this.handleTouchStart(e as any)
            })
            this.domElement.addEventListener("mousemove", (e) => {
                if (!this.mouseDowned) { return }
                this.handleTouchMove(e as any)
            })
            this.domElement.addEventListener("mouseup", (e) => {
                this.handleTouchEnd(e as any)
                this.mouseDowned = false
            })
        }
        if ("onmousewheel" in document) {
            this.domElement.addEventListener("mousewheel", (e) => {
                this.handleMouseWheel(e as any)
                this.mouseDowned = false
            })
        }
    }

    private _rootViewController: any | undefined = undefined

    public get rootViewController(): any | undefined {
        return this._rootViewController;
    }

    public set rootViewController(value: any | undefined) {
        if (this._rootViewController) {
            (this._rootViewController as any).window = undefined
            this._rootViewController.iView.removeFromSuperview()
        }
        this._rootViewController = value;
        if (this._rootViewController) {
            (this._rootViewController as any).window = this
            this.addSubview((this._rootViewController as any).iView)
        }
    }

    presentedViewControllers: any[] = []

    presentViewController(viewController: any, animated: boolean, complete: (() => void) | undefined = undefined) {
        this.presentedViewControllers.push(viewController)
        viewController.window = this
        this.addSubview(viewController.iView)
        Router.shared.addRoute(viewController, () => {
            viewController.dismissViewController(false)
        })
        if (animated) {
            viewController.iView.frame = { x: 0.0, y: this.bounds.height, width: this.bounds.width, height: this.bounds.height }
            UIAnimator.bouncy(0.0, 24.0, () => {
                viewController.iView.frame = this.bounds
            }, () => {
                this.presentedViewControllers.forEach(it => {
                    if (it == viewController) { return }
                    it.iView.hidden = true
                })
                complete && complete()
            })
        }
        else {
            viewController.iView.frame = this.bounds
            this.presentedViewControllers.forEach(it => {
                if (it == viewController) { return }
                it.iView.hidden = true
            })
            complete && complete()
        }
    }

    dismissViewController(animated: Boolean, complete: (() => void) | undefined = undefined) {
        if (this.presentedViewControllers.length > 0) {
            const fromViewController = this.presentedViewControllers[this.presentedViewControllers.length - 1]
            const toViewController = fromViewController.presentingViewController
            if (toViewController === undefined) { return }
            toViewController.iView.hidden = false
            {
                const idx = this.presentedViewControllers.indexOf(fromViewController)
                if (idx >= 0) {
                    this.presentedViewControllers.splice(idx, 1)
                }
            }
            fromViewController.viewWillDisappear(animated)
            toViewController.viewWillAppear(animated)
            if (fromViewController.presentingViewController) {
                fromViewController.presentingViewController.presentedViewController = undefined
            }
            fromViewController.presentingViewController = undefined
            fromViewController.window = undefined
            Router.shared.popToRoute(toViewController)
            if (animated) {
                UIAnimator.bouncy(0.0, 24.0, () => {
                    fromViewController.iView.frame = { x: 0.0, y: this.bounds.height, width: this.bounds.width, height: this.bounds.height }
                }, () => {
                    fromViewController.iView.removeFromSuperview()
                    complete && complete()
                    fromViewController.viewDidDisappear(animated)
                    toViewController.viewDidAppear(animated)
                })
            }
            else {
                fromViewController.iView.removeFromSuperview()
                complete && complete()
                fromViewController.viewDidDisappear(animated)
                toViewController.viewDidAppear(animated)
            }
        }
    }

    layoutSubviews() {
        super.layoutSubviews()
        if (this.rootViewController) {
            this.rootViewController.iView.frame = this.bounds
        }
    }

}

export class UINativeTouchView extends UIView { }