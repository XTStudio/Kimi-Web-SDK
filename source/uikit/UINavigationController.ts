import { UIViewController } from "./UIViewController";
import { UINavigationBar } from "./UINavigationBar";
import { UIColor } from "./UIColor";
import { UIRect } from "./UIRect";
import { UIView } from "./UIView";
import { UIAnimator } from "./UIAnimator";
import { UINavigationBarViewController } from "./UINavigationBarViewController";
import { Router } from "./helpers/Router";

export class UINavigationController extends UIViewController {

    _isUINavigationController = true

    constructor(readonly rootViewController: UIViewController) {
        super()
    }

    navigationBar = new UINavigationBar

    private beingAnimating = false

    viewDidLoad() {
        this.navigationBar.navigationController = this
        this.iView.backgroundColor = UIColor.clear
        this.iView.addSubview(this.navigationBar)
        if (this.rootViewController) {
            this.pushViewController(this.rootViewController, false)
        }
        super.viewDidLoad()
    }

    pushViewController(viewController: UIViewController, animated: boolean = true) {
        if (this.beingAnimating) { return }
        if (this.childViewControllers.length > 0) {
            viewController.hidesBottomBarWhenPushed = true
        }
        if (viewController.hidesBottomBarWhenPushed) {
            if (this.tabBarController) {
                this.tabBarController.iView.bringSubviewToFront(this.iView)
            }
        }
        this.addChildViewController(viewController)
        this.iView.addSubview(viewController.iView)
        viewController.iView.frame = this.contentFrame(viewController)
        const fromViewController = this.childViewControllers[this.childViewControllers.length - 2]
        const toViewController = this.childViewControllers[this.childViewControllers.length - 1]
        if (animated != false && fromViewController != undefined && toViewController != undefined) {
            fromViewController.viewWillDisappear(true)
            toViewController.viewWillAppear(true)
            this.beingAnimating = true
            this.doPushAnimation(fromViewController, toViewController, () => {
                fromViewController.viewDidDisappear(true)
                toViewController.viewDidAppear(true)
                this.childViewControllers.forEach(it => {
                    if (it == toViewController) { return }
                    it.iView.hidden = true
                })
                this.beingAnimating = false
                if (this.childViewControllers.length > 1) {
                    Router.shared.addRoute(toViewController, () => {
                        this.popToViewController(fromViewController, false)
                    })
                }
                this.updateBrowserTitle()
            })
            this.navigationBar.pushNavigationItem(toViewController.navigationItem, true)
        }
        else {
            fromViewController && fromViewController.viewWillDisappear(false)
            toViewController && toViewController.viewWillAppear(false)
            fromViewController && fromViewController.viewDidDisappear(false)
            toViewController && toViewController.viewDidAppear(false)
            if (toViewController) {
                this.navigationBar.pushNavigationItem(toViewController.navigationItem, false)
            }
            this.childViewControllers.forEach(it => {
                if (it == toViewController) { return }
                it.iView.hidden = true
            })
            if (this.childViewControllers.length > 1) {
                Router.shared.addRoute(toViewController, () => {
                    this.popToViewController(fromViewController, false)
                })
            }
            this.updateBrowserTitle()
        }
    }

    popViewController(animated: boolean = true): UIViewController | undefined {
        if (this.beingAnimating) { return undefined }
        const fromViewController = this.childViewControllers[this.childViewControllers.length - 1]
        const toViewController = this.childViewControllers[this.childViewControllers.length - 2]
        if (fromViewController === undefined || toViewController === undefined) {
            return undefined
        }
        toViewController.iView.hidden = false
        fromViewController.viewWillDisappear(animated)
        toViewController.viewWillAppear(animated)
        if (animated != false) {
            this.beingAnimating = true
            this.doPopAnimation(fromViewController, toViewController, () => {
                fromViewController.removeFromParentViewController()
                fromViewController.iView.removeFromSuperview()
                fromViewController.viewDidDisappear(true)
                toViewController.viewDidAppear(true)
                if (!toViewController.hidesBottomBarWhenPushed) {
                    if (this.tabBarController) {
                        this.tabBarController.iView.bringSubviewToFront(this.tabBarController.tabBar)
                    }
                }
                this.beingAnimating = false
                Router.shared.popToRoute(toViewController)
                this.updateBrowserTitle()
            })
        }
        else {
            fromViewController.removeFromParentViewController()
            fromViewController.iView.removeFromSuperview()
            toViewController.iView.frame = this.contentFrame(toViewController)
            fromViewController.viewDidDisappear(true)
            toViewController.viewDidAppear(true)
            if (!toViewController.hidesBottomBarWhenPushed) {
                if (this.tabBarController) {
                    this.tabBarController.iView.bringSubviewToFront(this.tabBarController.tabBar)
                }
            }
            Router.shared.popToRoute(toViewController)
            this.updateBrowserTitle()
        }
        this.navigationBar.popNavigationItem(animated != false)
        return fromViewController
    }

