import { UIPoint, UIPointZero } from "./UIPoint";
import { UIView, UIWindow } from "./UIView";

export enum UITouchPhase {
    began,
    moved,
    stationary,
    ended,
    cancelled,
}

export class UITouch {

    identifier: number = 0

    timestamp: number = 0.0

    phase: UITouchPhase = UITouchPhase.cancelled

    tapCount: number = 0

    window: UIWindow | undefined = undefined

    windowPoint: UIPoint | undefined = undefined

    view: UIView | undefined = undefined

    gestureRecognizers: any[] = []

    locationInView(view: UIView | undefined): UIPoint {
        const aView = view || this.view
        if (aView === undefined) {
            return UIPointZero
        }
        const windowPoint = this.windowPoint || UIPointZero
        return aView.convertPointFromWindow(windowPoint) || UIPointZero
    }

    previousLocationInView(view: UIView | undefined): UIPoint {
        return UIPointZero
    }

}