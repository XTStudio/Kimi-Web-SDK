export class Timer {

    private handler: any
    private cancelled = false

    constructor(timeInterval: number, block: () => void, readonly repeats: boolean) {
        if (repeats) {
            this.handler = setInterval(() => {
                if (!this.cancelled && block) {
                    block()
                }
            }, timeInterval * 1000)
        }
        else {
            this.handler = setTimeout(() => {
                if (!this.cancelled && block) {
                    block()
                }
            }, timeInterval * 1000)
        }

    }

    invalidate() {
        this.cancelled = true
        if (this.repeats) {
            clearInterval(this.handler)
        }
        else {
            clearTimeout(this.handler)
        }
    }

}