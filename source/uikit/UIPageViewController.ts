import { UIViewController } from "./UIViewController";
import { UIScrollView } from "./UIScrollView";
import { UIPointZero } from "./UIPoint";

export class UIPageViewController extends UIViewController {

    constructor(readonly isVertical: boolean = false) {
        super()
    }

    loops: boolean = false

    private _pageItems: UIViewController[] | undefined = undefined

    public get pageItems(): UIViewController[] | undefined {
        return this._pageItems;
    }

    public set pageItems(value: UIViewController[] | undefined) {
        this._pageItems = value;
        if (value && value.length > 0) {
            this.currentPage = value[0]
            this.resetContents()
        }
    }

    private _currentPage: UIViewController | undefined = undefined

    public get currentPage(): UIViewController | undefined {
        return this._currentPage;
    }

    public set currentPage(value: UIViewController | undefined) {
        if (this._currentPage) { this._currentPage.removeFromParentViewController() }
        this._currentPage = value;
        if (value) {
            if (value.parentViewController != this) {
                this.addChildViewController(value)
            }
        }
        this.resetContents()
    }

    scrollToNextPage(animated: boolean = true) {
        if (this.isVertical == true) {
            if (this.scrollView.contentInset.bottom > 0.0) {
                this.scrollView.setContentOffset({ x: 0.0, y: this.scrollView.contentInset.bottom }, animated)
                if (animated == false) {
                    this.changeContents()
                }
            }
        }
        else {
            if (this.scrollView.contentInset.right > 0.0) {
                this.scrollView.setContentOffset({ x: this.scrollView.contentInset.right, y: 0.0 }, animated)
                if (animated == false) {
                    this.changeContents()
                }
            }
        }
    }

    scrollToPreviousPage(animated: boolean = true) {
        if (this.isVertical == true) {
            if (this.scrollView.contentInset.top > 0.0) {
                this.scrollView.setContentOffset({ x: 0.0, y: -this.scrollView.contentInset.top }, animated)
                if (animated == false) {
                    this.changeContents()
                }
            }
        }
        else {
            if (this.scrollView.contentInset.left > 0.0) {
                this.scrollView.setContentOffset({ x: -this.scrollView.contentInset.left, y: 0.0 }, animated)
                if (animated == false) {
                    this.changeContents()
                }
            }
        }
    }

    protected beforeViewController(currentPage: UIViewController): UIViewController | undefined {
        if (this.pageItems !== undefined) {
            const currentIndex = this.pageItems.indexOf(currentPage)
            if (currentIndex >= 0) {
                if (currentIndex > 0) {
                    return this.pageItems[currentIndex - 1]
                }
                else if (this.loops && this.pageItems.length > 1) {
                    return this.pageItems[this.pageItems.length - 1]
                }
            }
            else {
                return undefined
            }
        }
        return this.val("beforeViewController", currentPage)
    }

    protected afterViewController(currentPage: UIViewController): UIViewController | undefined {
        if (this.pageItems !== undefined) {
            const currentIndex = this.pageItems.indexOf(currentPage)
            if (currentIndex >= 0) {
                if (currentIndex + 1 < this.pageItems.length) {
                    return this.pageItems[currentIndex + 1]
                }
                else if (this.loops && this.pageItems.length > 1) {
                    return this.pageItems[0]
                }
            }
            else {
                return undefined
            }
        }
        return this.val("afterViewController", currentPage)
    }

    protected didFinishAnimating(currentPage: UIViewController, previousPage: UIViewController) {
        this.emit("didFinishAnimating", currentPage, previousPage)
    }

    // Implementation

    private scrollView = new UIScrollView()
        .on("didEndDecelerating", () => {
            this.changeContents()
        })
        .on("didEndScrollingAnimation", () => {
            this.changeContents()
        })

    viewDidLoad() {
        this.scrollView.pagingEnabled = true
        this.scrollView.bounces = false
        this.scrollView.showsHorizontalScrollIndicator = false
        this.scrollView.showsVerticalScrollIndicator = false
        this.view.addSubview(this.scrollView)
        super.viewDidLoad()
    }

