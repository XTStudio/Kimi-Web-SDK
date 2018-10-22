import { EventEmitter } from "../kimi/EventEmitter";
import { UIView, UIWindow } from "./UIView";
import { UIColor } from "./UIColor";
import { UINavigationItem } from "./UINavigationBar";
import { UITabBarItem } from "./UITabBarItem";

export class UIViewController extends EventEmitter {

    private _isUIViewController = true

    private _title: string | undefined = undefined

    public get title(): string | undefined {
        return this._title;
    }

    public set title(value: string | undefined) {
        this._title = value;
        this.navigationItem.viewController = this
        this.navigationItem.setNeedsUpdate()
    }

    protected _view: any = undefined

    public set view(value: UIView) {
        if (this._view !== undefined) { return }
        this._view = value
    }

    public get view(): UIView {
        return this.iView
    }

    public get iView(): UIView {
        this.loadViewIfNeed()
        return this._view
    }

    loadViewIfNeed() {
        if (this._view === undefined) {
            this.loadView()
            if (this._view) {
                this._view.viewDelegate = this
            }
            this.viewDidLoad()
        }
    }

    attachToElement(element: HTMLElement) {
        this.iView.attachToElement(element, this)
    }

    loadView() {
        this.view = new UIView
        this.iView.backgroundColor = UIColor.white
    }

    viewDidLoad() {
        this.navigationItem.viewController = this
    }

    viewWillAppear(animated: boolean) {
        this.childViewControllers.forEach(it => it.viewWillAppear(animated))
    }

    viewDidAppear(animated: boolean) {
        this.childViewControllers.forEach(it => it.viewDidAppear(animated))
    }

    viewWillDisappear(animated: boolean) {
        this.childViewControllers.forEach(it => it.viewWillDisappear(animated))
    }

    viewDidDisappear(animated: boolean) {
        this.childViewControllers.forEach(it => it.viewDidDisappear(animated))
    }

    viewWillLayoutSubviews() {
        this.emit("viewWillLayoutSubviews", this)
    }

    viewDidLayoutSubviews() { }

    parentViewController: UIViewController | undefined = undefined
    presentedViewController: UIViewController | undefined = undefined
    presentingViewController: UIViewController | undefined = undefined

    presentViewController(viewController: UIViewController, animated: boolean = true, completion: (() => void) | undefined = undefined) {
        const window = this.window
        if (window === undefined) { return }
        const visibleViewController = this.visibleViewController
        if (visibleViewController === undefined) { return }
        if (visibleViewController.presentedViewController !== undefined || viewController.presentingViewController !== undefined || viewController.parentViewController !== undefined) {
            return
        }
        visibleViewController.viewWillDisappear(animated != false)
        viewController.viewWillAppear(animated != false)
        viewController.presentingViewController = visibleViewController
        visibleViewController.presentedViewController = viewController
        window.presentViewController(viewController, animated != false, () => {
            completion && completion()
            visibleViewController.viewDidDisappear(animated != false)
            viewController.viewDidAppear(animated != false)
        })
    }

    dismissViewController(animated: boolean = true, completion: (() => void) | undefined = undefined) {
        const window = this.window
        if (window === undefined) {
            return
        }
        window.dismissViewController(animated != false, () => {
            completion && completion()
        })
    }

    childViewControllers: UIViewController[] = []

    addChildViewController(viewController: UIViewController) {
        if (viewController == this) { return }
        if (viewController.parentViewController) {
            if (viewController.parentViewController == this) { return }
            viewController.parentViewController.removeFromParentViewController()
        }
        viewController.willMoveToParentViewController(this)
        this.childViewControllers.push(viewController)
        viewController.parentViewController = this
        viewController.didMoveToParentViewController(this)
    }

    removeFromParentViewController() {
        if (this.parentViewController) {
            const it = this.parentViewController
            this.willMoveToParentViewController(undefined)
            const idx = it.childViewControllers.indexOf(this)
            if (idx >= 0) {
                it.childViewControllers.splice(idx, 1)
            }
            this.parentViewController = undefined
            this.didMoveToParentViewController(undefined)
        }
    }

    willMoveToParentViewController(parent: UIViewController | undefined) { }

    didMoveToParentViewController(parent: UIViewController | undefined) { }

    didAddSubview(subview: UIView) { }

    public get navigationController(): any {
        let current: UIViewController | undefined = this
        while (current != undefined) {
            if ((current as any)._isUINavigationController === true) {
                return current as any
            }
            current = current.parentViewController
        }
        return undefined
    }

    navigationItem = new UINavigationItem

    hidesBottomBarWhenPushed: boolean = false

    public get tabBarController(): any {
        var current: UIViewController | undefined = this
        while (current != undefined) {
            if ((current as any)._isUITabBarController === true) {
                return current as any
            }
            current = current.parentViewController
        }
        return undefined
    }

    tabBarItem = new UITabBarItem

    private _window: UIWindow | undefined = undefined

    public get window(): UIWindow | undefined {
        return this._window || (this.parentViewController ? this.parentViewController.window : undefined);
    }

    public set window(value: UIWindow | undefined) {
        this._window = value;
    }

    public get visibleViewController(): UIViewController | undefined {
        if (this.window && this.window.presentedViewControllers.length > 0) {
            return this.window.presentedViewControllers[this.window.presentedViewControllers.length - 1]
        }
        else if (this.window) {
            return this.window.rootViewController
        }
        return undefined
    }

    // // Device Back Button Support

    // fun canGoBack(childBacking: Boolean = false): Boolean {
    //     if (UIActionSheet.currentActionSheet != null) {
    //         return true
    //     }
    //     if (!childBacking && this.window?.presentedViewControllers?.count() ?: 0 > 0) {
    //         return true
    //     }
    //     (this as? UINavigationController)?.let {
    //         return it.childViewControllers.count() > 1
    //     }
    //     (this as? UITabBarController)?.let {
    //         return it.selectedViewController?.canGoBack() ?: false
    //     }
    //     return false
    // }

    // fun goBack(childBacking: Boolean = false) {
    //     if (UIActionSheet.currentActionSheet != null) {
    //         UIActionSheet.currentActionSheet?.dismiss(true) { }
    //         return
    //     }
    //     if (!childBacking && this.window?.presentedViewControllers?.count() ?: 0 > 0) {
    //         this.window?.presentedViewControllers?.lastOrNull()?.takeIf { it.canGoBack(true) }?.let {
    //             return it.goBack(true)
    //         }
    //         this.window?.dismissViewController(true)
    //         return
    //     }
    //     (this as? UINavigationController)?.let {
    //         it.popViewController(true)
    //     }
    //     (this as? UITabBarController)?.let {
    //         it.selectedViewController?.goBack()
    //     }
    // }

    setNeedsStatusBarAppearanceUpdate() { }

}