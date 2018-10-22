import { UIView } from "./UIView";
import { UIEdgeInsets, UIEdgeInsetsZero } from "./UIEdgeInsets";
import { UILabel } from "./UILabel";
import { UIImageView } from "./UIImageView";
import { UIFont } from "./UIFont";
import { UITapGestureRecognizer } from "./UITapGestureRecognizer";
import { UILongPressGestureRecognizer } from "./UILongPressGestureRecognizer";
import { UIPoint } from "./UIPoint";
import { UIControlState, UIControlContentHorizontalAlignment, UIControlContentVerticalAlignment } from "./UIEnums";
import { UIImage } from "./UIImage";
import { UIColor } from "./UIColor";
import { UISizeZero } from "./UISize";
import { UIAnimator } from "./UIAnimator";
import { UIAttributedString } from "./UIAttributedString";

export class UIButton extends UIView {

    titleLabel: UILabel = new UILabel
    imageView: UIImageView = new UIImageView

    constructor(readonly isCustom: boolean = false) {
        super()
        this.titleLabel.font = new UIFont(17.0)
        this.addSubview(this.titleLabel)
        this.addSubview(this.imageView)
        this.setupTouches()
    }

    private _enabled: boolean = true

    /**
     * Getter enabled
     * @return {boolean }
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * Setter enabled
     * @param {boolean } value
     */
    public set enabled(value: boolean) {
        this._enabled = value;
        this.reloadContents()
    }

    private _selected: boolean = false

    /**
     * Getter selected
     * @return {boolean }
     */
    public get selected(): boolean {
        return this._selected;
    }

    /**
     * Setter selected
     * @param {boolean } value
     */
    public set selected(value: boolean) {
        this._selected = value;
        this.reloadContents()
    }

    private _highlighted: boolean = false

    /**
     * Getter highlighted
     * @return {boolean }
     */
    public get highlighted(): boolean {
        return this._highlighted;
    }

    /**
     * Setter highlighted
     * @param {boolean } value
     */
    public set highlighted(value: boolean) {
        this._highlighted = value;
        this.reloadContents()
    }

    private _tracking: boolean = false

    /**
     * Getter tracking
     * @return {boolean }
     */
    public get tracking(): boolean {
        return this._tracking;
    }

    /**
     * Setter tracking
     * @param {boolean } value
     */
    public set tracking(value: boolean) {
        this._tracking = value;
        this.reloadContents()
    }

    private _touchInside: boolean = false

    /**
     * Getter touchInside
     * @return {boolean }
     */
    public get touchInside(): boolean {
        return this._touchInside;
    }

    /**
     * Setter touchInside
     * @param {boolean } value
     */
    public set touchInside(value: boolean) {
        this._touchInside = value;
        this.reloadContents()
    }

    private _contentVerticalAlignment: UIControlContentVerticalAlignment = UIControlContentVerticalAlignment.center

    /**
     * Getter contentVerticalAlignment
     * @return {UIControlContentVerticalAlignment }
     */
    public get contentVerticalAlignment(): UIControlContentVerticalAlignment {
        return this._contentVerticalAlignment;
    }

    /**
     * Setter contentVerticalAlignment
     * @param {UIControlContentVerticalAlignment } value
     */
    public set contentVerticalAlignment(value: UIControlContentVerticalAlignment) {
        this._contentVerticalAlignment = value;
        this.reloadContents()
    }

    private _contentHorizontalAlignment: UIControlContentHorizontalAlignment = UIControlContentHorizontalAlignment.center

    /**
     * Getter contentHorizontalAlignment
     * @return {UIControlContentHorizontalAlignment }
     */
    public get contentHorizontalAlignment(): UIControlContentHorizontalAlignment {
        return this._contentHorizontalAlignment;
    }

    /**
     * Setter contentHorizontalAlignment
     * @param {UIControlContentHorizontalAlignment } value
     */
    public set contentHorizontalAlignment(value: UIControlContentHorizontalAlignment) {
        this._contentHorizontalAlignment = value;
        this.reloadContents()
    }

    setTitle(title: string | undefined, state: number) {
        if (title) {
            this.statedTitles[state] = title
        }
        else {
            delete this.statedTitles[state]
        }
        this.reloadContents()
    }

    setTitleColor(color: UIColor | undefined, state: number) {
        if (color) {
            this.statedTitleColors[state] = color
        }
        else {
            delete this.statedTitleColors[state]
        }
        this.reloadContents()
    }

    setTitleFont(font: UIFont) {
        this.titleLabel.font = font
        this.reloadContents()
    }

