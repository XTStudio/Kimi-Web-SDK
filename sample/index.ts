/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class FooViewController extends UIViewController {

    e = new UIPageViewController

    viewDidLoad() {
        super.viewDidLoad()
        this.title = "First Page"
        this.e.pageItems = [
            (() => {
                let v = new UIViewController()
                v.view.backgroundColor = UIColor.gray
                v.view.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
                    if (this.navigationController) {
                        const r = new UIViewController
                        // r.title = "Second"
                        r.view.backgroundColor = UIColor.yellow
                        this.navigationController.pushViewController(r)
                    }
                }))
                return v
            })(),
            (() => {
                let v = new UIViewController()
                v.view.backgroundColor = UIColor.green
                return v
            })(),
            (() => {
                let v = new UIViewController()
                v.view.backgroundColor = UIColor.yellow
                return v
            })(),
        ]
        this.e.loops = true
        this.addChildViewController(this.e)
        this.view.addSubview(this.e.view)
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        this.e.view.frame = this.view.bounds
    }

}

const fooWindow = new UIWindow
const ee = new UITabBarController
const a = new UINavigationController(new FooViewController)
a.tabBarItem.title = "首页"
const b = new UINavigationController(new UIViewController)
b.tabBarItem.title = "我"
ee.setViewControllers([
    a,
    b,
], false)
fooWindow.rootViewController = ee
global.fooWindow = fooWindow
