import { UIView } from "./UIView";
import { UIPointZero, UIPoint } from "./UIPoint";
import { UISize, UISizeZero } from "./UISize";
import { UIEdgeInsetsZero, UIEdgeInsets } from "./UIEdgeInsets";
import { UIPanGestureRecognizer } from "./UIPanGestureRecognizer";
import { UIRect } from "./UIRect";
import { UIAnimator } from "./UIAnimator";
import { UITouch } from "./UITouch";
import { Scroller } from "./helpers/Scroller";
import { UIColor } from "./UIColor";
import { UIRefreshControl } from "./UIRefreshControl";
import { UIFetchMoreControl } from "./UIFetchMoreControl";
import { IdelQueue } from "./helpers/IdelQueue";

class ScrollerView extends UIView {

    private isScrollerView = true

    placeholderElement = document.createElement("div")

    constructor() {
        super()
        this.domElement.style.overflow = "scroll"
        this.domElement.style.paddingRight = "44px"
        this.domElement.style.paddingBottom = "44px"
        this.placeholderElement.style.position = "absolute"
        this.placeholderElement.style.width = "44px"
        this.placeholderElement.style.height = "44px"
        this.domElement.appendChild(this.placeholderElement)
    }

    private isOverBoundsX = false
    private isOverBoundsY = false

    setContentOffset(contentOffset: UIPoint) {
        if (contentOffset.x < 0) {
            this.domElement.style.left = -contentOffset.x + "px"
            this.domElement.scrollLeft = contentOffset.x
            this.isOverBoundsX = true
        }
        else {
            if (this.isOverBoundsX) {
                this.domElement.style.left = null
                this.isOverBoundsX = false
            }
            this.domElement.scrollLeft = contentOffset.x
        }
        if (contentOffset.y < 0) {
            this.domElement.style.top = -contentOffset.y + "px"
            this.domElement.scrollTop = contentOffset.y
            this.isOverBoundsY = true
        }
        else {
            if (this.isOverBoundsY) {
                this.domElement.style.top = null
                this.isOverBoundsY = false
            }
            this.domElement.scrollTop = contentOffset.y
        }
    }

    setContentSizeAndContentInset(contentSize: UISize, contentInset: UIEdgeInsets) {
        this.placeholderElement.style.left = ((contentSize.width + contentInset.right) - 1) + "px"
        this.placeholderElement.style.top = ((contentSize.height + contentInset.bottom) - 1) + "px"
    }

}

export class UIScrollView extends UIView {

    private _contentOffset: UIPoint = UIPointZero

    /**
     * Getter contentOffset
     * @return {UIPoint }
     */
    public get contentOffset(): UIPoint {
        return this._contentOffset;
    }

    /**
     * Setter contentOffset
     * @param {UIPoint } value
     */
    public set contentOffset(value: UIPoint) {
        this._contentOffset = value;
        this.contentView.setContentOffset(value)
        this.resetScrollIndicators()
        this.contentOffsetDidChanged()
    }

    protected contentOffsetDidChanged() { }

    private _contentSize: UISize = UISizeZero

    /**
     * Getter contentSize
     * @return {UISize }
     */
    public get contentSize(): UISize {
        return this._contentSize;
    }

    /**
     * Setter contentSize
     * @param {UISize } value
     */
    public set contentSize(value: UISize) {
        this._contentSize = value;
        this.contentView.setContentSizeAndContentInset(this._contentSize, this._contentInset)
        this.resetLockedDirection()
    }

    private _contentInset: UIEdgeInsets = UIEdgeInsetsZero

    /**
     * Getter contentInset
     * @return {UIEdgeInsets }
     */
    public get contentInset(): UIEdgeInsets {
        return this._contentInset;
    }

    /**
     * Setter contentInset
     * @param {UIEdgeInsets } value
     */
    public set contentInset(value: UIEdgeInsets) {
        const deltaX = value.left - this._contentInset.left
        const deltaY = value.top - this._contentInset.top
        this._contentInset = value;
        this.setContentOffset({ x: this.contentOffset.x - deltaX, y: this.contentOffset.y - deltaY }, false)
        this.resetLockedDirection()
    }

    directionalLockEnabled: boolean = false

    bounces: boolean = true

    alwaysBounceVertical: boolean = false

    alwaysBounceHorizontal: boolean = false

    pagingEnabled: boolean = false

    private _scrollEnabled: boolean = true

    /**
     * Getter scrollEnabled
     * @return {boolean }
     */
    public get scrollEnabled(): boolean {
        return this._scrollEnabled;
    }

