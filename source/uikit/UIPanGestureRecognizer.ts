import { UIGestureRecognizer, UIGestureRecognizerState } from "./UIGestureRecognizer";
import { UIPoint } from "./UIPoint";
import { UIView } from "./UIView";
import { UITouch, UITouchPhase } from "./UITouch";

export class UIPanGestureRecognizer extends UIGestureRecognizer {

    translationInView(view: UIView | undefined): UIPoint {
        if (!this.firstTouch) {
            return { x: 0, y: 0 }
        }
        const windowPoint = this.firstTouch.windowPoint
        if (!windowPoint) {
            return { x: 0, y: 0 }
        }
        const translationPoint = this.translationPoint
        if (!translationPoint) {
            return { x: 0, y: 0 }
        }
        return { x: windowPoint.x - translationPoint.x, y: windowPoint.y - translationPoint.y }
    }

    setTranslation(translation: UIPoint, inView: UIView | undefined) {
        if (!this.firstTouch) {
            return
        }
        const windowPoint = this.firstTouch.windowPoint
        if (!windowPoint) {
            return
        }
        this.translationPoint = { x: windowPoint.x - translation.x, y: windowPoint.y - translation.y }
    }

    velocityInView(view: UIView | undefined): UIPoint {
        // val x = UIView.sharedVelocityTracker.xVelocity.toDouble() / scale
        // val y = UIView.sharedVelocityTracker.yVelocity.toDouble() / scale
        // return CGPoint(x, y)
        return { x: 0, y: 0 }
    }

    lockedDirection: number | undefined = undefined
    private firstTouch: UITouch | undefined = undefined
    private translationPoint: UIPoint | undefined = undefined
    private beganPoints: { [key: number]: UIPoint } = {}

    handleTouch(touches: UITouch[]) {
        super.handleTouch(touches)
        touches.forEach((it) => {
            if (it.identifier == 0) {
                this.firstTouch = it
            }
            if (it.phase == UITouchPhase.began) {
                if (UIView.recognizedGesture != undefined && UIView.recognizedGesture != this) {
                    this.beganPoints = {}; return
                }
                if (it.windowPoint) {
                    this.beganPoints[it.identifier] = it.windowPoint
                }
                if (it.identifier == 0) {
                    this.translationPoint = it.windowPoint
                }
            }
            else if (it.phase == UITouchPhase.moved) {
                if (this.state == UIGestureRecognizerState.possible) {
                    if (UIView.recognizedGesture != undefined && UIView.recognizedGesture != this) {
                        this.state = UIGestureRecognizerState.failed
                        return
                    }
                    if (it.windowPoint && this.beganPoints[it.identifier]) {
                        const beganPoint = this.beganPoints[it.identifier]
                        if (this.lockedDirection !== undefined) {
                            if (this.lockedDirection === 1) {
                                if (Math.abs(beganPoint.y - it.windowPoint.y) >= 8.0) {
                                    UIView.recognizedGesture = this
                                    this.state = UIGestureRecognizerState.began
                                    this.handleEvent("began")
                                    this.emit("began", this)
                                }
                            }
                            else if (this.lockedDirection === 2) {
                                if (Math.abs(beganPoint.x - it.windowPoint.x) >= 8.0) {
                                    UIView.recognizedGesture = this
                                    this.state = UIGestureRecognizerState.began
                                    this.handleEvent("began")
                                    this.emit("began", this)
                                }
                            }
                        }
                        else {
                            if (Math.abs(beganPoint.x - it.windowPoint.x) >= 8.0 || Math.abs(beganPoint.y - it.windowPoint.y) >= 8.0) {
                                UIView.recognizedGesture = this
                                this.state = UIGestureRecognizerState.began
                                this.handleEvent("began")
                                this.emit("began", this)
                            }
                        }
                    }
                }
                else if (this.state == UIGestureRecognizerState.began || this.state == UIGestureRecognizerState.changed) {
                    this.state = UIGestureRecognizerState.changed
                    this.handleEvent("changed")
                    this.emit("changed", this)
                }
            }
            else if (it.phase == UITouchPhase.ended) {
                if (this.state == UIGestureRecognizerState.began || this.state == UIGestureRecognizerState.changed) {
                    this.state = UIGestureRecognizerState.ended
                    this.handleEvent("ended")
                    this.emit("ended", this)
                    setTimeout(() => {
                        UIView.recognizedGesture = undefined
                    }, 0)
                }
                if (it.identifier == 0) {
                    this.state = UIGestureRecognizerState.possible
                }
            }
            else if (it.phase == UITouchPhase.cancelled) {
                if (this.state == UIGestureRecognizerState.began || this.state == UIGestureRecognizerState.changed) {
                    this.state = UIGestureRecognizerState.cancelled
                    this.handleEvent("cancelled")
                    this.emit("cancelled", this)
                    setTimeout(() => {
                        UIView.recognizedGesture = undefined
                    }, 0)
                }
                this.state = UIGestureRecognizerState.possible
            }
        })
    }

}