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
fooWindow.rootViewController = new UINavigationController(new FooViewController)
global.fooWindow = fooWindow
