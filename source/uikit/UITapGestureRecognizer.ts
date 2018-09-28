import { UIPoint } from "./UIPoint";
import { UITouch, UITouchPhase } from "./UITouch";
import { UIGestureRecognizer, UIGestureRecognizerState } from "./UIGestureRecognizer";
import { UIView } from "./UIView";

export class UITapGestureRecognizer extends UIGestureRecognizer {

    numberOfTapsRequired = 1

    numberOfTouchesRequired = 1

    private beganPoints: { [key: number]: UIPoint } = {}

    private validPointsCount = 0

    handleTouch(touches: UITouch[]) {
        super.handleTouch(touches)
        touches.forEach(it => {
            if (it.phase == UITouchPhase.began) {
                if (UIView.recognizedGesture != undefined) { this.beganPoints = {}; return }
                if (it.windowPoint) {
                    this.beganPoints[it.identifier] = it.windowPoint
                }
            }
            else if (it.phase == UITouchPhase.moved) {
                if (it.windowPoint && this.beganPoints[it.identifier]) {
                    if (Math.abs(this.beganPoints[it.identifier].x - it.windowPoint.x) >= 22.0 || Math.abs(this.beganPoints[it.identifier].y - it.windowPoint.y) >= 22.0) {
                        delete this.beganPoints[it.identifier]
                    }
                }
            }
            else if (it.phase == UITouchPhase.ended) {
                if (UIView.recognizedGesture != undefined) {
                    this.beganPoints = {}
                    this.state = UIGestureRecognizerState.possible
                    this.validPointsCount = 0
                    return
                }
                if (it.tapCount >= this.numberOfTapsRequired && this.beganPoints[it.identifier] != undefined) {
                    this.validPointsCount++
                }
                delete this.beganPoints[it.identifier]
                if (this.validPointsCount >= this.numberOfTouchesRequired) {
                    UIView.recognizedGesture = this
                    this.state = UIGestureRecognizerState.ended
                    this.handleEvent("touch")
                    this.emit("touch", this)
                    setTimeout(() => {
                        UIView.recognizedGesture = undefined
                    }, 0)
                }
                if (Object.keys(this.beganPoints).length == 0 || this.state == UIGestureRecognizerState.ended) {
                    this.state = UIGestureRecognizerState.possible
                    this.validPointsCount = 0
                }
            }
        })
    }

}