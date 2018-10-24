import { UIView, UINativeTouchView } from "./UIView";
import { UIColor } from "./UIColor";
import { UIFont } from "./UIFont";
import { UILabel } from "./UILabel";
import { UITextAlignment, UITextFieldViewMode, UIControlState, UITextAutocapitalizationType, UITextAutocorrectionType, UITextSpellCheckingType, UIKeyboardType, UIReturnKeyType } from "./UIEnums";
import { UIButton } from "./UIButton";
import { UIImage, UIImageRenderingMode } from "./UIImage";

const clearButtonImage = new UIImage({ name: "icon_clear@3x", base64: "iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABjUExURUdwTKqqqo+OlZGRto+OlZOTmY+OlY+OlJCQlpCQlZGOlpGRnZCQmY+OlJCOlJCOlI+OlI+OlJCOlI+OlJCOlI+OlI+PlI+OlI+OlI+OlI+PlI+OlP///4+OlI+PlY+PlI+OlI/lPb8AAAAgdFJOUwAG4AfzLcP7VS5mFR7Zob+l/Y/eiPd89vXum/AB+HuJvx1C8wAAASxJREFUOMuVlUeigzAMRAWYXkMnEKL7n/LzaRaOKZoVwm+hMpYBjrLHLI2FiNNstOFCdl4gUZGf0VHyQkWvJNKARvlBjarSUMnQwRM54ZH0TTyV6R9IgRcShA1NvJS552A4eCNnq+2LtyrXflb3aLX0N5F/mp6ed638TuZpyhm9rSFwt8ANwHrLuf3PON/D1ppCb2VdbwqsZj/Mp1A6pJvzWdiZhEEmVEzdJ8kFO7uQEJBDH2oSrYDn7h/ksIYMNayGxAxS1LAaElOI8YRVSIxB9dTGqiQKDspIgFEWo1mPRzA+H6xN7dL/2AU6ahdiwubXhO3BhAdrA7X2oFqbXpi2ozX3jXJhIPo8voaMy81ZGYxFxFlvnKXJWcWcBc95NliP0VJfvT1xtVIN/AEiR40jdo0zSQAAAABJRU5ErkJggg==", renderingMode: UIImageRenderingMode.alwaysOriginal })

class NativeEditText extends UINativeTouchView {

    inputElement = document.createElement("input")

    constructor() {
        super()
        this.inputElement.style.position = "absolute"
        this.inputElement.style.backgroundColor = "transparent"
        this.inputElement.style.width = "100%"
        this.inputElement.style.height = "100%"
        this.inputElement.style.border = "none"
        this.inputElement.style.outline = "none"
        this.inputElement.style.color = "black"
        this.inputElement.style.fontSize = "14px"
        this.inputElement.type = "text"
        if (navigator.vendor === "Apple Computer, Inc." && navigator.platform === "iPhone") {
            this.inputElement.style.marginLeft = "-8px"
            this.inputElement.style.marginTop = "-3px"
        }
        this.domElement.appendChild(this.inputElement)
    }

}

export class UITextField extends UIView {

    editText = new NativeEditText
    placeholderLabel = new UILabel
    private _oldValue: any = ""

