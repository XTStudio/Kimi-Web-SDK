import { UIView } from "./UIView";
import { UIAnimator } from "./UIAnimator";
import { UIColor } from "./UIColor";

export class UIProgressView extends UIView {

    private _progress: number = 0.0

    /**
     * Getter progress
     * @return {number }
     */
    public get progress(): number {
        return this._progress;
    }

    /**
     * Setter progress
     * @param {number } value
     */
    public set progress(value: number) {
        this._progress = value;
        this.layoutIfNeeded()
    }

    setProgress(value: number, animated: Boolean) {
        if (animated) {
            UIAnimator.curve(0.30, () => {
                this.progress = value
                this.layoutIfNeeded()
            }, undefined)
        }
        else {
            this.layoutIfNeeded()
        }
    }

    private _progressTintColor: UIColor | undefined = undefined


    /**
     * Getter progressTintColor
     * @return {UIColor }
     */
    public get progressTintColor(): UIColor | undefined {
        return this._progressTintColor;
    }

    /**
     * Setter progressTintColor
     * @param {UIColor } value
     */
    public set progressTintColor(value: UIColor | undefined) {
        this._progressTintColor = value;
        this.progressView.backgroundColor = value
    }

    private _trackTintColor: UIColor | undefined = undefined

    /**
     * Getter trackTintColor
     * @return {UIColor }
     */
    public get trackTintColor(): UIColor | undefined {
        return this._trackTintColor;
    }

    /**
     * Setter trackTintColor
     * @param {UIColor } value
     */
    public set trackTintColor(value: UIColor | undefined) {
        this._trackTintColor = value;
        this.trackView.backgroundColor = value
    }

    // Implementation

    trackView = new UIView()
    progressView = new UIView()

    constructor() {
        super()
        this.progressTintColor = this.tintColor
        this.trackTintColor = this.tintColor.colorWithAlphaComponent(0.35)
        this.addSubview(this.trackView)
        this.addSubview(this.progressView)
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.trackView.frame = this.bounds
        this.progressView.frame = { x: 0.0, y: 0.0, width: this.bounds.width * this.progress, height: this.bounds.height }
    }

}