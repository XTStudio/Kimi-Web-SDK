export class UIColor {

    static black = new UIColor(0.0, 0.0, 0.0, 1.0)
    static clear = new UIColor(0.0, 0.0, 0.0, 0.0)
    static gray = new UIColor(0.5, 0.5, 0.5, 1.0)
    static red = new UIColor(1.0, 0.0, 0.0, 1.0)
    static yellow = new UIColor(1.0, 1.0, 0.0, 1.0)
    static green = new UIColor(0.0, 1.0, 0.0, 1.0)
    static blue = new UIColor(0.0, 0.0, 1.0, 1.0)
    static white = new UIColor(1.0, 1.0, 1.0, 1.0)

    static hexColor(hexValue: string): UIColor {
        const trimedValue = hexValue.replace('#', '')
        if (trimedValue.length === 6) {
            return new UIColor(
                parseInt(trimedValue.substr(0, 2), 16) / 255.0,
                parseInt(trimedValue.substr(2, 2), 16) / 255.0,
                parseInt(trimedValue.substr(4, 2), 16) / 255.0,
                1.0,
            )
        }
        else if (trimedValue.length === 8) {
            return new UIColor(
                parseInt(trimedValue.substr(2, 2), 16) / 255.0,
                parseInt(trimedValue.substr(4, 2), 16) / 255.0,
                parseInt(trimedValue.substr(6, 2), 16) / 255.0,
                parseInt(trimedValue.substr(0, 2), 16) / 255.0,
            )
        }
        else {
            return UIColor.clear
        }
    }

    constructor(readonly r: number, readonly g: number, readonly b: number, readonly a: number) { }

    colorWithAlphaComponent(value: number): UIColor {
        return new UIColor(this.r, this.g, this.b, this.a * value)
    }

    toStyle(): string {
        return 'rgba(' + (this.r * 255).toFixed(0) + ', ' + (this.g * 255).toFixed(0) + ', ' + (this.b * 255).toFixed(0) + ', ' + this.a.toFixed(6) + ')'
    }

}