    constructor() {
        super()
        this.backgroundColor = UIColor.white
        this.addSubview(this.editText)
        this.clearButtonView.hidden = true
        this.clearButtonView.setImage(clearButtonImage, UIControlState.normal)
        this.addSubview(this.clearButtonView)
        this.placeholderLabel.alpha = 0.25
        this.addSubview(this.placeholderLabel)
        this.editText.inputElement.addEventListener("focus", () => {
            if (this.val("shouldBeginEditing", this) === false) {
                this.editText.inputElement.blur()
                return
            }
            this.editing = true
            if (this.clearsOnBeginEditing) {
                this.text = ""
            }
            this._oldValue = this.editText.inputElement.value
            this.emit("didBeginEditing", this)
        })
        this.editText.inputElement.addEventListener("blur", () => {
            if (this.val("shouldEndEditing", this) === false) {
                this.editText.inputElement.focus()
                return
            }
            this.editing = false
            this.emit("didEndEditing", this)
        })
        this.editText.inputElement.addEventListener("input", (e: any) => {
            if (this.keyboardType === UIKeyboardType.numberPad || this.keyboardType === UIKeyboardType.decimalPad) {
                if (!this.editText.inputElement.checkValidity()) {
                    this.editText.inputElement.value = this._oldValue
                }
            }
            if (e.inputType === "insertText") {
                if (this.val("shouldChange", this, { location: 0, length: 0 }, e.data) === false) {
                    this.editText.inputElement.value = this._oldValue
                }
            }
            this._oldValue = this.editText.inputElement.value
            this.reloadExtraContents()
        })
        this.editText.inputElement.addEventListener("keypress", (e) => {
            if (e.keyCode === 13) {
                this.emit("shouldReturn", this)
                e.preventDefault()
            }
        })
    }

    public get text(): string {
        return this.editText.inputElement.value || "";
    }

    public set text(value: string) {
        this.editText.inputElement.value = value
        this.reloadExtraContents()
    }

    private _textColor: UIColor | undefined = undefined

    public get textColor(): UIColor | undefined {
        return this._textColor;
    }

    public set textColor(value: UIColor | undefined) {
        this._textColor = value;
        this.editText.inputElement.style.color = value ? value.toStyle() : null
        this.placeholderLabel.textColor = value
    }

    private _font: UIFont | undefined = undefined

    public get font(): UIFont | undefined {
        return this._font;
    }

    public set font(value: UIFont | undefined) {
        this._font = value;
        if (value) {
            this.editText.inputElement.style.fontSize = value.pointSize.toString() + "px"
            this.editText.inputElement.style.fontFamily = typeof value.fontName === "string" ? value.fontName : null;
            this.editText.inputElement.style.fontWeight = typeof value.fontStyle === "string" ? value.fontStyle : null;
            this.editText.inputElement.style.fontStyle = typeof value.fontStyle === "string" ? value.fontStyle : null;
        } else {
            this.editText.inputElement.style.fontSize = "14px"
            this.editText.inputElement.style.fontFamily = null;
            this.editText.inputElement.style.fontWeight = null;
            this.editText.inputElement.style.fontStyle = null;
        }
        this.placeholderLabel.font = value
    }

    private _textAlignment: UITextAlignment = UITextAlignment.left

    public get textAlignment(): UITextAlignment {
        return this._textAlignment;
    }

    public set textAlignment(value: UITextAlignment) {
        this._textAlignment = value;
        switch (value) {
            case UITextAlignment.left:
                this.editText.inputElement.style.textAlign = "left"
                break
            case UITextAlignment.center:
                this.editText.inputElement.style.textAlign = "center"
                break
            case UITextAlignment.right:
                this.editText.inputElement.style.textAlign = "right"
                break
        }
        this.placeholderLabel.textAlignment = value
    }

    public get placeholder(): string | undefined {
        return this.placeholderLabel.text;
    }

    public set placeholder(value: string | undefined) {
        this.placeholderLabel.text = value
    }

    clearsOnBeginEditing: boolean = false

    private _editing: boolean = false

    public get editing(): boolean {
        return this._editing
    }

    public set editing(value: boolean) {
        this._editing = value
        this.reloadExtraContents()
    }

    private _clearButtonMode: UITextFieldViewMode = UITextFieldViewMode.never

    public get clearButtonMode(): UITextFieldViewMode {
        return this._clearButtonMode;
    }

    public set clearButtonMode(value: UITextFieldViewMode) {
        this._clearButtonMode = value;
        this.reloadExtraContents()
    }

    private _leftView: UIView | undefined = undefined

