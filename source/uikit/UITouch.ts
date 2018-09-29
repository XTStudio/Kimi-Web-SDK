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

export class VelocityTracker {

    private movements: UITouch[] = []
    velocity: UIPoint = { x: 0, y: 0 }

    reset() {
        this.movements = []
        this.velocity = { x: 0, y: 0 }
    }

    addMovement(touch: UITouch) {
        this.movements.push({ ...touch } as UITouch)
    }

    computeCurrentVelocity() {
        for (let index = this.movements.length - 1; index >= 1; index--) {
            const current = this.movements[index]
            const last = this.movements[index - 1]
            if (!current.windowPoint || !last.windowPoint) {
                continue
            }
            const timeDiff = current.timestamp - last.timestamp
            if (timeDiff > 0.008) {
                this.velocity = {
                    x: (current.windowPoint.x - last.windowPoint.x) / timeDiff,
                    y: (current.windowPoint.y - last.windowPoint.y) / timeDiff,
                }
                break
            }
        }
    }

}