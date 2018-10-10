import { UIView, UINativeTouchView } from "./UIView";
import { UIColor } from "./UIColor";
import { UIFont } from "./UIFont";
import { UITextAlignment, UITextFieldViewMode, UIControlState, UITextAutocapitalizationType, UITextAutocorrectionType, UITextSpellCheckingType, UIKeyboardType, UIReturnKeyType } from "./UIEnums";

class NativeEditText extends UINativeTouchView {

    inputElement = document.createElement("textarea")

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
        this.domElement.appendChild(this.inputElement)
    }

}

export class UITextView extends UIView {

    editText = new NativeEditText
    private _oldValue: any = ""

    constructor() {
        super()
        this.backgroundColor = UIColor.white
        this.addSubview(this.editText)
        this.editText.inputElement.addEventListener("focus", () => {
            if (this.val("shouldBeginEditing", this) === false) {
                this.editText.inputElement.blur()
                return
            }
            this.editing = true
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
        })
    }

    public get text(): string {
        return this.editText.inputElement.value || "";
    }

    public set text(value: string) {
        this.editText.inputElement.value = value
    }

    private _textColor: UIColor | undefined = undefined

    public get textColor(): UIColor | undefined {
        return this._textColor;
    }

    public set textColor(value: UIColor | undefined) {
        this._textColor = value;
        this.editText.inputElement.style.color = value ? value.toStyle() : null
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
    }

    private _editable: boolean = true

    public get editable(): boolean {
        return this._editable
    }

    public set editable(value: boolean) {
        this._editable = value
        this.editText.inputElement.readOnly = !value
    }

    private _selectable: boolean = true


    public get selectable(): boolean {
        return this._selectable
    }

    public set selectable(value: boolean) {
        this._selectable = value
        this.editText.inputElement.style.userSelect = value ? "auto" : "none"
    }

    editing: boolean = false

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

    keyboardType: UIKeyboardType = UIKeyboardType.default
    returnKeyType: UIReturnKeyType = UIReturnKeyType.default
    secureTextEntry: boolean = false

    layoutSubviews() {
        super.layoutSubviews()
        this.editText.frame = { x: 4, y: 4, width: this.bounds.width - 8, height: this.bounds.height - 8 }
    }

}