    setImage(image: UIImage | undefined, state: number) {
        if (image) {
            this.statedImages[state] = image
        }
        else {
            delete this.statedImages[state]
        }
        this.reloadContents()
    }

    setAttributedTitle(title: UIAttributedString | undefined, state: number) {
        if (title) {
            this.statedAttributedTitles[state] = title
        }
        else {
            delete this.statedAttributedTitles[state]
        }
        this.reloadContents()
    }

    private _contentEdgeInsets: UIEdgeInsets = UIEdgeInsetsZero

    /**
     * Getter contentEdgeInsets
     * @return {UIEdgeInsets }
     */
    public get contentEdgeInsets(): UIEdgeInsets {
        return this._contentEdgeInsets;
    }

    /**
     * Setter contentEdgeInsets
     * @param {UIEdgeInsets } value
     */
    public set contentEdgeInsets(value: UIEdgeInsets) {
        this._contentEdgeInsets = value;
        this.reloadContents()
    }

    private _titleEdgeInsets: UIEdgeInsets = UIEdgeInsetsZero

    /**
     * Getter titleEdgeInsets
     * @return {UIEdgeInsets }
     */
    public get titleEdgeInsets(): UIEdgeInsets {
        return this._titleEdgeInsets;
    }

    /**
     * Setter titleEdgeInsets
     * @param {UIEdgeInsets } value
     */
    public set titleEdgeInsets(value: UIEdgeInsets) {
        this._titleEdgeInsets = value;
        this.reloadContents()
    }

    private _imageEdgeInsets: UIEdgeInsets = UIEdgeInsetsZero

    /**
     * Getter imageEdgeInsets
     * @return {UIEdgeInsets }
     */
    public get imageEdgeInsets(): UIEdgeInsets {
        return this._imageEdgeInsets;
    }

    /**
     * Setter imageEdgeInsets
     * @param {UIEdgeInsets } value
     */
    public set imageEdgeInsets(value: UIEdgeInsets) {
        this._imageEdgeInsets = value;
        this.reloadContents()
    }

    // implements

    private statedTitles: { [key: number]: string } = {}
    private statedAttributedTitles: { [key: number]: UIAttributedString } = {}
    private statedTitleColors: { [key: number]: UIColor } = {}
    private statedImages: { [key: number]: UIImage } = {}

