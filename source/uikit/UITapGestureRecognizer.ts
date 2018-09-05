import { UIPoint } from "./UIPoint";
import { UITouch, UITouchPhase } from "./UITouch";
import { UIGestureRecognizer, UIGestureRecognizerState } from "./UIGestureRecognizer";
import { UIView } from "./UIView";

export class UITapGestureRecognizer extends UIGestureRecognizer {

    numberOfTapsRequired = 1

    numberOfTouchesRequired = 1

    private beganPoints: Map<number, UIPoint> = new Map()

    private validPointsCount = 0

    handleTouch(touches: UITouch[]) {
        super.handleTouch(touches)
        touches.forEach(it => {
            if (it.phase == UITouchPhase.began) {
                if (UIView.recognizedGesture != null) { this.beganPoints.clear(); return }
                if (it.windowPoint) {
                    this.beganPoints[it.identifier] = it.windowPoint
                }
            }
            else if (it.phase == UITouchPhase.moved) {
                if (it.windowPoint && this.beganPoints[it.identifier]) {
                    if (Math.abs(this.beganPoints[it.identifier].x - it.windowPoint.x) >= 22.0 || Math.abs(this.beganPoints[it.identifier].y - it.windowPoint.y) >= 22.0) {
                        this.beganPoints.delete(it.identifier)
                    }
                }
            }
            else if (it.phase == UITouchPhase.ended) {
                if (UIView.recognizedGesture != null) {
                    this.beganPoints.clear()
                    this.state = UIGestureRecognizerState.possible
                    this.validPointsCount = 0
                    return
                }
                if (it.tapCount >= this.numberOfTapsRequired && this.beganPoints[it.identifier] != null) {
                    this.validPointsCount++
                }
                this.beganPoints.delete(it.identifier)
                if (this.validPointsCount >= this.numberOfTouchesRequired) {
                    UIView.recognizedGesture = this
                    this.state = UIGestureRecognizerState.ended
                    this.handleEvent("touch")
                    // val e = it.view ?.convertRectToWindow(null)
                    // EDOJavaHelper.emit(this, "touch", this)
                    setTimeout(() => {
                        UIView.recognizedGesture = null
                    }, 0)
                }
                if (this.beganPoints.keys.length == 0 || this.state == UIGestureRecognizerState.ended) {
                    this.state = UIGestureRecognizerState.possible
                    this.validPointsCount = 0
                }
            }
        })
    }
}