    viewWillLayoutSubviews() {
        this.scrollView.frame = this.view.bounds
        this.scrollView.contentSize = { width: this.view.bounds.width, height: this.view.bounds.height }
        this.resetContents()
        super.viewWillLayoutSubviews()
    }

    private changeContents() {
        if (this.isVertical == true) {
            if (Math.abs(this.scrollView.contentOffset.y - (-this.scrollView.bounds.height)) < 4.0) {
                const currentPage = this.currentPage
                if (currentPage === undefined) {
                    return
                }
                const beforePage = this.beforeViewController(currentPage)
                if (beforePage === undefined) {
                    return
                }
                this.currentPage = beforePage
                this.resetContents()
                this.didFinishAnimating(beforePage, currentPage)
            }
            else if (Math.abs(this.scrollView.contentOffset.y - this.scrollView.bounds.height) < 4.0) {
                const currentPage = this.currentPage
                if (currentPage === undefined) {
                    return
                }
                const afterPage = this.afterViewController(currentPage)
                if (afterPage === undefined) {
                    return
                }
                this.currentPage = afterPage
                this.resetContents()
                this.didFinishAnimating(afterPage, currentPage)
            }
        }
        else {
            if (Math.abs(this.scrollView.contentOffset.x - (-this.scrollView.bounds.width)) < 4.0) {
                const currentPage = this.currentPage
                if (currentPage === undefined) {
                    return
                }
                const beforePage = this.beforeViewController(currentPage)
                if (beforePage === undefined) {
                    return
                }
                this.currentPage = beforePage
                this.resetContents()
                this.didFinishAnimating(beforePage, currentPage)
            }
            else if (Math.abs(this.scrollView.contentOffset.x - this.scrollView.bounds.width) < 4.0) {
                const currentPage = this.currentPage
                if (currentPage === undefined) {
                    return
                }
                const afterPage = this.afterViewController(currentPage)
                if (afterPage === undefined) {
                    return
                }
                this.currentPage = afterPage
                this.resetContents()
                this.didFinishAnimating(afterPage, currentPage)
            }
        }
    }

    private resetContents() {
        const currentPage = this.currentPage
        if (currentPage === undefined) {
            return
        }
        const beforePage = this.beforeViewController(currentPage)
        const afterPage = this.afterViewController(currentPage)
        this.scrollView.subviews.forEach(it => {
            if (it != currentPage.view && (beforePage === undefined || it != beforePage.view) && (afterPage === undefined || it != afterPage.view)) {
                it.removeFromSuperview()
            }
        })
        currentPage.view.frame = this.view.bounds
        this.scrollView.addSubview(currentPage.view)
        if (beforePage) {
            this.scrollView.addSubview(beforePage.view)
            if (this.isVertical == true) {
                beforePage.view.frame = { x: 0.0, y: -this.view.bounds.height, width: this.view.bounds.width, height: this.view.bounds.height }
            }
            else {
                beforePage.view.frame = { x: -this.view.bounds.width, y: 0.0, width: this.view.bounds.width, height: this.view.bounds.height }
            }
        }
        if (afterPage) {
            this.scrollView.addSubview(afterPage.view)
            if (this.isVertical == true) {
                afterPage.view.frame = { x: 0.0, y: this.view.bounds.height, width: this.view.bounds.width, height: this.view.bounds.height }
            }
            else {
                afterPage.view.frame = { x: this.view.bounds.width, y: 0.0, width: this.view.bounds.width, height: this.view.bounds.height }
            }
        }
        if (this.isVertical == true) {
            this.scrollView.contentInset = {
                top: beforePage !== undefined ? Math.ceil(this.view.bounds.height) : 0.0,
                left: 0.0,
                bottom: afterPage !== undefined ? Math.ceil(this.view.bounds.height) : 0.0,
                right: 0.0
            }
        }
        else {
            this.scrollView.contentInset = {
                top: 0.0,
                left: beforePage !== undefined ? Math.ceil(this.view.bounds.width) : 0.0,
                bottom: 0.0,
                right: afterPage !== undefined ? Math.ceil(this.view.bounds.width) : 0.0
            }
        }
        this.scrollView.contentOffset = UIPointZero
    }

}