    private setupTouches() {
        this.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
            this.emit("touchUpInside", this)
        }))
        const longPressGesture = new UILongPressGestureRecognizer()
        longPressGesture.on("began", () => {
            this.tracking = true
            this.highlighted = true
            this.emit("touchDown", this)
        })
        longPressGesture.on("changed", (sender: UILongPressGestureRecognizer) => {
            const location = sender.locationInView(undefined)
            const inside = this.highlightedPointInside(location)
            if (this.touchInside != inside) {
                if (inside) {
                    this.emit("touchDragEnter", this)
                }
                else {
                    this.emit("touchDragExit", this)
                }
            }
            this.touchInside = inside
            this.highlighted = this.touchInside
            if (inside) {
                this.emit("touchDragInside", this)
            }
            else {
                this.emit("touchDragOutside", this)
            }
        })
        longPressGesture.on("ended", (sender: UILongPressGestureRecognizer) => {
            this.highlighted = false
            this.tracking = false
            const location = sender.locationInView(undefined)
            const inside = this.highlightedPointInside(location)
            if (inside) {
                this.emit("touchUpInside", this)
            }
            else {
                this.emit("touchUpOutside", this)
            }
        })
        longPressGesture.on("cancelled", () => {
            this.highlighted = false
            this.tracking = false
            this.emit("touchCancel", this)
        })
        longPressGesture.minimumPressDuration = 0.05
        this.addGestureRecognizer(longPressGesture)
    }

    tintColorDidChange() {
        super.tintColorDidChange()
        this.reloadContents()
    }

    private reloadContents() {
        const attributedText = this.attributedTitleForState(this.currentState())
        if (attributedText) {
            this.titleLabel.attributedText = attributedText
        }
        else {
            this.titleLabel.text = this.titleForState(this.currentState())
            this.titleLabel.textColor = this.titleColorForState(this.currentState())
        }
        this.imageView.image = this.imageForState(this.currentState())
        if (!this.isCustom) {
            UIAnimator.linear(0.10, () => {
                if (this.highlighted) {
                    this.titleLabel.alpha = 0.3
                    this.imageView.alpha = 0.3
                }
                else {
                    this.titleLabel.alpha = 1.0
                    this.imageView.alpha = 1.0
                }
            }, undefined)
        }
        this.reloadLayouts()
    }

    private async reloadLayouts() {
        if (this.bounds.width <= 0.0 || this.bounds.height <= 0.0) {
            return
        }
        const boxWidth = this.bounds.width - this.layer.borderWidth
        const boxHeight = this.bounds.height - this.layer.borderWidth
        if (this.imageView.image) {
            await this.imageView.image.fetchSize()
        }
        const imageViewSize = this.imageView.intrinsicContentSize() || UISizeZero
        var imgX = 0.0
        var imgY = 0.0
        var imgWidth = imageViewSize.width
        var imgHeight = imageViewSize.height
        const titleLabelSize = this.titleLabel.intrinsicContentSize() || UISizeZero
        var titleX = 0.0
        var titleY = 0.0
        var titleWidth = titleLabelSize.width
        var titleHeight = titleLabelSize.height
        switch (this.contentHorizontalAlignment) {
            case UIControlContentHorizontalAlignment.left:
                imgX = 0.0
                titleX = imgX + imageViewSize.width + 0.0
                break
            case UIControlContentHorizontalAlignment.center:
                imgX = (boxWidth - (imageViewSize.width + titleLabelSize.width)) / 2.0
                titleX = imgX + imageViewSize.width + 0.0
                break
            case UIControlContentHorizontalAlignment.right:
                imgX = boxWidth - (imageViewSize.width + titleLabelSize.width)
                titleX = imgX + imageViewSize.width + 0.0
                break
            case UIControlContentHorizontalAlignment.fill:
                imgWidth = boxWidth
                titleWidth = boxWidth
                break
        }
        switch (this.contentVerticalAlignment) {
            case UIControlContentVerticalAlignment.top:
                imgY = 0.0
                titleY = 0.0
                break
            case UIControlContentVerticalAlignment.center:
                imgY = (boxHeight - imageViewSize.height) / 2.0
                titleY = (boxHeight - titleLabelSize.height) / 2.0
                break
            case UIControlContentVerticalAlignment.bottom:
                imgY = boxHeight - imageViewSize.height
                titleY = boxHeight - titleLabelSize.height
                break
            case UIControlContentVerticalAlignment.fill:
                imgHeight = boxHeight
                titleHeight = boxHeight
                break
        }
        imgX += this.contentEdgeInsets.left + this.imageEdgeInsets.left
        imgX -= this.contentEdgeInsets.right + this.imageEdgeInsets.right
        imgY += this.contentEdgeInsets.top + this.imageEdgeInsets.top
        imgY -= this.contentEdgeInsets.bottom + this.imageEdgeInsets.bottom
        titleX += this.contentEdgeInsets.left + this.titleEdgeInsets.left
        titleX -= this.contentEdgeInsets.right + this.titleEdgeInsets.right
        titleY += this.contentEdgeInsets.top + this.titleEdgeInsets.top
        titleY -= this.contentEdgeInsets.bottom + this.titleEdgeInsets.bottom
        this.imageView.frame = { x: imgX, y: imgY, width: imgWidth, height: imgHeight }
        this.titleLabel.frame = { x: titleX, y: titleY, width: titleWidth, height: titleHeight }
    }

    private currentState(): number {
        var state = UIControlState.normal
        if (!this.enabled) {
            state = state | UIControlState.disabled
        }
        if (this.selected) {
            state = state | UIControlState.selected
        }
        if (this.highlighted) {
            state = state | UIControlState.highlighted
        }
        return state
    }

    private imageForState(state: number): UIImage | undefined {
        if (this.statedImages[state] !== undefined) {
            return this.statedImages[state]
        }
        return this.statedImages[0]
    }

    private titleForState(state: number): string | undefined {
        if (this.statedTitles[state] !== undefined) {
            return this.statedTitles[state]
        }
        return this.statedTitles[0]
    }

    private attributedTitleForState(state: number): UIAttributedString | undefined {
        if (this.statedAttributedTitles[state] !== undefined) {
            return this.statedAttributedTitles[state]
        }
        return this.statedAttributedTitles[0]
    }

    private titleColorForState(state: number): UIColor | undefined {
        if (this.statedTitleColors[state] !== undefined) {
            return this.statedTitleColors[state]
        }
        if (this.statedTitleColors[0] !== undefined) {
            return this.statedTitleColors[0]
        }
        if (state == UIControlState.disabled) {
            return UIColor.gray.colorWithAlphaComponent(0.75)
        }
        else {
            return this.tintColor || UIColor.black
        }
    }

    private highlightedPointInside(point: UIPoint): boolean {
        return point.x >= -22.0 && point.y >= -22.0 && point.x <= this.frame.width + 22.0 && point.y <= this.frame.height + 22.0
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.reloadLayouts()
    }

}