declare var require: any
import { LinearAndCurveAnimator } from "./helpers/LinearAnimator";
const { SpringSystem } = require('./helpers/rebound.min')

export interface UIAnimation {

    setStartValue(value: number): void
    setEndValue(value: number): void
    setUpdateListener(listener: (value: number) => void): void
    cancel(): void

}

class LinearAnimation implements UIAnimation {

    constructor(private animator: LinearAndCurveAnimator) { }

    setStartValue(value: number) {
        this.animator.startValue = value
    }

    setEndValue(value: number) {
        this.animator.endValue = value
        this.animator.start()
    }

    setUpdateListener(listener: (value: number) => void) {
        this.animator.addListener({
            onUpdate: (newValue: number) => {
                listener(newValue)
            },
            onEnd: () => { }
        })
    }

    cancel() {
        this.animator.cancel()
    }

}

class SpringAnimation implements UIAnimation {

    constructor(readonly spring: any) { }

    setStartValue(value: number): void {
        this.spring.setCurrentValue(value)
    }

    setEndValue(value: number): void {
        this.spring.setEndValue(value)
    }

    setUpdateListener(listener: (value: number) => void): void {
        this.spring.addListener({
            onSpringUpdate: () => {
                listener(this.spring.getCurrentValue())
            }
        })
    }

    cancel(): void {
        this.spring.removeAllListeners()
    }


}

export class UIAnimator {

    static shared = new UIAnimator

    static duringAnimationValueSet = false

    static activeAnimator: UIAnimator | undefined = undefined

    private springSystem = new SpringSystem

    animationCreater: (() => UIAnimation) | undefined = undefined

    linear(duration: number, isCurve: boolean, animations: () => void, completion: (() => void) | undefined) {
        UIAnimator.activeAnimator = this
        var completed = false
        this.animationCreater = () => {
            const animator = new LinearAndCurveAnimator(isCurve)
            animator.duration = duration * 1000
            animator.addListener({
                onUpdate: () => { },
                onEnd: () => {
                    if (!completed) {
                        completed = true
                        if (completion) {
                            completion()
                        }
                    }
                },
            })
            return new LinearAnimation(animator)
        }
        animations()
        UIAnimator.activeAnimator = undefined
    }

    static linear(duration: number, animations: () => void, completion: (() => void) | undefined) {
        UIAnimator.shared.linear(duration, false, animations, completion)
    }

    static curve(duration: number, animations: () => void, completion: (() => void) | undefined) {
        UIAnimator.shared.linear(duration, true, animations, completion)
    }

    spring(tension: number, friction: number, isBouncy: boolean, animations: () => void, completion: (() => void) | undefined) {
        UIAnimator.activeAnimator = this
        var completed = false
        this.animationCreater = () => {
            const spring = isBouncy ? this.springSystem.createSpringWithBouncinessAndSpeed(tension, friction) : this.springSystem.createSpring(tension, friction)
            spring.addListener({
                onSpringAtRest: () => {
                    if (!completed) {
                        completed = true
                        if (completion) {
                            completion()
                        }
                    }
                }
            })
            return new SpringAnimation(spring)
        }
        animations()
        UIAnimator.activeAnimator = undefined
    }

    static spring(tension: number, friction: number, animations: () => void, completion: (() => void) | undefined) {
        UIAnimator.shared.spring(tension, friction, false, animations, completion)
    }

    static bouncy(bounciness: number, speed: number, animations: () => void, completion: (() => void) | undefined) {
        UIAnimator.shared.spring(bounciness, speed, true, animations, completion)
    }

}