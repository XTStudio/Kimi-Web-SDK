export class UIColor {

    static black = new UIColor(0.0, 0.0, 0.0, 1.0)
    static clear = new UIColor(0.0, 0.0, 0.0, 0.0)
    static gray = new UIColor(0.5, 0.5, 0.5, 1.0)
    static red = new UIColor(1.0, 0.0, 0.0, 1.0)
    static yellow = new UIColor(1.0, 1.0, 0.0, 1.0)
    static green = new UIColor(0.0, 1.0, 0.0, 1.0)
    static blue = new UIColor(0.0, 0.0, 1.0, 1.0)
    static white = new UIColor(1.0, 1.0, 1.0, 1.0)

    constructor(readonly r: number, readonly g: number, readonly b: number, readonly a: number) { }

    colorWithAlphaComponent(value: number): UIColor {
        return new UIColor(this.r, this.g, this.b, this.a * value)
    }

    toStyle(): string {
        return 'rgba(' + (this.r * 255).toString() + ', ' + (this.g * 255).toString() + ', ' + (this.b * 255).toString() + ', ' + this.a.toString() + ')'
    }

}