    /**
     * Setter scrollEnabled
     * @param {boolean } value
     */
    public set scrollEnabled(value: boolean) {
        this._scrollEnabled = value;
        this.panGestureRecognizer.enabled = value
    }

    private _showsHorizontalScrollIndicator: boolean = true

    /**
     * Getter showsHorizontalScrollIndicator
     * @return {boolean }
     */
    public get showsHorizontalScrollIndicator(): boolean {
        return this._showsHorizontalScrollIndicator;
    }

    /**
     * Setter showsHorizontalScrollIndicator
     * @param {boolean } value
     */
    public set showsHorizontalScrollIndicator(value: boolean) {
        this._showsHorizontalScrollIndicator = value;
    }

    private _showsVerticalScrollIndicator: boolean = true

    /**
     * Getter showsVerticalScrollIndicator
     * @return {boolean }
     */
    public get showsVerticalScrollIndicator(): boolean {
        return this._showsVerticalScrollIndicator;
    }

    /**
     * Setter showsVerticalScrollIndicator
     * @param {boolean } value
     */
    public set showsVerticalScrollIndicator(value: boolean) {
        this._showsVerticalScrollIndicator = value;
    }

    setContentOffset(contentOffset: UIPoint, animated: boolean): void {
        this.scroller.abortAnimation()
        if (this.decelerating) {
            this.didEndDecelerating()
        }
        if (animated) {
            this.scroller.startScroll(
                this.contentOffset.x,
                this.contentOffset.y,
                (contentOffset.x - this.contentOffset.x),
                (contentOffset.y - this.contentOffset.y),
                500
            )
            this.loopScrollAnimation(true)
        }
        else {
            this.contentOffset = contentOffset
            this.didScroll()
        }
    }

    scrollRectToVisible(rect: UIRect, animated: boolean): void {
        var targetContentOffset = this.contentOffset
        if (rect.x < this.contentOffset.x) {
            targetContentOffset = { x: rect.x, y: targetContentOffset.y }
        }
        else if (rect.x + rect.width > this.contentOffset.x + this.bounds.width) {
            targetContentOffset = { x: rect.x + rect.width - this.bounds.width, y: targetContentOffset.y }
        }
        if (rect.y < this.contentOffset.y) {
            targetContentOffset = { x: targetContentOffset.x, y: rect.y }
        }
        else if (rect.y + rect.height > this.contentOffset.y + this.bounds.height) {
            targetContentOffset = { x: targetContentOffset.x, y: rect.y + rect.height - this.bounds.height }
        }
        targetContentOffset = {
            x: Math.max(0.0, Math.min(this.contentSize.width - this.bounds.width, targetContentOffset.x)),
            y: Math.max(0.0, Math.min(this.contentSize.height - this.bounds.height, targetContentOffset.y))
        }
        this.setContentOffset(targetContentOffset, animated)
    }

    private _tracking: boolean = false

    /**
     * Getter tracking
     * @return {boolean }
     */
    public get tracking(): boolean {
        return this._tracking;
    }

    /**
     * Setter tracking
     * @param {boolean } value
     */
    public set tracking(value: boolean) {
        this._tracking = value;
        this.resetScrollIndicatorVisibleState()
    }

    private _dragging: boolean = false

    /**
     * Getter dragging
     * @return {boolean }
     */
    public get dragging(): boolean {
        return this._dragging;
    }

    /**
     * Setter dragging
     * @param {boolean } value
     */
    public set dragging(value: boolean) {
        this._dragging = value;
        this.resetScrollIndicatorVisibleState()
    }

    private _decelerating: boolean = false

    /**
     * Getter decelerating
     * @return {boolean }
     */
    public get decelerating(): boolean {
        return this._decelerating;
    }

    /**
     * Setter decelerating
     * @param {boolean } value
     */
    public set decelerating(value: boolean) {
        this._decelerating = value;
        this.resetScrollIndicatorVisibleState()
    }

    scrollsToTop: boolean = false

    // Implementation

    private panGestureRecognizer = new UIPanGestureRecognizer

    private contentView = new ScrollerView

    private scroller = new Scroller

    private currentLockedDirection: number | undefined = undefined

    private horizontalScrollIndicator: UIView = new UIView

    private verticalScrollIndicator: UIView = new UIView

