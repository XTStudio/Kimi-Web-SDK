import { UIGestureRecognizer } from "./UIGestureRecognizer";
import { UITouch } from "./UITouch";

export class UIPinchGestureRecognizer extends UIGestureRecognizer {

    scale = 1.0

    velocity = 0.0

    handleTouch(touches: UITouch[]) {
        super.handleTouch(touches)
    }

}