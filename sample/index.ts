/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class FooViewController extends UIViewController {

    e = new UIView

    viewDidLoad() {
        super.viewDidLoad()
        this.title = "First Page"
        this.e.backgroundColor = UIColor.red
        this.e.layer.cornerRadius = 8
        this.e.frame = { x: 44, y: 44, width: 44, height: 44 }
        this.e.addGestureRecognizer(new UITapGestureRecognizer().on('touch', () => {
            if (this.navigationController) {
                this.navigationController.pushViewController(new FooViewController)
            }
        }))
        this.view.addSubview(this.e)
        // this.view.backgroundColor = UIColor.yellow
    }

}

const fooWindow = new UIWindow
fooWindow.rootViewController = new UINavigationController(new FooViewController)
global.fooWindow = fooWindow
