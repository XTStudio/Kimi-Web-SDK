import { UIRect, UIRectZero } from "./UIRect";

export class UIScreen {

    static main = new UIScreen

    bounds: UIRect = { x: 0, y: 0, width: window.screen.width, height: window.screen.height }

    scale: number = window.devicePixelRatio

}