    constructor() {
        super()
        this.panGestureRecognizer
            .on("began", (sender: UIPanGestureRecognizer) => {
                this.deceleratingWasCancelled = false
                this.currentLockedDirection = undefined
                sender.setTranslation({ x: 0, y: 0 }, undefined)
                this.willBeginDragging()
            })
            .on("changed", (sender: UIPanGestureRecognizer) => {
                let translation = sender.translationInView(undefined)
                if (this.directionalLockEnabled && this.currentLockedDirection == undefined) {
                    if (Math.abs(translation.x) >= 4.0) {
                        this.currentLockedDirection = 0
                    }
                    else if (Math.abs(translation.y) >= 4.0) {
                        this.currentLockedDirection = 1
                    }
                    return
                }
                else if (this.directionalLockEnabled && this.currentLockedDirection == 0) {
                    translation = { x: translation.x, y: 0.0 }
                }
                else if (this.directionalLockEnabled && this.currentLockedDirection == 1) {
                    translation = { x: 0.0, y: translation.y }
                }
                this.createFetchMoreEffect(translation)
                const refreshOffset: number | undefined = this.createRefreshEffect(translation)
                // if (refreshOffset == undefined) {
                //     this.createBounceEffect(translation, this.locationInView(undefined))
                // }
                this.contentOffset = {
                    x: Math.max(-this.contentInset.left, Math.min(Math.max(0.0, this.contentSize.width + this.contentInset.right - this.bounds.width), this.contentOffset.x - translation.x)),
                    y: Math.max(-this.contentInset.top - (this.refreshControl && this.refreshControl.enabled ? 240.0 : 0.0), Math.min(Math.max(0.0, this.contentSize.height + this.contentInset.bottom - this.bounds.height), this.contentOffset.y - (refreshOffset !== undefined ? refreshOffset : translation.y)))
                }
                sender.setTranslation({ x: 0, y: 0 }, undefined)
                this.didScroll()
            })
            .on("ended", (sender: UIPanGestureRecognizer) => {
                // if (!this.edgeVerticalEffect.isFinished || !this.edgeHorizontalEffect.isFinished) {
                //     this.edgeVerticalEffect.onRelease()
                //     this.edgeHorizontalEffect.onRelease()
                //     this.startFinishEdgeAnimation()
                // }
                var velocity = sender.velocityInView(undefined)
                if (this.directionalLockEnabled && this.currentLockedDirection == undefined) {
                    velocity = UIPointZero
                }
                else if (this.directionalLockEnabled && this.currentLockedDirection == 0) {
                    velocity = { x: velocity.x, y: 0.0 }
                }
                else if (this.directionalLockEnabled && this.currentLockedDirection == 1) {
                    velocity = { x: 0.0, y: velocity.y }
                }
                this.willEndDragging(velocity)
                if (this.refreshControl !== undefined && this.refreshControl.animationView.alpha >= 1.0) {
                    this.didEndDragging(false)
                    this.willBeginDecelerating()
                    this.didEndDecelerating()
                    this.refreshControl.beginRefreshing_callFromScrollView()
                    this.setContentOffset({ x: 0.0, y: -this.contentInset.top - 44.0 }, true)
                }
                else if (this.refreshControl !== undefined && this.refreshControl.animationView.alpha > 0.0) {
                    this.didEndDragging(false)
                    this.willBeginDecelerating()
                    this.didEndDecelerating()
                    this.refreshControl.animationView.alpha = 0.0
                    this.setContentOffset({ x: 0.0, y: -this.contentInset.top }, true)
                }
                else if (this.shouldDecelerating(velocity)) {
                    this.didEndDragging(true)
                    this.willBeginDecelerating()
                    this.startDecelerating(velocity)
                }
                else {
                    this.didEndDragging(false)
                    this.willBeginDecelerating()
                    this.didEndDecelerating()
                }
            })
        this.addGestureRecognizer(this.panGestureRecognizer)
        super.addSubview(this.contentView)
        this.setupScrollIndicators()
        this.clipsToBounds = true
    }

    private resetLockedDirection() {
        const contentWidth = this.contentSize.width + this.contentInset.left + this.contentInset.right
        const contentHeight = this.contentSize.height + this.contentInset.top + this.contentInset.bottom
        if (contentWidth <= this.bounds.width && contentHeight <= this.bounds.height) {
            this.panGestureRecognizer.lockedDirection = 0
        }
        else if (contentWidth <= this.bounds.width) {
            this.panGestureRecognizer.lockedDirection = 1
        }
        else if (contentHeight <= this.bounds.height) {
            this.panGestureRecognizer.lockedDirection = 2
        }
    }

    private deceleratingWasCancelled = false

