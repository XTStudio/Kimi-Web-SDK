import { UIRectZero, UIRect } from "./UIRect";
import { UISize } from "./UISize";

export class UIAttributedString {

    constructor(readonly str: string, readonly attributes: { [key: string]: any }) {

    }

    measure(inSize: UISize): UIRect {
        return UIRectZero
    }

    mutable(): UIMutableAttributedString {
        return new UIMutableAttributedString(this.str, this.attributes)
    }

    toHTMLText(): string {
        return ""
    }

}

export class UIMutableAttributedString extends UIAttributedString {

}