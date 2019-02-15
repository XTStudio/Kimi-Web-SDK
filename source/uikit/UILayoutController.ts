import { UIPoint } from './UIPoint';
import { UIView } from "./UIView";
import { UIRect } from "./UIRect";
import { UIEdgeInsets } from "./UIEdgeInsets";
import { UIAnimator } from './UIAnimator';

enum LayoutType {
    Left,
    Top,
    Right,
    Bottom,
    Width,
    Height,
    Edge,
    Full,
}

interface LayoutItem {
    target: UIView
    type: LayoutType
    expression: number | string | ((relativeFrame: UIRect) => number)
    options: {
        toViewAlignment?: UILayoutAlignment,
        targetViewAlignment?: UILayoutAlignment,
        inset?: UIEdgeInsets,
    }
}

type LayoutExpression = number | string | ((relativeFrame: UIRect) => number)

export enum UILayoutAlignment {
    Middle,
    Start,
    End,
}

export class UILayoutController {

    private layoutItems: LayoutItem[] = []
    private linkedItems: UIView[] = []

    constructor(readonly owner: UIView) { }

    apply() {
        if (this.linkedItems.length > 0) {
            this.linkedItems.forEach(it => it.layoutController.apply())
        }
        if (this.layoutItems.length === 0) { return }
        let ownerFrame = this.owner.frame
        let ownerParentLocations: Map<UIView, UIPoint> = (() => {
            let map = new Map()
            let view: UIView | undefined = this.owner
            let location = { x: 0, y: 0 }
            while (view !== undefined) {
                map.set(view, location)
                location = { x: location.x + view.frame.x, y: location.y + view.frame.y }
                view = view.superview
            }
            return map
        })()
        let targetFrames: Map<UIView, UIRect> = new Map()
        let changed = true
        let retry = 0
        while (changed) {
            retry++
            if (retry > 10) { break }
            changed = false
            this.layoutItems.forEach(it => {
                let target: UIView = it.target
                let targetFrame: any = targetFrames.get(target) || {}
                switch (it.type) {
                    case LayoutType.Left:
                        {
                            let x = 0
                            if (it.options.toViewAlignment === UILayoutAlignment.Middle) {
                                x += ownerFrame.width / 2.0
                            }
                            else if (it.options.toViewAlignment === UILayoutAlignment.End) {
                                x += ownerFrame.width
                            }
                            if (it.options.targetViewAlignment === UILayoutAlignment.Middle) {
                                x -= ((targetFrame.width !== undefined ? targetFrame.width : target.frame.width) / 2.0)
                            }
                            else if (it.options.targetViewAlignment === UILayoutAlignment.End) {
                                x -= (targetFrame.width !== undefined ? targetFrame.width : target.frame.width)
                            }
                            const newValue = x + this.calculate(ownerFrame, ownerFrame.width, it.expression)
                            if (targetFrame.x !== newValue) {
                                changed = true
                            }
                            targetFrame.x = newValue
                        }
                        break
                    case LayoutType.Top:
                        {
                            let y = 0
                            if (it.options.toViewAlignment === UILayoutAlignment.Middle) {
                                y += ownerFrame.height / 2.0
                            }
                            else if (it.options.toViewAlignment === UILayoutAlignment.End) {
                                y += ownerFrame.height
                            }
                            if (it.options.targetViewAlignment === UILayoutAlignment.Middle) {
                                y -= ((targetFrame.height !== undefined ? targetFrame.height : target.frame.height) / 2.0)
                            }
                            else if (it.options.targetViewAlignment === UILayoutAlignment.End) {
                                y -= (targetFrame.height !== undefined ? targetFrame.height : target.frame.height)
                            }
                            const newValue = y + this.calculate(ownerFrame, ownerFrame.height, it.expression)
                            if (targetFrame.y !== newValue) {
                                changed = true
                            }
                            targetFrame.y = newValue
                        }
                        break
                    case LayoutType.Right:
                        {
                            let x = 0
                            if (it.options.toViewAlignment === UILayoutAlignment.Middle) {
                                x += ownerFrame.width / 2.0
                            }
                            else if (it.options.toViewAlignment === UILayoutAlignment.End) {
                                x += ownerFrame.width
                            }
                            if (it.options.targetViewAlignment === UILayoutAlignment.Middle) {
                                x -= ((targetFrame.width !== undefined ? targetFrame.width : target.frame.width) / 2.0)
                            }
                            else if (it.options.targetViewAlignment === UILayoutAlignment.End) {
                                x -= (targetFrame.width !== undefined ? targetFrame.width : target.frame.width)
                            }
                            const newValue = x - this.calculate(ownerFrame, ownerFrame.width, it.expression)
                            if (targetFrame.x !== newValue) {
                                changed = true
                            }
                            targetFrame.x = newValue
                        }
                        break
                    case LayoutType.Bottom:
                        {
                            let y = 0
                            if (it.options.toViewAlignment === UILayoutAlignment.Middle) {
                                y += ownerFrame.height / 2.0
                            }
                            else if (it.options.toViewAlignment === UILayoutAlignment.End) {
                                y += ownerFrame.height
                            }
                            if (it.options.targetViewAlignment === UILayoutAlignment.Middle) {
                                y -= ((targetFrame.height !== undefined ? targetFrame.height : target.frame.height) / 2.0)
                            }
                            else if (it.options.targetViewAlignment === UILayoutAlignment.End) {
                                y -= (targetFrame.height !== undefined ? targetFrame.height : target.frame.height)
                            }
                            const newValue = y - this.calculate(ownerFrame, ownerFrame.height, it.expression)
                            if (targetFrame.y !== newValue) {
                                changed = true
                            }
                            targetFrame.y = newValue
                        }
                        break
                    case LayoutType.Width:
                        {
                            const newValue = this.calculate(ownerFrame, ownerFrame.width, it.expression)
                            if (targetFrame.width !== newValue) {
                                changed = true
                            }
                            targetFrame.width = newValue
                        }
                        break
                    case LayoutType.Height:
                        {
                            const newValue = this.calculate(ownerFrame, ownerFrame.height, it.expression)
                            if (targetFrame.height !== newValue) {
                                changed = true
                            }
                            targetFrame.height = newValue
                        }
                        break
                    case LayoutType.Edge:
                        const frame: any = { x: 0, y: 0, width: ownerFrame.width, height: ownerFrame.height }
                        if (it.options.inset) {
                            frame.x += it.options.inset.left
                            frame.width -= it.options.inset.left
                            frame.width -= it.options.inset.right
                            frame.y += it.options.inset.top
                            frame.height -= it.options.inset.top
                            frame.height -= it.options.inset.bottom
                        }
                        targetFrame = frame
                        break
                    case LayoutType.Full:
                        targetFrame = { x: 0, y: 0, width: ownerFrame.width, height: ownerFrame.height }
                        break
                }
                targetFrames.set(target, targetFrame)
            })
        }
        targetFrames.forEach((it, view) => {
            let offsetPoint = { x: 0, y: 0 }
            let sView: UIView | undefined = view
            while (sView !== undefined) {
                const v = ownerParentLocations.get(sView)
                if (v !== undefined) {
                    if (it.x !== undefined) {
                        offsetPoint.x += v.x
                    }
                    if (it.y !== undefined) {
                        offsetPoint.y += v.y
                    }
                    break
                }
                sView = sView.superview
            }
            const frame = { ...view.frame, ...it }
            frame.x += offsetPoint.x
            frame.y += offsetPoint.y
            view.frame = frame
        })
    }

