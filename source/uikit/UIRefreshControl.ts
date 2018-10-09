import { UIView } from "./UIView";
import { UIColor } from "./UIColor";
import { UIScrollView } from "./UIScrollView";

class UIRefreshAnimationView extends UIView {

    leftDot = new UIView
    midDot = new UIView
    rightDot = new UIView

    constructor() {
        super()
        this.leftDot.alpha = 0.5
        this.leftDot.layer.cornerRadius = 4.0
        this.midDot.alpha = 0.5
        this.midDot.layer.cornerRadius = 4.0
        this.rightDot.alpha = 0.5
        this.rightDot.layer.cornerRadius = 4.0
        this.addSubview(this.leftDot)
        this.addSubview(this.midDot)
        this.addSubview(this.rightDot)
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.leftDot.frame = { x: this.bounds.width / 2.0 - 4.0 - 28, y: this.bounds.height / 2.0 - 4.0, width: 8.0, height: 8.0 }
        this.midDot.frame = { x: this.bounds.width / 2.0 - 4.0, y: this.bounds.height / 2.0 - 4.0, width: 8.0, height: 8.0 }
        this.rightDot.frame = { x: this.bounds.width / 2.0 + 4.0 + 20, y: this.bounds.height / 2.0 - 4.0, width: 8.0, height: 8.0 }
    }

    private intervalHandler: any
    private currentIdx = 0

    startAnimation() {
        this.stopAnimation()
        this.currentIdx = 0
        this.doAnimation()
        this.intervalHandler = setInterval(() => {
            this.currentIdx = this.currentIdx + 1
            if (this.currentIdx == 3) {
                this.currentIdx = 0
            }
            this.doAnimation()
        }, 1250 / 3)
    }

    doAnimation() {
        this.leftDot.alpha = this.currentIdx == 0 ? 1.0 : 0.5
        this.midDot.alpha = this.currentIdx == 1 ? 1.0 : 0.5
        this.rightDot.alpha = this.currentIdx == 2 ? 1.0 : 0.5
    }

    stopAnimation() {
        this.leftDot.alpha = 0.5
        this.midDot.alpha = 0.5
        this.rightDot.alpha = 0.5
        clearInterval(this.intervalHandler)
    }

    tintColorDidChange() {
        super.tintColorDidChange()
        this.leftDot.backgroundColor = this.tintColor
        this.midDot.backgroundColor = this.tintColor
        this.rightDot.backgroundColor = this.tintColor
    }

}

export class UIRefreshControl extends UIView {

    animationView = new UIRefreshAnimationView()
    scrollView: UIScrollView | undefined = undefined

    constructor() {
        super()
        this.animationView.alpha = 0.0
        this.tintColor = UIColor.gray
    }

    enabled: boolean = true

    refreshing: boolean = false

    tintColorDidChange() {
        super.tintColorDidChange()
        this.animationView.tintColor = this.tintColor
    }

    beginRefreshing_callFromScrollView() {
        this.refreshing = true
        this.animationView.startAnimation()
        this.emit("refresh", this)
    }

    beginRefreshing() {
        if (this.scrollView === undefined) {
            return
        }
        this.refreshing = true
        this.scrollView.setContentOffset({ x: 0.0, y: -this.scrollView.contentInset.top - 44.0 }, true)
        this.animationView.startAnimation()
        setTimeout(() => {
            this.animationView.alpha = 1.0
            this.emit("refresh", this)
        }, 750)
    }

    endRefreshing() {
        if (this.scrollView) {
            if (this.scrollView.contentOffset.y < -this.scrollView.contentInset.top) {
                this.scrollView.setContentOffset({ x: 0.0, y: -this.scrollView.contentInset.top }, true)
            }
        }
        this.animationView.alpha = 0.0
        this.animationView.stopAnimation()
        this.refreshing = false
    }

}