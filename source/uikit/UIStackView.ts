import { UILayoutConstraintAxis, UIStackViewDistribution, UIStackViewAlignment } from "./UIEnums";
import { UIView } from "./UIView";

export class UIStackView extends UIView {

    constructor(arrangedSubviews: UIView[] | undefined = undefined) {
        super()
        this.arrangedSubviews = arrangedSubviews || []
        this.arrangedSubviews.forEach(it => {
            this.addSubview(it)
        })
        setTimeout(() => {
            this._layoutArrangeSubviews()
        }, 0)
    }

    arrangedSubviews: UIView[] = []

    addArrangedSubview(view: UIView) {
        this.arrangedSubviews.push(view)
        this.addSubview(view)
        this._layoutArrangeSubviews()
    }

    removeArrangedSubview(view: UIView) {
        const idx = this.arrangedSubviews.indexOf(view)
        if (idx >= 0) {
            this.arrangedSubviews.splice(idx, 1)
            view.removeFromSuperview()
            this._layoutArrangeSubviews()
        }
    }

    insertArrangedSubview(view: UIView, atIndex: number) {
        this.arrangedSubviews.splice(atIndex, 0, view)
        this.addSubview(view)
        this._layoutArrangeSubviews()
    }

    layoutArrangedSubview(subview: UIView, size: { width: number | undefined, height: number | undefined } | undefined) {
        this.allLayoutWidths.delete(subview)
        this.allLayoutHeights.delete(subview)
        if (size) {
            if (size.width !== undefined) {
                this.allLayoutWidths.set(subview, size.width)
            }
            if (size.height !== undefined) {
                this.allLayoutHeights.set(subview, size.height)
            }
        }
        this._layoutArrangeSubviews()
    }

    private _axis: UILayoutConstraintAxis = UILayoutConstraintAxis.horizontal

    public get axis(): UILayoutConstraintAxis {
        return this._axis
    }

    public set axis(value: UILayoutConstraintAxis) {
        this._axis = value
        this._layoutArrangeSubviews()
    }

    private _distribution: UIStackViewDistribution = UIStackViewDistribution.fill

    public get distribution(): UIStackViewDistribution {
        return this._distribution
    }

    public set distribution(value: UIStackViewDistribution) {
        this._distribution = value
        this._layoutArrangeSubviews()
    }

    private _alignment: UIStackViewAlignment = UIStackViewAlignment.fill

    public get alignment(): UIStackViewAlignment {
        return this._alignment
    }

    public set alignment(value: UIStackViewAlignment) {
        this._alignment = value
        this._layoutArrangeSubviews()
    }

    private _spacing: number = 0.0

    public get spacing(): number {
        return this._spacing
    }

    public set spacing(value: number) {
        this._spacing = value
        this._layoutArrangeSubviews()
    }

    // Implementation

    private allLayoutWidths: Map<UIView, number> = new Map()

    private allLayoutHeights: Map<UIView, number> = new Map()

    layoutSubviews() {
        super.layoutSubviews()
        this._layoutArrangeSubviews()
    }