    calculate(relativeFrame: UIRect, relativeValue: number, expression: number | string | ((relativeFrame: UIRect) => number)): number {
        if (typeof expression === "number") {
            return expression
        }
        else if (typeof expression === "string" && expression.indexOf("%") > 0) {
            return (parseFloat(expression) / 100.0) * relativeValue
        }
        else if (typeof expression === "function") {
            return expression(relativeFrame)
        }
        else {
            return 0
        }
    }

    left(expression: LayoutExpression, toView: UIView | undefined = undefined, toViewAlignment: UILayoutAlignment = UILayoutAlignment.End, targetViewAlignment: UILayoutAlignment = UILayoutAlignment.Start): UILayoutController {
        if (toView === undefined) { toViewAlignment = UILayoutAlignment.Start }
        this.addRelation(toView || this.owner.superview, LayoutType.Left, expression, { toViewAlignment, targetViewAlignment })
        return this
    }

    top(expression: LayoutExpression, toView: UIView | undefined = undefined, toViewAlignment: UILayoutAlignment = UILayoutAlignment.End, targetViewAlignment: UILayoutAlignment = UILayoutAlignment.Start): UILayoutController {
        if (toView === undefined) { toViewAlignment = UILayoutAlignment.Start }
        this.addRelation(toView || this.owner.superview, LayoutType.Top, expression, { toViewAlignment, targetViewAlignment })
        return this
    }

