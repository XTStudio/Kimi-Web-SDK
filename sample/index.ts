/// <reference path="../node_modules/xtstudio/types/index.d.ts" />

class BarViewController extends UIViewController {

    viewDidLoad() {
        super.viewDidLoad()
        this.view.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
            this.dismissViewController()
        }))
        this.view.backgroundColor = UIColor.green
    }

}

class FooViewController extends UIViewController {

    aView = new UIView

    viewDidLoad() {
        super.viewDidLoad()
        this.aView.backgroundColor = UIColor.white
        this.aView.addGestureRecognizer(new UITapGestureRecognizer().on("touch", () => {
            const alert = new UIActionSheet
            alert.message = "退出后不会删除任何历史数据，下次登录依然可以使用本帐号。"
            alert.addDangerAction("退出登录", () => {
                console.log("vvv")
            })
            alert.addCancelAction("取消", () => {
                console.log("ccc")
            })
            alert.show()
            // this.presentViewController(new BarViewController)
        }))
        this.view.addSubview(this.aView)
    }

    viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        this.aView.frame = this.view.bounds
    }

}

const fooWindow = new UIWindow
fooWindow.rootViewController = new FooViewController
global.fooWindow = fooWindow