    public get leftView(): UIView | undefined {
        return this._leftView;
    }

    public set leftView(value: UIView | undefined) {
        if (this._leftView) {
            this._leftView.removeFromSuperview()
        }
        this._leftView = value;
        this.reloadExtraContents()
    }

    private _leftViewMode: UITextFieldViewMode = UITextFieldViewMode.never

    public get leftViewMode(): UITextFieldViewMode {
        return this._leftViewMode;
    }

    public set leftViewMode(value: UITextFieldViewMode) {
        this._leftViewMode = value;
        this.reloadExtraContents()
    }

    private _rightView: UIView | undefined = undefined

    public get rightView(): UIView | undefined {
        return this._rightView;
    }

    public set rightView(value: UIView | undefined) {
        if (this._rightView) {
            this._rightView.removeFromSuperview()
        }
        this._rightView = value;
        this.reloadExtraContents()
    }

    private _rightViewMode: UITextFieldViewMode = UITextFieldViewMode.never

    public get rightViewMode(): UITextFieldViewMode {
        return this._rightViewMode;
    }

    public set rightViewMode(value: UITextFieldViewMode) {
        this._rightViewMode = value;
        this.reloadExtraContents()
    }

    clearsOnInsertion: boolean = false

    focus(): void {
        if (this.val("shouldBeginEditing", this) === false) {
            return
        }
        this.editText.inputElement.focus()
    }

    blur(): void {
        if (this.val("shouldEndEditing", this) === false) {
            return
        }
        this.editText.inputElement.blur()
    }

    private _autocapitalizationType: UITextAutocapitalizationType = UITextAutocapitalizationType.none

    public get autocapitalizationType(): UITextAutocapitalizationType {
        return this._autocapitalizationType;
    }

    public set autocapitalizationType(value: UITextAutocapitalizationType) {
        this._autocapitalizationType = value;
        switch (value) {
            case UITextAutocapitalizationType.none:
                (this.editText.inputElement as any).autocapitalize = "off";
                break;
            case UITextAutocapitalizationType.allCharacters:
                (this.editText.inputElement as any).autocapitalize = "characters";
                break;
            case UITextAutocapitalizationType.sentences:
                (this.editText.inputElement as any).autocapitalize = "sentences";
                break;
            case UITextAutocapitalizationType.words:
                (this.editText.inputElement as any).autocapitalize = "words";
                break;
        }
    }

    private _autocorrectionType: UITextAutocorrectionType = UITextAutocorrectionType.default

    public get autocorrectionType(): UITextAutocorrectionType {
        return this._autocorrectionType;
    }

    public set autocorrectionType(value: UITextAutocorrectionType) {
        this._autocorrectionType = value;
        if (value == UITextAutocorrectionType.yes) {
            this.editText.inputElement.setAttribute("autocorrect", "on")
        }
        else {
            this.editText.inputElement.setAttribute("autocorrect", "off")
        }
    }

    private _spellCheckingType: UITextSpellCheckingType = UITextSpellCheckingType.default

    public get spellCheckingType(): UITextSpellCheckingType {
        return this._spellCheckingType;
    }

    public set spellCheckingType(value: UITextSpellCheckingType) {
        this._spellCheckingType = value;
        this.editText.inputElement.spellcheck = value !== UITextSpellCheckingType.no
    }

    private _keyboardType: UIKeyboardType = UIKeyboardType.default

    public get keyboardType(): UIKeyboardType {
        return this._keyboardType;
    }

    public set keyboardType(value: UIKeyboardType) {
        this._keyboardType = value;
        this.resetInputType()
    }

    returnKeyType: UIReturnKeyType = UIReturnKeyType.default

    private _secureTextEntry: boolean = false

    public get secureTextEntry(): boolean {
        return this._secureTextEntry;
    }

    public set secureTextEntry(value: boolean) {
        this._secureTextEntry = value;
        this.resetInputType()
    }

