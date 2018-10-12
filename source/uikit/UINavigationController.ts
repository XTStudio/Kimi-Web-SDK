import { UIViewController } from "./UIViewController";
import { UINavigationBar } from "./UINavigationBar";
import { UIColor } from "./UIColor";
import { UIRect } from "./UIRect";
import { UIView } from "./UIView";
import { UIAnimator } from "./UIAnimator";
import { UINavigationBarViewController } from "./UINavigationBarViewController";

export class UINavigationController extends UIViewController {

    _isUINavigationController = true

    constructor(readonly rootViewController: UIViewController) {
        super()
    }

    navigationBar = new UINavigationBar

    private beingAnimating = false

    viewDidLoad() {
        this.navigationBar.navigationController = this
        this.view.backgroundColor = UIColor.clear
        this.view.addSubview(this.navigationBar)
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
                this.tabBarController.view.bringSubviewToFront(this.view)
            }
        }
        this.addChildViewController(viewController)
        this.view.addSubview(viewController.view)
        viewController.view.frame = this.contentFrame(viewController)
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
                    it.view.hidden = true
                })
                this.beingAnimating = false
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
                it.view.hidden = true
            })
        }
    }

    popViewController(animated: boolean = true): UIViewController | undefined {
        if (this.beingAnimating) { return undefined }
        const fromViewController = this.childViewControllers[this.childViewControllers.length - 1]
        const toViewController = this.childViewControllers[this.childViewControllers.length - 2]
        if (fromViewController === undefined || toViewController === undefined) {
            return undefined
        }
        toViewController.view.hidden = false
        fromViewController.viewWillDisappear(animated)
        toViewController.viewWillAppear(animated)
        if (animated != false) {
            this.beingAnimating = true
            this.doPopAnimation(fromViewController, toViewController, () => {
                fromViewController.removeFromParentViewController()
                fromViewController.view.removeFromSuperview()
                fromViewController.viewDidDisappear(true)
                toViewController.viewDidAppear(true)
                if (!toViewController.hidesBottomBarWhenPushed) {
                    if (this.tabBarController) {
                        this.tabBarController.view.bringSubviewToFront(this.tabBarController.tabBar)
                    }
                }
                this.beingAnimating = false
            })
        }
        else {
            fromViewController.removeFromParentViewController()
            fromViewController.view.removeFromSuperview()
            toViewController.view.frame = this.contentFrame(toViewController)
            fromViewController.viewDidDisappear(true)
            toViewController.viewDidAppear(true)
            if (!toViewController.hidesBottomBarWhenPushed) {
                if (this.tabBarController) {
                    this.tabBarController.view.bringSubviewToFront(this.tabBarController.tabBar)
                }
            }
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
        toViewController.view.hidden = false
        fromViewControllers.forEach(it => { it.viewWillDisappear(animated) })
        toViewController.viewWillAppear(animated)
        if (animated != false) {
            this.beingAnimating = true
            this.doPopAnimation(fromViewControllers[fromViewControllers.length - 1], toViewController, () => {
                {
                    fromViewControllers.forEach(it => { it.removeFromParentViewController() })
                    fromViewControllers.forEach(it => { it.view.removeFromSuperview() })
                    fromViewControllers.forEach(it => { it.viewDidDisappear(true) })
                    toViewController.viewDidAppear(true)
                    if (!toViewController.hidesBottomBarWhenPushed) {
                        if (this.tabBarController) {
                            this.tabBarController.view.bringSubviewToFront(this.tabBarController.tabBar)
                        }
                    }
                    this.beingAnimating = false
                }
            })
        }
        else {
            fromViewControllers.forEach(it => { it.removeFromParentViewController() })
            fromViewControllers.forEach(it => { it.view.removeFromSuperview() })
            toViewController.view.frame = this.contentFrame(toViewController)
            fromViewControllers.forEach(it => { it.viewDidDisappear(false) })
            toViewController.viewDidAppear(false)
            if (!toViewController.hidesBottomBarWhenPushed) {
                if (this.tabBarController) {
                    this.tabBarController.view.bringSubviewToFront(this.tabBarController.tabBar)
                }
            }
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
            it.view.removeFromSuperview()
        })
        viewControllers.forEach(it => {
            this.addChildViewController(it)
            this.view.addSubview(it.view)
            it.view.frame = this.contentFrame(it)
        })
        this.navigationBar.setItems(viewControllers.map(it => { return it.navigationItem }), animated != false)
        if (viewControllers[viewControllers.length - 1] && viewControllers[viewControllers.length - 1].hidesBottomBarWhenPushed == true) {
            if (this.tabBarController) {
                this.tabBarController.view.bringSubviewToFront(this.view)
            }
        }
        else {
            if (this.tabBarController) {
                this.tabBarController.view.bringSubviewToFront(this.tabBarController.tabBar)
            }
        }
    }

    viewWillLayoutSubviews() {
        this.navigationBar.frame = this.barFrame
        this.childViewControllers.forEach(it => {
            it.view.frame = this.contentFrame(it)
        })
        super.viewWillLayoutSubviews()
    }

    public get barFrame(): UIRect {
        if (this.navigationBar.hidden) {
            return { x: 0.0, y: 0.0, width: this.view.bounds.width, height: 0.0 }
        }
        return { x: 0.0, y: 0.0, width: this.view.bounds.width, height: this.navigationBar.barHeight }
    }

    private contentFrame(viewController: UIViewController): UIRect {
        if (viewController.hidesBottomBarWhenPushed) {
            return { x: 0.0, y: this.barFrame.height, width: this.view.bounds.width, height: this.view.bounds.height - this.barFrame.height }
        }
        else {
            if (this.tabBarController !== undefined) {
                return { x: 0.0, y: this.barFrame.height, width: this.view.bounds.width, height: this.view.bounds.height - this.barFrame.height - this.tabBarController.tabBar.barHeight }
            }
            else {
                return { x: 0.0, y: this.barFrame.height, width: this.view.bounds.width, height: this.view.bounds.height - this.barFrame.height - 0.0 }
            }
        }
    }

    private doPushAnimation(fromViewController: UIViewController, toViewController: UIViewController, complete: () => void) {
        fromViewController.view.frame = this.contentFrame(fromViewController)
        const contentFrame = this.contentFrame(toViewController)
        toViewController.view.frame = { x: contentFrame.width, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
        UIAnimator.bouncy(0.0, 16.0, () => {
            const contentFrame = this.contentFrame(fromViewController)
            fromViewController.view.frame = { x: -contentFrame.width * 0.25, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
            toViewController.view.frame = this.contentFrame(toViewController)
        }, () => {
            complete()
        })
    }

    private doPopAnimation(fromViewController: UIViewController, toViewController: UIViewController, complete: () => void) {
        if (fromViewController instanceof UINavigationBarViewController) {
            fromViewController.view.frame = this.view.bounds
        }
        else {
            fromViewController.view.frame = this.contentFrame(fromViewController)
        }
        {
            const contentFrame = this.contentFrame(toViewController)
            toViewController.view.frame = { x: -contentFrame.width * 0.25, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
        }
        UIAnimator.bouncy(0.0, 16.0, () => {
            if (fromViewController instanceof UINavigationBarViewController) {
                fromViewController.view.frame = { x: this.contentFrame(fromViewController).width, y: this.view.frame.y, width: this.view.frame.width, height: this.view.frame.height }
            }
            else {
                const contentFrame = this.contentFrame(fromViewController)
                fromViewController.view.frame = { x: contentFrame.width, y: contentFrame.y, width: contentFrame.width, height: contentFrame.height }
            }
            toViewController.view.frame = this.contentFrame(toViewController)
        }, () => {
            complete()
        })
    }

    didAddSubview(subview: UIView) {
        this.view.bringSubviewToFront(this.navigationBar)
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