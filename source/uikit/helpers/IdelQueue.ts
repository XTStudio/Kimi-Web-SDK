export class IdelQueue {

    static shared = new IdelQueue

    private queueFlag = 0
    private queue: (() => void)[] = []
    private isBusy = false
    private countOfLocks = 0

    add(callback: () => void): string {
        if (!this.isBusy) {
            callback()
            return ""
        }
        this.queue.push(callback)
        return `${this.queueFlag}.${this.queue.length - 1}`
    }

    cancel(id: string) {
        if (typeof id !== "string") { return }
        let qf = parseInt(id.split(".")[0])
        if (qf !== this.queueFlag) { return }
        let qs = parseInt(id.split(".")[1])
        this.queue[qs] = this.noOpt
    }

    consume() {
        this.queue.forEach(it => it())
        this.queue = []
        this.queueFlag++
    }

    markBusy() {
        this.isBusy = true
        this.countOfLocks++;
    }

    markIdel() {
        this.countOfLocks--;
        if (this.countOfLocks <= 0) {
            this.isBusy = false
            this.consume()
        }
    }

    noOpt() { }

}