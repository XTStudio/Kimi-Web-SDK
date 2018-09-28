import { UIGestureRecognizer, UIGestureRecognizerState } from "./UIGestureRecognizer";
import { UIPoint } from "./UIPoint";
import { UITouch, UITouchPhase } from "./UITouch";
import { UIView } from "./UIView";

export class UILongPressGestureRecognizer extends UIGestureRecognizer {

    numberOfTapsRequired = 1

    numberOfTouchesRequired = 1

    minimumPressDuration = 0.5

    allowableMovement = 10

    private timerTask: any | undefined

    private beganPoints: { [key: number]: UIPoint } = {}

    handleTouch(touches: UITouch[]) {
        super.handleTouch(touches)
        touches.forEach((it) => {
            if (it.phase == UITouchPhase.began) {
                if (UIView.recognizedGesture != undefined) { this.beganPoints = {}; return }
                if (it.windowPoint) {
                    this.beganPoints[it.identifier] = it.windowPoint
                }
                if (this.timerTask === undefined && Object.keys(this.beganPoints).length >= this.numberOfTouchesRequired) {
                    this.timerTask = setTimeout(() => {
                        if (UIView.recognizedGesture == undefined && this.state == UIGestureRecognizerState.possible) {
                            UIView.recognizedGesture = this
                            this.state = UIGestureRecognizerState.began
                            this.handleEvent("began")
                            this.emit("began", this)
                        }
                        else {
                            this.state = UIGestureRecognizerState.failed
                        }
                    }, this.minimumPressDuration * 1000)
                }
            }
            else if (it.phase == UITouchPhase.moved) {
                if (this.state == UIGestureRecognizerState.possible) {
                    if (it.windowPoint && this.beganPoints[it.identifier]) {
                        const beganPoint = this.beganPoints[it.identifier]
                        if (Math.abs(beganPoint.x - it.windowPoint.x) >= this.allowableMovement || Math.abs(beganPoint.y - it.windowPoint.y) >= this.allowableMovement) {
                            clearTimeout(this.timerTask)
                            this.state = UIGestureRecognizerState.failed
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
                clearTimeout(this.timerTask)
                this.timerTask = undefined
                if (this.state == UIGestureRecognizerState.began || this.state == UIGestureRecognizerState.changed) {
                    this.state = UIGestureRecognizerState.ended
                    this.handleEvent("ended")
                    this.emit("ended", this)
                    setTimeout(() => {
                        UIView.recognizedGesture = undefined
                    })
                }
                this.state = UIGestureRecognizerState.possible
                this.beganPoints = {}
            }
            else if (it.phase == UITouchPhase.cancelled) {
                clearTimeout(this.timerTask)
                this.timerTask = undefined
                if (this.state == UIGestureRecognizerState.began || this.state == UIGestureRecognizerState.changed) {
                    this.state = UIGestureRecognizerState.cancelled
                    this.handleEvent("cancelled")
                    this.emit("cancelled", this)
                    setTimeout(() => {
                        UIView.recognizedGesture = undefined
                    })
                }
                this.state = UIGestureRecognizerState.possible
                this.beganPoints = {}
            }
        })
    }

}