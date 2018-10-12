import { UIRect } from "./UIRect";
import { UIViewController } from "./UIViewController";
import { UITabBar } from "./UITabBar";

export class UITabBarController extends UIViewController {

    _isUITabBarController = true

    itemControllers: UIViewController[] = []

    private _selectedIndex: number = -1

    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    public set selectedIndex(value: number) {
        if (this._selectedIndex == value) {
            this.emit("onSelectedViewController", this, true)
            return
        }
        if (value < 0) {
            this._selectedIndex = value
            return
        }
        const oldIndex = this._selectedIndex
        if (this.itemControllers[value]) {
            const it = this.itemControllers[value]
            if (it.parentViewController === undefined) {
                this.addChildViewController(it)
                this.view.addSubview(it.view)
                this.view.bringSubviewToFront(this.tabBar)
                this.viewWillLayoutSubviews()
            }
        }
        if (this.itemControllers[oldIndex]) {
            this.itemControllers[oldIndex].viewWillDisappear(false)
        }
        if (this.itemControllers[value]) {
            this.itemControllers[value].viewWillAppear(false)
        }
        this._selectedIndex = value
        this.childViewControllers.forEach(it => {
            it.view.hidden = this.itemControllers.indexOf(it) != value
        })
        this.tabBar.setSelectedIndex(value)
        if (this.itemControllers[oldIndex]) {
            this.itemControllers[oldIndex].viewDidDisappear(false)
        }
        if (this.itemControllers[value]) {
            this.itemControllers[value].viewDidAppear(false)
        }
        this.emit("onSelectedViewController", this, false)
    }

    public get selectedViewController(): UIViewController {
        return this.itemControllers[this.selectedIndex]
    }

    public set selectedViewController(value: UIViewController) {
        this.selectedIndex = Math.max(0, this.itemControllers.indexOf(value))
    }

    setViewControllers(viewControllers: UIViewController[], animated: boolean = false) {
        this.childViewControllers.forEach(it => {
            it.removeFromParentViewController()
            it.view.removeFromSuperview()
        })
        this.itemControllers = viewControllers
        viewControllers.forEach((it, index) => {
            if (index == 0) {
                this.addChildViewController(it)
                this.view.addSubview(it.view)
            }
        })
        this.view.bringSubviewToFront(this.tabBar)
        this.tabBar.resetItems()
        this.selectedIndex = 0
        this.viewWillLayoutSubviews()
    }

    tabBar: UITabBar = new UITabBar

    // Implementation

    private get barFrame(): UIRect {
        if (this.tabBar.hidden) {
            return { x: 0.0, y: this.view.bounds.height, width: this.view.bounds.width, height: 0.0 }
        }
        return { x: 0.0, y: this.view.bounds.height - this.tabBar.barHeight, width: this.view.bounds.width, height: this.tabBar.barHeight }
    }

    private get contentFrame(): UIRect {
        return { x: 0.0, y: 0.0, width: this.view.bounds.width, height: this.view.bounds.height - this.barFrame.height }
    }

    private get navigationControllerFrame(): UIRect {
        return { x: 0.0, y: 0.0, width: this.view.bounds.width, height: this.view.bounds.height }
    }

    private get hidesBottomBarContentFrame(): UIRect {
        return { x: 0.0, y: 0.0, width: this.view.bounds.width, height: this.view.bounds.height }
    }

    viewDidLoad() {
        this.tabBar.tabBarController = this
        this.view.addSubview(this.tabBar)
        super.viewDidLoad()
    }

    viewWillLayoutSubviews() {
        this.tabBar.frame = this.barFrame
        this.childViewControllers.forEach(it => {
            if ((it as any)._isUINavigationController === true) {
                it.view.frame = this.navigationControllerFrame
            }
            else {
                it.view.frame = this.contentFrame
            }
        })
        super.viewWillLayoutSubviews()
    }

}