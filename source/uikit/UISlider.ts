import { UIView } from "./UIView";
import { UIPoint } from "./UIPoint";
import { UIAnimator } from "./UIAnimator";
import { UILongPressGestureRecognizer } from "./UILongPressGestureRecognizer";
import { UIColor } from "./UIColor";

class ThumbView extends UIView {

    pointInside(point: UIPoint): boolean {
        return point.x >= -22.0 && point.y >= -22.0 && point.x <= this.frame.width + 22.0 && point.y <= this.frame.height + 22.0
    }

}

export class UISlider extends UIView {

    value: number = 0.5

    minimumValue: number = 0.0

    maximumValue: number = 1.0

    private _minimumTrackTintColor: UIColor | undefined = undefined

    public get minimumTrackTintColor(): UIColor | undefined {
        return this._minimumTrackTintColor;
    }

    public set minimumTrackTintColor(value: UIColor | undefined) {
        this._minimumTrackTintColor = value;
        this.minimumTrackView.backgroundColor = value
    }

    private _maximumTrackTintColor: UIColor | undefined = undefined

    public get maximumTrackTintColor(): UIColor | undefined {
        return this._maximumTrackTintColor;
    }

    public set maximumTrackTintColor(value: UIColor | undefined) {
        this._maximumTrackTintColor = value;
        this.maximumTrackView.backgroundColor = value
    }

    private _thumbTintColor: UIColor | undefined = undefined

    public get thumbTintColor(): UIColor | undefined {
        return this._thumbTintColor;
    }

    public set thumbTintColor(value: UIColor | undefined) {
        this._thumbTintColor = value;
        if (value) {
            this.thumbView.backgroundColor = value
            this.thumbOutLightView.backgroundColor = value.colorWithAlphaComponent(0.2)
        }
    }

    setValue(value: number, animated: boolean): void {
        if (animated) {
            this.value = value
            UIAnimator.curve(0.5, () => { this.layoutSubviews() }, undefined)
        }
        else {
            this.value = value
            this.layoutSubviews()
        }
    }

    // Implementation

    private minimumTrackView = new UIView()
    private maximumTrackView = new UIView()
    private thumbView = new ThumbView()
    private thumbOutLightView = new UIView()
    private _tracking: boolean = false

    public get tracking(): boolean {
        return this._tracking;
    }

    public set tracking(value: boolean) {
        if (this._tracking === value) { return }
        this._tracking = value;
        UIAnimator.linear(0.15, () => {
            if (value) {
                this.thumbView.transform = { a: 1.4, b: 0.0, c: 0.0, d: 1.4, tx: 0.0, ty: 0.0 }
                this.thumbOutLightView.transform = { a: 2.4, b: 0.0, c: 0.0, d: 2.4, tx: 0.0, ty: 0.0 }
            }
            else {
                this.thumbView.transform = { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0 }
                this.thumbOutLightView.transform = { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0 }
            }
        }, undefined)
    }

    constructor() {
        super()
        if (this.tintColor) {
            this.minimumTrackTintColor = this.tintColor
            this.maximumTrackTintColor = this.tintColor.colorWithAlphaComponent(0.3)
            this.thumbTintColor = this.tintColor
        }
        this.maximumTrackView.userInteractionEnabled = false
        this.addSubview(this.maximumTrackView)
        this.minimumTrackView.userInteractionEnabled = false
        this.addSubview(this.minimumTrackView)
        this.thumbOutLightView.userInteractionEnabled = false
        this.addSubview(this.thumbOutLightView)
        this.addSubview(this.thumbView)
        this.setupTouches()
    }

    private previousLocation: UIPoint | undefined = undefined

    setupTouches() {
        const longPressGesture = new UILongPressGestureRecognizer()
        longPressGesture.on("began", (sender: UILongPressGestureRecognizer) => {
            this.previousLocation = sender.locationInView(this)
            this.tracking = true
        })
        longPressGesture.on("changed", (sender: UILongPressGestureRecognizer) => {
            const previousLocation = this.previousLocation
            if (!previousLocation) { return }
            const location = sender.locationInView(this)
            if (location.x < 0.0 || location.x > this.bounds.width) { return }
            const translationX = location.x - previousLocation.x
            this.previousLocation = location
            const newValue = this.value + translationX / this.frame.width * (this.maximumValue - this.minimumValue)
            this.value = Math.max(this.minimumValue, Math.min(this.maximumValue, newValue))
            this.emit("valueChanged", this)
            this.layoutSubviews()
        })
        longPressGesture.on("ended", () => {
            this.tracking = false
        })
        longPressGesture.on("cancelled", () => {
            this.tracking = false
        })
        longPressGesture.minimumPressDuration = 0.0
        this.thumbView.addGestureRecognizer(longPressGesture)
    }

    layoutSubviews() {
        super.layoutSubviews()
        const progress = Math.max(0.0, Math.min(1.0, (this.value - this.minimumValue) / (this.maximumValue - this.minimumValue)))
        this.maximumTrackView.frame = { x: 0.0, y: (this.bounds.height - 4.0) / 2.0, width: this.bounds.width, height: 4.0 }
        this.minimumTrackView.frame = { x: 0.0, y: (this.bounds.height - 4.0) / 2.0, width: this.bounds.width * progress, height: 4.0 }
        this.thumbOutLightView.frame = { x: -7.5 + this.bounds.width * progress, y: (this.bounds.height - 15.0) / 2.0, width: 15.0, height: 15.0 }
        this.thumbOutLightView.layer.cornerRadius = 7.5
        this.thumbView.frame = { x: -7.5 + this.bounds.width * progress, y: (this.bounds.height - 15.0) / 2.0, width: 15.0, height: 15.0 }
        this.thumbView.layer.cornerRadius = 7.5
    }

    pointInside(point: UIPoint): boolean {
        return point.x >= -22.0 && point.y >= -(44.0 - this.frame.height) / 2.0 && point.x <= this.frame.width + 22.0 && point.y <= this.frame.height + (44.0 - this.frame.height) / 2.0
    }

}