declare var require: any
const Bezier = require('./Bezier')

export class LinearAndCurveAnimator {

    duration: number = 0
    startValue: number = 0
    currentValue: number = 0
    endValue: number = 0

    private startTime: number = 0
    private cancelled: boolean = false
    private bezier: any | undefined = undefined
    private rafHandler: any

    private allListenners: {
        onUpdate: (currentValue: number) => void,
        onEnd: () => void,
    }[] = []

    constructor(readonly isCurve: boolean = false) {
        if (isCurve) {
            this.bezier = Bezier(0.42, 0, 1, 1)
        }
    }

    addListener(listenner: {
        onUpdate: (currentValue: number) => void,
        onEnd: () => void,
    }) {
        this.allListenners.push(listenner)
    }

    start() {
        this.startTime = Date.now()
        this.doFrame()
    }

    doFrame() {
        if (this.cancelled) { return }
        let progress = ((Date.now() - this.startTime) / this.duration)
        if (this.bezier) {
            progress = this.bezier(progress)
        }
        this.currentValue = this.startValue + (this.endValue - this.startValue) * progress
        this.allListenners.forEach(it => it.onUpdate(this.currentValue))
        if (progress >= 1.0) {
            this.allListenners.forEach(it => it.onEnd())
            return
        }
        this.rafHandler = requestAnimationFrame(this.doFrame.bind(this))
    }

    cancel() {
        this.cancelled = true
        cancelAnimationFrame(this.rafHandler)
    }

}