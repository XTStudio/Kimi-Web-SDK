import { currentAnimationTimeMillis } from "../uikit/helpers/Now";

export class CADisplayLink {

    constructor(readonly vsyncBlock: () => void) {

    }

    timestamp: number = 0

    handler: any

    active(): void {
        this.handler = requestAnimationFrame(() => {
            this.timestamp = currentAnimationTimeMillis()
            this.vsyncBlock()
            this.active()
        })
    }

    invalidate(): void {
        cancelAnimationFrame(this.handler)
    }

}