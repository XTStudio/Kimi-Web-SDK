import { UIPoint, UIPointZero } from "./UIPoint";
import { UITouch } from "./UITouch";
import { UIView } from "./UIView";
import { EventEmitter } from "../kimi/EventEmitter";

export enum UIGestureRecognizerState {
    possible,
    began,
    changed,
    ended,
    cancelled,
    failed,
}

export class UIGestureRecognizer extends EventEmitter {

    protected state: UIGestureRecognizerState = UIGestureRecognizerState.possible

    enabled: Boolean = true

    view: UIView | undefined = undefined

    requireGestureRecognizerToFail(otherGestureRecognizer: UIGestureRecognizer) {

    }

    locationInView(view: UIView | undefined): UIPoint {
        const touch = this.touches[0]
        if (touch) {
            return touch.locationInView(view)
        }
        return UIPointZero
    }

    numberOfTouches(): number {
        return this.touches.values.length
    }

    locationOfTouch(touchIndex: number, view: UIView | undefined): UIPoint {
        const touch = this.touches[touchIndex]
        if (touch) {
            return touch.locationInView(view)
        }
        return UIPointZero
    }

    private touches: UITouch[] = []

    handleTouch(touches: UITouch[]) { this.touches = touches }

    handleEvent(name: String) { }

}