    touchesBegan(touches: UITouch[]) {
        super.touchesBegan(touches)
        this.deceleratingWasCancelled = false
        if (!this.scroller.finished) {
            UIView.recognizedGesture = this.panGestureRecognizer
            this.scroller.abortAnimation()
            this.tracking = true
            if (this.decelerating) {
                this.deceleratingWasCancelled = true
                this.didEndDecelerating()
            }
        }
    }

    touchesEnded(touches: UITouch[]) {
        super.touchesEnded(touches)
        this.tracking = false
        if (this.deceleratingWasCancelled && this.pagingEnabled) {
            this.startDecelerating({ x: 0, y: 0 })
        }
        if (this.deceleratingWasCancelled) {
            setTimeout(() => {
                UIView.recognizedGesture = undefined
            }, 0)
        }
    }

    touchesCancelled(touches: UITouch[]) {
        super.touchesCancelled(touches)
        this.tracking = false
        if (this.deceleratingWasCancelled && this.pagingEnabled) {
            this.startDecelerating({ x: 0, y: 0 })
        }
        if (this.deceleratingWasCancelled) {
            setTimeout(() => {
                UIView.recognizedGesture = undefined
            }, 0)
        }
    }

    touchesWheel(delta: UIPoint) {
        if (!this.userInteractionEnabled || this.hidden || this.alpha <= 0.0 || !this.scrollEnabled) {
            super.touchesWheel(delta)
            return
        }
        this.contentOffset = {
            x: Math.max(-this.contentInset.left, Math.min(Math.max(0.0, this.contentSize.width + this.contentInset.right - this.bounds.width), this.contentOffset.x - delta.x)),
            y: Math.max(-this.contentInset.top, Math.min(Math.max(0.0, this.contentSize.height + this.contentInset.bottom - this.bounds.height), this.contentOffset.y - delta.y))
        }
        this.didScroll()
    }

    didScroll() {
        this.emit("didScroll", this)
    }

    willBeginDragging() {
        this.emit("willBeginDragging", this)
        this.tracking = true
        this.dragging = true
        IdelQueue.shared.markBusy()
    }

    willEndDragging(velocity: UIPoint) {
        this.emit("willEndDragging", this, velocity)
    }

    didEndDragging(decelerate: Boolean) {
        this.tracking = false
        this.dragging = false
        this.emit("didEndDragging", this, decelerate)
    }

    willBeginDecelerating() {
        this.emit("willBeginDecelerating", this)
        this.decelerating = true
    }

    didEndDecelerating() {
        this.decelerating = false
        this.emit("didEndDecelerating", this)
        IdelQueue.shared.markIdel()
    }

    didEndScrollingAnimation() {
        this.emit("didEndScrollingAnimation", this)
    }

    didScrollToTop() {
        this.emit("didScrollToTop", this)
    }

    private shouldDecelerating(velocity: UIPoint): Boolean {
        if (this.pagingEnabled) {
            return true
        }
        if (velocity.y > 0 && this.contentOffset.y < this.contentSize.height + this.contentInset.bottom - this.bounds.height) {
            return true
        }
        else if (velocity.y < 0 && this.contentOffset.y > -this.contentInset.top) {
            return true
        }
        if (velocity.x > 0 && this.contentOffset.x < this.contentSize.width + this.contentInset.right - this.bounds.width) {
            return true
        }
        else if (velocity.x < 0 && this.contentOffset.x > -this.contentInset.left) {
            return true
        }
        return false
    }

    private startDecelerating(velocity: UIPoint) {
        this.scroller.fling(
            this.contentOffset.x,
            this.contentOffset.y,
            -velocity.x,
            -velocity.y,
            -this.contentInset.left - 1000,
            (this.contentSize.width + this.contentInset.right - this.bounds.width) + 1000,
            -this.contentInset.top - 1000,
            (this.contentSize.height + this.contentInset.bottom - this.bounds.height) + 1000
        )
        if (this.pagingEnabled) {
            this.scroller.abortAnimation()
            const minY = Math.floor(this.contentOffset.y / this.bounds.height) * this.bounds.height
            const maxY = Math.ceil(this.contentOffset.y / this.bounds.height) * this.bounds.height
            const minX = Math.floor(this.contentOffset.x / this.bounds.width) * this.bounds.width
            const maxX = Math.ceil(this.contentOffset.x / this.bounds.width) * this.bounds.width
            this.scroller.startScroll(
                this.contentOffset.x,
                this.contentOffset.y,
                Math.ceil(Math.max(minX, Math.min(maxX, (Math.round(this.scroller.finalX / this.bounds.width) * this.bounds.width))) - this.contentOffset.x),
                Math.ceil(Math.max(minY, Math.min(maxY, (Math.round(this.scroller.finalY / this.bounds.height) * this.bounds.height))) - this.contentOffset.y),
                500
            )
        }
        this.loopScrollAnimation()
    }