    resetInputType() {
        if (this.secureTextEntry) {
            this.editText.inputElement.type = "password"
        }
        else if (this.keyboardType == UIKeyboardType.numberPad) {
            this.editText.inputElement.type = "number"
            this.editText.inputElement.step = ""
        }
        else if (this.keyboardType == UIKeyboardType.decimalPad) {
            this.editText.inputElement.type = "number"
            this.editText.inputElement.step = "0.0000001"
        }
        else if (this.keyboardType == UIKeyboardType.phonePad) {
            this.editText.inputElement.type = "tel"
        }
        else if (this.keyboardType == UIKeyboardType.emailAddress) {
            this.editText.inputElement.type = "email"
        }
        else {
            this.editText.inputElement.type = "text"
        }
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.reloadExtraContents()
    }

    private clearButtonView = new UIButton().on("touchUpInside", () => {
        if (this.val("shouldClear") !== false) {
            this.text = ""
        }
    })

    reloadExtraContents() {
        this.placeholderLabel.hidden = this.text !== undefined && this.text.length > 0
        const displayClearButton = (() => {
            if (this.clearButtonMode == UITextFieldViewMode.always) {
                return true
            }
            else if (!this.editing && this.clearButtonMode == UITextFieldViewMode.unlessEditing) {
                return true
            }
            else if (this.editing && this.clearButtonMode == UITextFieldViewMode.whileEditing && this.text && this.text.length > 0) {
                return true
            }
            return false
        })()
        const displayRightView = (() => {
            if (displayClearButton) {
                return false
            }
            if (this.rightView == null) { return false }
            if (this.rightViewMode == UITextFieldViewMode.always) {
                return true
            }
            else if (!this.editing && this.rightViewMode == UITextFieldViewMode.unlessEditing) {
                return true
            }
            else if (this.editing && this.rightViewMode == UITextFieldViewMode.whileEditing) {
                return true
            }
            return false
        })()
        const displayLeftView = (() => {
            if (this.leftView == null) { return false }
            if (this.leftViewMode == UITextFieldViewMode.always) {
                return true
            }
            else if (!this.editing && this.leftViewMode == UITextFieldViewMode.unlessEditing) {
                return true
            }
            else if (this.editing && this.leftViewMode == UITextFieldViewMode.whileEditing) {
                return true
            }
            return false
        })()
        this.clearButtonView.hidden = !displayClearButton
        this.clearButtonView.frame = { x: this.bounds.width - 36.0, y: (this.bounds.height - 44.0) / 2.0, width: 36.0, height: 44.0 }
        if (displayLeftView) {
            if (this.leftView) {
                this.addSubview(this.leftView)
                this.leftView.frame = { x: 0.0, y: (this.bounds.height - this.leftView.frame.height) / 2.0, width: this.leftView.frame.width, height: this.leftView.frame.height }
            }
        }
        else {
            if (this.leftView) {
                this.leftView.removeFromSuperview()
            }
        }
        if (displayRightView) {
            if (this.rightView) {
                this.addSubview(this.rightView)
                this.rightView.frame = { x: this.bounds.width - this.rightView.frame.width, y: (this.bounds.height - this.rightView.frame.height) / 2.0, width: this.rightView.frame.width, height: this.rightView.frame.height }
            }
        }
        else {
            if (this.rightView) {
                this.rightView.removeFromSuperview()
            }
        }
        this.editText.frame = {
            x: (displayLeftView && this.leftView !== undefined ? (this.leftView.frame.width + 1) : 0.0),
            y: 0.0,
            width: this.bounds.width - (displayLeftView && this.leftView !== undefined ? (this.leftView.frame.width + 1) : 0.0) - (displayRightView && this.rightView ? (this.rightView.frame.width + 1) : 0.0) - (displayClearButton ? 36.0 : 0.0),
            height: this.bounds.height
        }
        this.placeholderLabel.frame = this.editText.frame
    }

}