    popToViewController(viewController: UIViewController, animated: boolean = true): UIViewController[] {
        if (this.beingAnimating) { return [] }
        if (this.childViewControllers.indexOf(viewController) < 0) { return [] }
        const targetIndex = this.childViewControllers.indexOf(viewController)
        const fromViewControllers = this.childViewControllers.filter((_, index) => {
            return index > targetIndex
        })
        if (fromViewControllers.length == 0) {
            return []
        }
        const toViewController = viewController
        toViewController.iView.hidden = false
        fromViewControllers.forEach(it => { it.viewWillDisappear(animated) })
        toViewController.viewWillAppear(animated)
        if (animated != false) {
            this.beingAnimating = true
            this.doPopAnimation(fromViewControllers[fromViewControllers.length - 1], toViewController, () => {
                {
                    fromViewControllers.forEach(it => { it.removeFromParentViewController() })
                    fromViewControllers.forEach(it => { it.iView.removeFromSuperview() })
                    fromViewControllers.forEach(it => { it.viewDidDisappear(true) })
                    toViewController.viewDidAppear(true)
                    if (!toViewController.hidesBottomBarWhenPushed) {
                        if (this.tabBarController) {
                            this.tabBarController.iView.bringSubviewToFront(this.tabBarController.tabBar)
                        }
                    }
                    this.beingAnimating = false
                }
                Router.shared.popToRoute(toViewController)
                this.updateBrowserTitle()
            })
        }
        else {
            fromViewControllers.forEach(it => { it.removeFromParentViewController() })
            fromViewControllers.forEach(it => { it.iView.removeFromSuperview() })
            toViewController.iView.frame = this.contentFrame(toViewController)
            fromViewControllers.forEach(it => { it.viewDidDisappear(false) })
            toViewController.viewDidAppear(false)
            if (!toViewController.hidesBottomBarWhenPushed) {
                if (this.tabBarController) {
                    this.tabBarController.iView.bringSubviewToFront(this.tabBarController.tabBar)
                }
            }
            Router.shared.popToRoute(toViewController)
            this.updateBrowserTitle()
        }
        this.navigationBar.popToNavigationItem(toViewController.navigationItem, animated != false)
        return fromViewControllers
    }

    popToRootViewController(animated: boolean = true): UIViewController[] {
        const rootViewController = this.childViewControllers[0]
        if (rootViewController === undefined) {
            return []
        }
        return this.popToViewController(rootViewController, animated)
    }

    setViewControllers(viewControllers: UIViewController[], animated: boolean = false) {
        if (this.beingAnimating) { return }
        this.childViewControllers.forEach(it => {
            it.removeFromParentViewController()
            it.iView.removeFromSuperview()
        })
        viewControllers.forEach(it => {
            this.addChildViewController(it)
            this.iView.addSubview(it.iView)
            it.iView.frame = this.contentFrame(it)
        })
        this.navigationBar.setItems(viewControllers.map(it => { return it.navigationItem }), animated != false)
        if (viewControllers[viewControllers.length - 1] && viewControllers[viewControllers.length - 1].hidesBottomBarWhenPushed == true) {
            if (this.tabBarController) {
                this.tabBarController.iView.bringSubviewToFront(this.iView)
            }
        }
        else {
            if (this.tabBarController) {
                this.tabBarController.iView.bringSubviewToFront(this.tabBarController.tabBar)
            }
        }
        this.updateBrowserTitle()
    }