    right(expression: LayoutExpression, toView: UIView | undefined = undefined, toViewAlignment: UILayoutAlignment = UILayoutAlignment.Start, targetViewAlignment: UILayoutAlignment = UILayoutAlignment.End): UILayoutController {
        if (toView === undefined) { toViewAlignment = UILayoutAlignment.End }
        this.addRelation(toView || this.owner.superview, LayoutType.Right, expression, { toViewAlignment, targetViewAlignment })
        return this
    }

    bottom(expression: LayoutExpression, toView: UIView | undefined = undefined, toViewAlignment: UILayoutAlignment = UILayoutAlignment.Start, targetViewAlignment: UILayoutAlignment = UILayoutAlignment.End): UILayoutController {
        if (toView === undefined) { toViewAlignment = UILayoutAlignment.End }
        this.addRelation(toView || this.owner.superview, LayoutType.Bottom, expression, { toViewAlignment, targetViewAlignment })
        return this
    }

    width(expression: LayoutExpression, toView: UIView | undefined = undefined): UILayoutController {
        this.addRelation(toView || this.owner.superview, LayoutType.Width, expression)
        return this
    }

    height(expression: LayoutExpression, toView: UIView | undefined = undefined): UILayoutController {
        this.addRelation(toView || this.owner.superview, LayoutType.Height, expression)
        return this
    }

    center(toView: UIView | undefined = undefined): UILayoutController {
        this.addRelation(toView || this.owner.superview, LayoutType.Left, 0, { toViewAlignment: UILayoutAlignment.Middle, targetViewAlignment: UILayoutAlignment.Middle })
        this.addRelation(toView || this.owner.superview, LayoutType.Top, 0, { toViewAlignment: UILayoutAlignment.Middle, targetViewAlignment: UILayoutAlignment.Middle })
        return this
    }

    centerX(expression: LayoutExpression = 0, toView: UIView | undefined = undefined): UILayoutController {
        this.addRelation(toView || this.owner.superview, LayoutType.Left, expression, { toViewAlignment: UILayoutAlignment.Middle, targetViewAlignment: UILayoutAlignment.Middle })
        return this
    }

    centerY(expression: LayoutExpression = 0, toView: UIView | undefined = undefined): UILayoutController {
        this.addRelation(toView || this.owner.superview, LayoutType.Top, expression, { toViewAlignment: UILayoutAlignment.Middle, targetViewAlignment: UILayoutAlignment.Middle })
        return this
    }

    edge(inset: UIEdgeInsets, toView: UIView | undefined = undefined): UILayoutController {
        this.addRelation(toView || this.owner.superview, LayoutType.Edge, 0, { toViewAlignment: UILayoutAlignment.Start, targetViewAlignment: UILayoutAlignment.Start, inset })
        return this
    }

    full(toView: UIView | undefined = undefined): UILayoutController {
        this.clear()
        this.addRelation(toView || this.owner.superview, LayoutType.Full, 0)
        return this
    }

    clear() {
        this.linkedItems.forEach(it => {
            it.layoutController.layoutItems = it.layoutController.layoutItems.filter(item => item.target !== it)
        })
        this.linkedItems = []
    }

    private addRelation(toView: UIView | undefined, type: LayoutType, expression: number | string | ((relativeFrame: UIRect) => number), options: any = {}) {
        if (toView === undefined) { return }
        toView.layoutController.layoutItems = toView.layoutController.layoutItems.filter(it => {
            return !(it.target === this.owner && it.type === type)
        })
        toView.layoutController.layoutItems.push({
            target: this.owner,
            type,
            expression,
            options,
        })
        this.linkedItems.push(toView)
    }

}