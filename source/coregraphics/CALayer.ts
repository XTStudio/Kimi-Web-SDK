import { UIView } from "../uikit/UIView";
import { UIRect, UIRectZero } from "../uikit/UIRect";
import { UIColor } from "../uikit/UIColor";
import { UISize } from "../uikit/UISize";

export class CALayer {

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

    frame: UIRect = UIRectZero

    private _cornerRadius: number = 0.0

    public get cornerRadius(): number {
        return this._cornerRadius;
    }

    public set cornerRadius(value: number) {
        this._cornerRadius = value;
        if (this._view !== undefined) {
            this._view.domElement.style.borderRadius = value.toFixed(0) + "px"
        }
    }

    superlayer: CALayer | undefined = undefined

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
                this._view.domElement.style.boxShadow = this.shadowOffset.width.toString() + "px " + this.shadowOffset.height.toString() + "px " + this.shadowRadius.toString() + "px " + this.shadowColor.colorWithAlphaComponent(this.shadowOpacity).toStyle()
            }
            else {
                this._view.domElement.style.boxShadow = null
            }
        }
    }

}