    _layoutArrangeSubviews() {
        if (this.arrangedSubviews.length == 0) { return }
        let x: number[] = []
        let y: number[] = []
        let width: number[] = []
        let height: number[] = []
        let axisLocation: number[]
        let axisLength: number[]
        let alignLocation: number[]
        let alignLength: number[]
        let axisValues: Map<UIView, number>
        let alignValues: Map<UIView, number>
        let boundsAxisLength: number
        let boundsAlignLength: number
        if (this.axis == UILayoutConstraintAxis.horizontal) {
            axisLocation = x
            axisLength = width
            alignLocation = y
            alignLength = height
            axisValues = this.allLayoutWidths
            alignValues = this.allLayoutHeights
            boundsAxisLength = this.bounds.width
            boundsAlignLength = this.bounds.height
        }
        else {
            axisLocation = y
            axisLength = height
            alignLocation = x
            alignLength = width
            axisValues = this.allLayoutHeights
            alignValues = this.allLayoutWidths
            boundsAxisLength = this.bounds.height
            boundsAlignLength = this.bounds.width
        }
        switch (this.distribution) {
            case UIStackViewDistribution.fill: {
                let axisValuesSum = 0
                axisValues.forEach(it => {
                    axisValuesSum += it
                })
                var leftSpace = boundsAxisLength - axisValuesSum
                var location = 0.0
                this.arrangedSubviews.forEach((view, index) => {
                    var space = 0.0
                    const target = axisValues.get(view)
                    if (target !== undefined) {
                        space = target
                    }
                    else {
                        space = leftSpace
                        leftSpace = 0.0
                    }
                    axisLocation.push(location)
                    axisLength.push(space)
                    location += space
                })
                break
            }
            case UIStackViewDistribution.fillEqually: {
                this.arrangedSubviews.forEach((_, index) => {
                    axisLocation.push(boundsAxisLength / this.arrangedSubviews.length * index)
                    axisLength.push(boundsAxisLength / this.arrangedSubviews.length)
                })
                break
            }
            case UIStackViewDistribution.fillProportionally: {
                if (this.arrangedSubviews.length == 1) {
                    axisLocation.push(0.0)
                    axisLength.push(this.bounds.width)
                }
                else {
                    const everyWidth = (boundsAxisLength - ((this.arrangedSubviews.length - 1) * this.spacing)) / this.arrangedSubviews.length
                    this.arrangedSubviews.forEach((_, index) => {
                        axisLocation.push((everyWidth + this.spacing) * index)
                        axisLength.push(everyWidth)
                    })
                }
                break
            }
            case UIStackViewDistribution.equalSpacing: {
                if (this.arrangedSubviews.length == 1) {
                    axisLocation.push(0.0)
                    axisLength.push(boundsAxisLength)
                }
                else {
                    let axisValuesSum = 0
                    axisValues.forEach(it => {
                        axisValuesSum += it
                    })
                    const spacing = (boundsAxisLength - axisValuesSum) / (this.arrangedSubviews.length - 1)
                    var location = 0.0
                    this.arrangedSubviews.forEach(view => {
                        axisLocation.push(location)
                        var space = axisValues.get(view) || 0.0
                        axisLength.push(space)
                        location += space + spacing
                    })
                }
                break
            }
            case UIStackViewDistribution.equalCentering: {
                if (this.arrangedSubviews.length > 2) {
                    const firstViewCenterX = (axisValues.get(this.arrangedSubviews[0]) || 0.0) / 2.0
                    const lastViewCenterX = boundsAxisLength - (axisValues.get(this.arrangedSubviews[this.arrangedSubviews.length - 1]) || 0.0) / 2.0
                    const everyCenterSpace = (lastViewCenterX - firstViewCenterX) / (this.arrangedSubviews.length - 1)
                    var location = 0.0
                    this.arrangedSubviews.forEach((it, index) => {
                        var space = axisValues.get(it) || 0.0
                        axisLength.push(space)
                        if (index > 0) {
                            location -= space / 2.0
                        }
                        axisLocation.push(location)
                        location += space / 2.0 + everyCenterSpace
                    })
                }
                else if (this.arrangedSubviews.length == 2) {
                    var leftSpace = boundsAxisLength
                    var location = 0.0
                    axisLocation.push(location)
                    const firstSpace = axisValues.get(this.arrangedSubviews[0]) || 0.0
                    axisLength.push(firstSpace)
                    leftSpace -= firstSpace
                    location += firstSpace
                    const secondSpace = axisValues.get(this.arrangedSubviews[1]) !== undefined ? axisValues.get(this.arrangedSubviews[1]) : leftSpace
                    axisLocation.push(boundsAxisLength - (secondSpace || 0.0))
                    axisLength.push(secondSpace || 0.0)
                }
                else if (this.arrangedSubviews.length == 1) {
                    axisLocation.push(0.0)
                    axisLength.push(boundsAxisLength)
                }
                break
            }
        }
        switch (this.alignment) {
            case UIStackViewAlignment.fill: {
                this.arrangedSubviews.forEach(_ => {
                    alignLocation.push(0.0)
                    alignLength.push(boundsAlignLength)
                })
                break
            }
            case UIStackViewAlignment.leading: {
                this.arrangedSubviews.forEach(it => {
                    alignLocation.push(0.0)
                    alignLength.push(alignValues.get(it) || 0.0)
                })
                break
            }
            case UIStackViewAlignment.center: {
                this.arrangedSubviews.forEach(it => {
                    const space = alignValues.get(it) || 0.0
                    alignLocation.push((boundsAlignLength - space) / 2.0)
                    alignLength.push(space)
                })
                break
            }
            case UIStackViewAlignment.trailing: {
                this.arrangedSubviews.forEach(it => {
                    const space = alignValues.get(it) || 0.0
                    alignLocation.push(boundsAlignLength - space)
                    alignLength.push(space)
                })
                break
            }
        }
        if (this.axis == UILayoutConstraintAxis.horizontal) {
            this.arrangedSubviews.forEach((view, index) => {
                view.frame = { x: axisLocation[index], y: alignLocation[index], width: axisLength[index], height: alignLength[index] }
            })
        }
        else {
            this.arrangedSubviews.forEach((view, index) => {
                view.frame = { x: alignLocation[index], y: axisLocation[index], width: alignLength[index], height: axisLength[index] }
            })
        }
    }

}