    private loopScrollAnimation(ignoreBounds: boolean = false) {
        const finished = !this.scroller.computeScrollOffset()
        if (!finished) {
            var minY = -this.contentInset.top
            if (this.refreshControl && this.refreshControl.refreshing === true) {
                minY -= 44.0
            }
            if (ignoreBounds === true && this.contentSize.height !== 0.0) {
                minY = -Infinity
            }
            this.contentOffset = {
                x: Math.max(-this.contentInset.left, Math.min(Math.max(-this.contentInset.left, this.contentSize.width + this.contentInset.right - this.bounds.width), this.scroller.currX)),
                y: Math.max(minY, Math.min(Math.max(minY, this.contentSize.height + this.contentInset.bottom - this.bounds.height), this.scroller.currY))
            }
            this.didScroll()
            if (this.contentSize.height > this.bounds.height && Math.abs(this.scroller.currY - this.contentOffset.y) > 0.01) {
                this.scroller.forceFinished(true)
                this.didEndDecelerating()
                return
            }
            if (this.contentSize.width > this.bounds.width && Math.abs(this.scroller.currX - this.contentOffset.x) > 0.01) {
                this.scroller.forceFinished(true)
                this.didEndDecelerating()
                return
            }
            requestAnimationFrame(() => {
                this.loopScrollAnimation(ignoreBounds)
            })
        }
        else if (this.decelerating) {
            this.didEndDecelerating()
        }
        else {
            this.didEndScrollingAnimation()
        }
    }

    // ScrollIndicator

    private setupScrollIndicators() {
        this.horizontalScrollIndicator.backgroundColor = new UIColor(0x8f / 255.0, 0x8f / 255.0, 0x90 / 255.0, 1.0)
        this.horizontalScrollIndicator.alpha = 0.0
        this.horizontalScrollIndicator.layer.cornerRadius = 1.0
        super.addSubview(this.horizontalScrollIndicator)
        this.verticalScrollIndicator.backgroundColor = new UIColor(0x8f / 255.0, 0x8f / 255.0, 0x90 / 255.0, 1.0)
        this.verticalScrollIndicator.alpha = 0.0
        this.verticalScrollIndicator.layer.cornerRadius = 1.0
        super.addSubview(this.verticalScrollIndicator)
    }

    private resetScrollIndicatorVisibleState() {
        if (this.tracking || this.dragging || this.decelerating) {
            if (this.showsHorizontalScrollIndicator) {
                this.horizontalScrollIndicator.alpha = 1.0
            }
            if (this.showsVerticalScrollIndicator) {
                this.verticalScrollIndicator.alpha = 1.0
            }
        }
        else {
            if (this.horizontalScrollIndicator.alpha > 0.0) {
                UIAnimator.linear(0.3, () => {
                    this.horizontalScrollIndicator.alpha = 0.0
                }, undefined)
            }
            if (this.verticalScrollIndicator.alpha > 0.0) {
                UIAnimator.linear(0.3, () => {
                    this.verticalScrollIndicator.alpha = 0.0
                }, undefined)
            }
        }
    }

    private resetScrollIndicators() {
        const contentWidth = this.contentInset.left + this.contentInset.right + this.contentSize.width
        if (contentWidth > this.bounds.width) {
            const xProgress = (this.contentOffset.x + this.contentInset.left) / (contentWidth - this.bounds.width)
            const xWidth = Math.max(36.0, (this.bounds.width - 8.0) / (contentWidth / (this.bounds.width - 8.0)))
            this.horizontalScrollIndicator.frame = {
                x: 4.0 + xProgress * ((this.bounds.width - 8.0) - xWidth),
                y: this.bounds.height - 4.0,
                width: xWidth,
                height: 2.0
            }
        }
        else {
            this.horizontalScrollIndicator.frame = {
                x: 0.0,
                y: this.bounds.height - 4.0,
                width: 0.0,
                height: 2.0
            }
        }
        const contentHeight = this.contentInset.top + this.contentInset.bottom + this.contentSize.height
        if (contentHeight > this.bounds.height) {
            const yProgress = (this.contentOffset.y + this.contentInset.top) / (contentHeight - this.bounds.height)
            const yHeight = Math.max(36.0, (this.bounds.height - 8.0) / (contentHeight / (this.bounds.height - 8.0)))
            this.verticalScrollIndicator.frame = {
                x: this.bounds.width - 4.0,
                y: 4.0 + yProgress * ((this.bounds.height - 8.0) - yHeight),
                width: 2.0,
                height: yHeight
            }
        }
        else {
            this.verticalScrollIndicator.frame = {
                x: this.bounds.width - 4.0,
                y: 0.0,
                width: 2.0,
                height: 0.0
            }
        }
    }

