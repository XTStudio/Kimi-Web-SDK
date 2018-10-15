import { currentAnimationTimeMillis } from "../uikit/helpers/Now";

export class CADisplayLink {

    constructor(readonly vsyncBlock: () => void) {

    }

    timestamp: number = 0

    handler: any

    private cancelled = false

    active(): void {
        this.handler = requestAnimationFrame(() => {
            if (this.cancelled) {
                return
            }
            this.timestamp = currentAnimationTimeMillis()
            this.vsyncBlock()
            this.active()
        })
    }

    invalidate(): void {
        this.cancelled = true
        cancelAnimationFrame(this.handler)
    }

}