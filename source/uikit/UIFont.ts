export class UIFont {

    constructor(
        readonly pointSize: number,
        readonly fontStyle?: "thin" | "light" | "regular" | "medium" | "bold" | "heavy" | "black" | "italic",
        readonly fontName?: string
    ) {
        if (fontName === undefined) {
            this.fontName = "-apple-system"
        }
    }

}