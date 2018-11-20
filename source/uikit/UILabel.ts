import { UIView } from "./UIView";
import { UILineBreakMode, UITextAlignment } from "./UIEnums";
import { UIColor } from "./UIColor";
import { UIFont } from "./UIFont";
import { UIAttributedString } from "./UIAttributedString";
import { UISize } from "./UISize";
import { TextMeasurer } from "./helpers/TextMeasurer";

export class UILabel extends UIView {

    protected textElement = document.createElement("span")

    constructor() {
        super()
        this.userInteractionEnabled = false
        this.textElement.style.position = "absolute"
        this.textElement.style.userSelect = "none";
        this.textElement.style.cursor = "default"
        this.textElement.style.width = "100%"
        this.textElement.style.top = "50%"
        this.textElement.style.left = "0"
        this.textElement.style.transform = "translateY(-50%)"
        this.numberOfLines = 1
        this.domElement.appendChild(this.textElement)
    }

    private _text: string | undefined = undefined

    /**
     * Getter text
     * @return {string }
     */
    public get text(): string | undefined {
        return this._text;
    }

    /**
     * Setter text
     * @param {string } value
     */
    public set text(value: string | undefined) {
        this._text = value;
        if (value) {
            this.textElement.innerText = value
        }
        else {
            this.textElement.innerText = ""
        }
    }

    private _attributedText: UIAttributedString | undefined = undefined

    /**
     * Getter attributedText
     * @return {UIAttributedString }
     */
    public get attributedText(): UIAttributedString | undefined {
        return this._attributedText;
    }

    /**
     * Setter attributedText
     * @param {UIAttributedString } value
     */
    public set attributedText(value: UIAttributedString | undefined) {
        this._attributedText = value;
        if (value) {
            this.textElement.innerText = ""
            const el = value.toHTMLText()
            this.textElement.appendChild(el)
            this.domElement.style.textAlign = el.style.textAlign
        }
        else {
            this.textElement.innerText = ""
        }
    }

    private _font: UIFont | undefined = undefined

    /**
     * Getter font
     * @return {UIFont }
     */
    public get font(): UIFont | undefined {
        return this._font;
    }

    /**
     * Setter font
     * @param {UIFont } value
     */
    public set font(value: UIFont | undefined) {
        this._font = value;
        if (value) {
            this.textElement.style.fontSize = value.pointSize.toString() + "px"
            this.textElement.style.fontFamily = typeof value.fontName === "string" ? value.fontName : null;
            this.textElement.style.fontWeight = typeof value.fontStyle === "string" ? value.fontStyle : null;
            this.textElement.style.fontStyle = typeof value.fontStyle === "string" ? value.fontStyle : null;
        } else {
            this.textElement.style.fontSize = "14px"
            this.textElement.style.fontFamily = null;
            this.textElement.style.fontWeight = null;
            this.textElement.style.fontStyle = null;
        }
    }

    private _textColor: UIColor | undefined = undefined

    /**
     * Getter textColor
     * @return {UIColor }
     */
    public get textColor(): UIColor | undefined {
        return this._textColor;
    }

    /**
     * Setter textColor
     * @param {UIColor } value
     */
    public set textColor(value: UIColor | undefined) {
        this._textColor = value;
        if (value) {
            this.textElement.style.color = value.toStyle()
        }
        else {
            this.textElement.style.color = UIColor.black.toStyle()
        }
    }

    private _textAlignment: UITextAlignment = UITextAlignment.left

    /**
     * Getter textAlignment
     * @return {UITextAlignment }
     */
    public get textAlignment(): UITextAlignment {
        return this._textAlignment;
    }

    /**
     * Setter textAlignment
     * @param {UITextAlignment } value
     */
    public set textAlignment(value: UITextAlignment) {
        this._textAlignment = value;
        switch (value) {
            case UITextAlignment.left:
                this.textElement.style.textAlign = "left"
                break
            case UITextAlignment.center:
                this.textElement.style.textAlign = "center"
                break
            case UITextAlignment.right:
                this.textElement.style.textAlign = "right"
                break
        }
    }

    lineBreakMode: UILineBreakMode = UILineBreakMode.truncatingTail

    private _numberOfLines: number = 1

    /**
     * Getter numberOfLines
     * @return {number }
     */
    public get numberOfLines(): number {
        return this._numberOfLines;
    }

    /**
     * Setter numberOfLines
     * @param {number } value
     */
    public set numberOfLines(value: number) {
        this._numberOfLines = value;
        if (value === 1) {
            this.textElement.style.overflow = "hidden"
            this.textElement.style.wordWrap = null;
            this.textElement.style.wordBreak = null;
            this.textElement.style.textOverflow = this.lineBreakMode === UILineBreakMode.truncatingTail ? "ellipsis" : null;
            this.textElement.style.display = "inline-block";
            this.textElement.style.setProperty("-webkit-line-clamp", null)
            this.textElement.style.whiteSpace = "nowrap";
            this.textElement.style.visibility = null
        }
        else {
            this.textElement.style.overflow = "hidden"
            this.textElement.style.wordWrap = null;
            this.textElement.style.wordBreak = null;
            this.textElement.style.textOverflow = this.lineBreakMode === UILineBreakMode.truncatingTail ? "ellipsis" : null;
            this.textElement.style.display = "-webkit-box";
            this.textElement.style.webkitBoxOrient = "vertical"
            this.resetLineClamp()
            this.textElement.style.whiteSpace = null;
        }
    }

    private resetLineClamp() {
        if (this.numberOfLines != 1) {
            const lines = this.numberOfLines == 0 ? 99999 : this.numberOfLines
            let lineHeight = 16
            if (this.font) {
                lineHeight = Math.max(this.font.pointSize * 1.5, this.font.pointSize + 12)
            }
            const clampLines = Math.min(Math.floor(this.bounds.height / lineHeight), lines)
            if (clampLines < lines || this.numberOfLines === 0) {
                let realHeight: number = 0.0
                if (this.text) {
                    realHeight = TextMeasurer.measureText(this.text, {
                        font: this.font || new UIFont(14),
                        inRect: { x: 0, y: 0, width: this.bounds.width, height: Infinity },
                    }).height
                }
                else if (this.attributedText) {
                    realHeight = TextMeasurer.measureAttributedText(this.attributedText, { width: this.bounds.width, height: Infinity }).height
                }
                if (realHeight <= this.bounds.height) {
                    this.textElement.style.setProperty("-webkit-line-clamp", null)
                    this.textElement.style.visibility = null
                }
                else {
                    this.textElement.style.setProperty("-webkit-line-clamp", clampLines.toString())
                    this.textElement.style.visibility = null
                }
            }
            else if (clampLines > 0) {
                this.textElement.style.setProperty("-webkit-line-clamp", clampLines.toString())
                this.textElement.style.visibility = null
            }
            else {
                this.textElement.style.visibility = "none"
            }
        }
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.resetLineClamp()
    }

    intrinsicContentSize(): UISize {
        if (this.attributedText) {
            return TextMeasurer.measureAttributedText(this.attributedText, { width: Infinity, height: Infinity })
        }
        if (this.text) {
            return TextMeasurer.measureText(this.text, {
                font: this.font || new UIFont(14),
                inRect: { x: 0, y: 0, width: Infinity, height: Infinity },
                numberOfLines: this.numberOfLines
            })
        }
        return { width: 0, height: 0 }
    }

}