    viewWillLayoutSubviews() {
        this.navigationBar.frame = this.barFrame
        this.childViewControllers.forEach(it => {
            it.iView.frame = this.contentFrame(it)
        })
        super.viewWillLayoutSubviews()
    }

    public get barFrame(): UIRect {
        if (this.navigationBar.hidden) {
            return { x: 0.0, y: 0.0, width: this.iView.bounds.width, height: 0.0 }
        }
        return { x: 0.0, y: 0.0, width: this.iView.bounds.width, height: this.navigationBar.barHeight }
    }

    private contentFrame(viewController: UIViewController): UIRect {
        if (viewController.hidesBottomBarWhenPushed) {
            return { x: 0.0, y: this.barFrame.height, width: this.iView.bounds.width, height: this.iView.bounds.height - this.barFrame.height }
        }
        else {
            if (this.tabBarController !== undefined) {
                return { x: 0.0, y: this.barFrame.height, width: this.iView.bounds.width, height: this.iView.bounds.height - this.barFrame.height - this.tabBarController.tabBar.barHeight }
            }
            else {
                return { x: 0.0, y: this.barFrame.height, width: this.iView.bounds.width, height: this.iView.bounds.height - this.barFrame.height - 0.0 }
            }
        }
    }

    private doPushAnimation(fromViewController: UIViewController, toViewController: UIViewController, complete: () => void) {
        fromViewController.iView.frame = this.contentFrame(fromViewController)
        const contentFrame = this.contentFrame(toViewController)
        toViewController.iView.frame = { x: contentFrame.width, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
        UIAnimator.bouncy(0.0, 16.0, () => {
            const contentFrame = this.contentFrame(fromViewController)
            fromViewController.iView.frame = { x: -contentFrame.width * 0.25, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
            toViewController.iView.frame = this.contentFrame(toViewController)
        }, () => {
            complete()
        })
    }

    private doPopAnimation(fromViewController: UIViewController, toViewController: UIViewController, complete: () => void) {
        if (fromViewController instanceof UINavigationBarViewController) {
            fromViewController.iView.frame = this.iView.bounds
        }
        else {
            fromViewController.iView.frame = this.contentFrame(fromViewController)
        }
        {
            const contentFrame = this.contentFrame(toViewController)
            toViewController.iView.frame = { x: -contentFrame.width * 0.25, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
        }
        UIAnimator.bouncy(0.0, 16.0, () => {
            if (fromViewController instanceof UINavigationBarViewController) {
                fromViewController.iView.frame = { x: this.contentFrame(fromViewController).width, y: this.iView.frame.y, width: this.iView.frame.width, height: this.iView.frame.height }
            }
            else {
                const contentFrame = this.contentFrame(fromViewController)
                fromViewController.iView.frame = { x: contentFrame.width, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
            }
            toViewController.iView.frame = this.contentFrame(toViewController)
        }, () => {
            complete()
        })
    }

    private updateBrowserTitle() {
        if (this.presentedViewController !== undefined) { return }
        let activeViewController = this.childViewControllers[this.childViewControllers.length - 1]
        if (activeViewController && activeViewController.title) {
            document.title = activeViewController.title
        }
    }

    didAddSubview(subview: UIView) {
        this.iView.bringSubviewToFront(this.navigationBar)
        super.didAddSubview(subview)
    }

    setNavigationBarHidden(hidden: boolean, animated: boolean, fadeAnimation: boolean = false) {
        if (animated) {
            if (fadeAnimation) {
                this.navigationBar.hidden = hidden
                this.navigationBar.alpha = hidden ? 1.0 : 0.0
            }
            UIAnimator.curve(0.25, () => {
                if (fadeAnimation) {
                    this.navigationBar.alpha = hidden ? 0.0 : 1.0
                }
                else {
                    this.navigationBar.hidden = hidden
                }
            }, undefined)
        }
        else {
            this.navigationBar.hidden = hidden
        }
        {
            const lastVC = this.childViewControllers[this.childViewControllers.length - 1]
            if (lastVC instanceof UINavigationBarViewController && lastVC.navigationControllerState) {
                lastVC.navigationControllerState.barHidden = hidden
            }
        }
    }

}