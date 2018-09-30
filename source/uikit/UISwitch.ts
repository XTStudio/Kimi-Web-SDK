import { UIView } from "./UIView";
import { UIPoint } from "./UIPoint";
import { UIColor } from "./UIColor";
import { UIAnimator } from "./UIAnimator";
import { UILongPressGestureRecognizer } from "./UILongPressGestureRecognizer";

class ThumbView extends UIView {

    pointInside(point: UIPoint): boolean {
        return point.x >= -22.0 && point.y >= -22.0 && point.x <= this.frame.width + 22.0 && point.y <= this.frame.height + 22.0
    }

}

export class UISwitch extends UIView {

    onTintColor: UIColor | undefined = this.tintColor

    thumbTintColor: UIColor | undefined = UIColor.white

    private _isOn: boolean = false

    public get isOn(): boolean {
        return this._isOn;
    }

    public set isOn(value: boolean) {
        this._isOn = value;
        this.layoutSubviews()
    }


    setOn(on: boolean, animated: boolean) {
        if (animated) {
            UIAnimator.curve(0.20, () => { this.isOn = on }, undefined)
        }
        else {
            this.isOn = on
        }
    }

    // Implementation

    private tintView = new UIView()
    private thumbView = new ThumbView()
    private thumbOutLightView = new UIView()
    private _tracking: boolean = false

    public get tracking(): boolean {
        return this._tracking;
    }

    public set tracking(value: boolean) {
        if (this._tracking == value) { return }
        this._tracking = value
        UIAnimator.linear(0.15, () => {
            if (value) {
                this.thumbOutLightView.transform = { a: 1.6, b: 0.0, c: 0.0, d: 1.6, tx: 0.0, ty: 0.0 }
            }
            else {
                this.thumbOutLightView.transform = { a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0 }
            }
        }, undefined)
    }

    constructor() {
        super()
        this.tintView.userInteractionEnabled = false
        this.addSubview(this.tintView)
        this.thumbOutLightView.userInteractionEnabled = false
        this.addSubview(this.thumbOutLightView)
        this.thumbView.layer.shadowColor = new UIColor(0.0, 0.0, 0.0, 1.0)
        this.thumbView.layer.shadowRadius = 2.0
        this.thumbView.layer.shadowOffset = {width:0.0, height:3.0}
        this.thumbView.layer.shadowOpacity = 0.2
        this.addSubview(this.thumbView)
        this.setupTouches()
    }

    private touchChanged = false

    setupTouches() {
        const longPressGesture = new UILongPressGestureRecognizer
        longPressGesture
            .on("began", () => {
                this.touchChanged = false
                this.tracking = true
            })
            .on("changed", (sender: UILongPressGestureRecognizer) => {
                const location = sender.locationInView(this)
                const isOn = location.x > this.bounds.width / 2.0
                if (this.isOn != isOn) {
                    this.touchChanged = true
                    UIAnimator.curve(0.20, () => { this.isOn = isOn }, undefined)
                }
            })
            .on("ended", (sender: UILongPressGestureRecognizer) => {
                if (!this.touchChanged) {
                    const location = sender.locationInView(this)
                    if (this.pointInside(location)) {
                        UIAnimator.curve(0.20, () => { this.isOn = !this.isOn }, () => {
                            this.emit("valueChanged", this)
                        })
                    }
                }
                else {
                    this.emit("valueChanged", this)
                }
                this.tracking = false
            })
            .on("cancelled", () => {
                if (this.touchChanged) {
                    this.emit("valueChanged", this)
                }
                this.tracking = false
            })
        longPressGesture.minimumPressDuration = 0.0
        this.thumbView.addGestureRecognizer(longPressGesture)
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.tintView.frame = { x: (this.bounds.width - 34.0) / 2.0, y: (this.bounds.height - 14.0) / 2.0, width: 34.0, height: 14.0 }
        this.tintView.layer.cornerRadius = 7.0
        if (this.isOn) {
            this.thumbView.frame = { x: this.tintView.frame.x + this.tintView.frame.width - 20.0, y: (this.bounds.height - 20.0) / 2.0, width: 20.0, height: 20.0 }
            this.thumbView.layer.cornerRadius = 10.0
            if (this.onTintColor) {
                this.thumbView.backgroundColor = this.onTintColor
                this.tintView.backgroundColor = this.onTintColor.colorWithAlphaComponent(0.5)
                this.thumbOutLightView.frame = { x: this.tintView.frame.x + this.tintView.frame.width - 20.0, y: (this.bounds.height - 20.0) / 2.0, width: 20.0, height: 20.0 }
                this.thumbOutLightView.layer.cornerRadius = 10.0
                this.thumbOutLightView.backgroundColor = this.onTintColor.colorWithAlphaComponent(0.2)
            }
        }
        else {
            this.thumbView.frame = { x: this.tintView.frame.x, y: (this.bounds.height - 20.0) / 2.0, width: 20.0, height: 20.0 }
            this.thumbView.layer.cornerRadius = 10.0
            this.thumbView.backgroundColor = this.thumbTintColor
            this.tintView.backgroundColor = new UIColor(0x84 / 255.0, 0x84 / 255.0, 0x84 / 255.0, 1.0)
            this.thumbOutLightView.frame = { x: this.tintView.frame.x, y: (this.bounds.height - 20.0) / 2.0, width: 20.0, height: 20.0 }
            this.thumbOutLightView.layer.cornerRadius = 10.0
            this.thumbOutLightView.backgroundColor = new UIColor(0x84 / 255.0, 0x84 / 255.0, 0x84 / 255.0, 0.2)
        }
    }

    pointInside(point: UIPoint): boolean {
        return point.x >= 0.0 && point.y >= -(44.0 - this.frame.height) / 2.0 && point.x <= this.frame.width && point.y <= this.frame.height + (44.0 - this.frame.height) / 2.0
    }

}