    // Proxy

    public get subviews(): UIView[] {
        return this.contentView.subviews
    }

    insertSubviewAtIndex(view: UIView, index: number) {
        this.contentView.insertSubviewAtIndex(view, index)
    }

    exchangeSubview(index1: number, index2: number) {
        this.contentView.exchangeSubview(index1, index2)
    }

    addSubview(view: UIView) {
        if (view instanceof UIRefreshControl) {
            this.refreshControl = view
            return
        }
        if (view instanceof UIFetchMoreControl) {
            this.fetchMoreControl = view
            return
        }
        this.contentView.addSubview(view)
    }

    insertSubviewBelowSubview(view: UIView, belowSubview: UIView) {
        this.contentView.insertSubviewBelowSubview(view, belowSubview)
    }

    insertSubviewAboveSubview(view: UIView, belowSubview: UIView) {
        this.contentView.insertSubviewAboveSubview(view, belowSubview)
    }

    bringSubviewToFront(view: UIView) {
        this.contentView.bringSubviewToFront(view)
    }

    sendSubviewToBack(view: UIView) {
        this.contentView.sendSubviewToBack(view)
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.contentView.frame = this.bounds
        this.resetLockedDirection()
        if (this.refreshControl) {
            this.refreshControl.animationView.frame = { x: 0.0, y: 0.0, width: this.bounds.width, height: 44.0 }
        }
    }

    didMoveToWindow() {
        this.contentView.setContentOffset(this.contentOffset)
    }

    // RefreshControl
    private _refreshControl: UIRefreshControl | undefined = undefined

    public get refreshControl(): UIRefreshControl | undefined {
        return this._refreshControl;
    }

    public set refreshControl(value: UIRefreshControl | undefined) {
        this._refreshControl = value;
        if (value) {
            super.addSubview(value.animationView)
            value.animationView.frame = { x: 0, y: 0, width: this.bounds.width, height: 44.0 }
            value.scrollView = this
        }
    }

    private createRefreshEffect(translation: UIPoint): number | undefined {
        if (this.refreshControl && this.refreshControl.enabled && this.contentSize.width <= this.bounds.width) {
            {
                const it = this.refreshControl.animationView
                if (it.frame.y != this.contentInset.top) {
                    it.frame = { x: it.frame.x, y: this.contentInset.top, width: it.frame.width, height: it.frame.height }
                }
            }
            if (this.contentOffset.y - translation.y < -this.contentInset.top) {
                const progress = Math.max(0.0, Math.min(1.0, (-this.contentInset.top - (this.contentOffset.y - translation.y)) / 88.0))
                this.refreshControl.animationView.alpha = progress
                return translation.y / 3.0
            }
            else {
                this.refreshControl.animationView.alpha = 0.0
            }
        }
        return undefined
    }

    // FetchMoreControl

    private _fetchMoreControl: UIFetchMoreControl | undefined = undefined

    /**
     * Getter fetchMoreControl
     * @return {UIFetchMoreControl }
     */
    public get fetchMoreControl(): UIFetchMoreControl | undefined {
        return this._fetchMoreControl;
    }

    /**
     * Setter fetchMoreControl
     * @param {UIFetchMoreControl } value
     */
    public set fetchMoreControl(value: UIFetchMoreControl | undefined) {
        this._fetchMoreControl = value;
        if (value) {
            value.scrollView = this
        }
    }

    private createFetchMoreEffect(translation: UIPoint): boolean {
        if (this.fetchMoreControl && this.fetchMoreControl.enabled && this.contentSize.width <= this.bounds.width) {
            if (this.fetchMoreControl.fetching) {
                return true
            }
            else if (this.contentOffset.y - translation.y > this.contentSize.height + this.contentInset.bottom - this.bounds.height * 2) {
                this.fetchMoreControl.beginFetching()
                return true
            }
        }
        return false
    }

}